import { Scalar } from 'ffjavascript'
import ethers from 'ethers'

import { postPoolTransaction, getAccounts } from '../apis/rollup'
import { fix2Float } from './float16'
import { CliExternalOperator } from './cli-external-operator'
import { addPoolTransaction } from './tx-pool'
import { contractAddresses } from './constants'
import { tokenTypes, detectTokenType, approve } from './tokens'
import { getEthereumAddress, getAccountIndex } from './addresses'
import { getContract } from './contracts'
import HermezABI from './abis/HermezABI.json'
import ERC777ABI from './abis/ERC777ABI.json'

const partialHermezABI = [
  'function addL1Transaction(uint256,uint48,uint16,uint16,uint32,uint48)'
]
const abiInterface = new ethers.utils.Interface(partialHermezABI)

export const TxType = {
  Deposit: 'Deposit',
  Transfer: 'Transfer',
  Withdraw: 'Withdrawn',
  Exit: 'Exit'
}

export const TxState = {
  Pending: 'pend'
}

/**
 * Get current average gas price from the last ethereum blocks and multiply it
 * @param {Number} multiplier - multiply the average gas price by this parameter
 * @returns {Promise} - promise will return the gas price obtained.
*/
export async function getGasPrice (multiplier) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const strAvgGas = await provider.getGasPrice()
  const avgGas = Scalar.e(strAvgGas)
  const res = (avgGas * Scalar.e(multiplier))
  const retValue = res.toString()
  return retValue
}

/**
 * Makes a deposit.
 * It detects if it's a 'createAccountDeposit' or a 'deposit' and prepares the parameters accodingly.
 * Detects if it's an Ether, ERC 20 or ERC 777 token and sends the transaction accordingly.
 *
 * @param {BigInt} amount - The amount to be deposited
 * @param {String} hezEthereumAddress - The Hermez address of the transaction sender
 * @param {Object} token - The token information object as returned from the API
 * @param {String} babyJubJub - The compressed BabyJubJub in hexadecimal format of the transaction sender.
 * @param {Number} gasLimit - Optional gas limit
 * @param {Bumber} gasMultiplier - Optional gas multiplier
 *
 * @returns {Promise} transaction
 */
export const deposit = async (amount, hezEthereumAddress, token, babyJubJub, gasLimit = 5000000, gasMultiplier = 1) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const hermezContract = new ethers.Contract(contractAddresses.Hermez, HermezABI, signer)

  const ethereumAddress = getEthereumAddress(hezEthereumAddress)
  let account = (await getAccounts(ethereumAddress, [token.id])).accounts[0]
  // TODO Remove once the hermez-node is ready
  account = undefined

  const overrides = {
    gasLimit,
    gasPrice: await getGasPrice(gasMultiplier)
  }

  const transactionParameters = [
    account ? 0 : `0x${babyJubJub}`,
    account ? getAccountIndex(account.accountIndex) : 0,
    fix2Float(amount),
    0,
    token.id,
    0
  ]

  if (token.id === 0) {
    overrides.value = amount
    return hermezContract.addL1Transaction(...transactionParameters, overrides)
  }

  const tokenType = await detectTokenType(token.ethereumAddress)
  if (tokenType === tokenTypes.ERC777) {
    const erc777Contract = getContract(token.ethereumAddress, ERC777ABI)
    const encodedTransactionParameters = abiInterface.encodeFunctionData('addL1Transaction', transactionParameters)
    return erc777Contract.send(contractAddresses.Hermez, amount, encodedTransactionParameters)
  } else if (tokenType === tokenTypes.ERC20) {
    await approve(amount, ethereumAddress, token.ethereumAddress)
    return hermezContract.addL1Transaction(...transactionParameters, overrides)
  } else {
    throw new Error('Not a valid ERC20 or ERC777 smart contract')
  }
}

export const withdraw = async (addressSC, tokenId, walletRollup, abi, urlOperator,
  numExitRoot, gasLimit = 5000000, gasMultiplier = 1) => {
  const { publicKey, publicKeyHex } = walletRollup
  const apiOperator = new CliExternalOperator(urlOperator)
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contractWithSigner = new ethers.Contract(addressSC, abi, signer)

  const overrides = {
    gasLimit,
    gasPrice: await getGasPrice(gasMultiplier, provider)
  }

  try {
    const res = await apiOperator.getExitInfo(tokenId, publicKeyHex[0], publicKeyHex[1], numExitRoot)
    const infoExitTree = res.data
    if (infoExitTree.found) {
      return await contractWithSigner.withdraw(infoExitTree.state.amount, numExitRoot,
        infoExitTree.siblings, publicKey, tokenId, overrides)
    }
    throw new Error(`No exit tree leaf was found in batch: ${numExitRoot} with babyjub: ${publicKeyHex}`)
  } catch (error) {
    throw new Error(`Message error: ${error.message}`)
  }
}

export const forceWithdraw = async (addressSC, tokenId, amount, walletRollup, abi,
  gasLimit = 5000000, gasMultiplier = 1) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contractWithSigner = new ethers.Contract(addressSC, abi, signer)

  const feeOnchainTx = await contractWithSigner.feeOnchainTx()
  const overrides = {
    gasLimit,
    gasPrice: await getGasPrice(gasMultiplier, provider),
    value: feeOnchainTx
  }

  const amountF = fix2Float(amount)
  try {
    return await contractWithSigner.forceWithdraw(walletRollup.publicKey, tokenId, amountF, overrides)
  } catch (error) {
    throw new Error(`Message error: ${error.message}`)
  }
}

// const exitAx = '0x0000000000000000000000000000000000000000000000000000000000000000'
// const exitAy = '0x0000000000000000000000000000000000000000000000000000000000000000'
// const exitEthAddr = '0x0000000000000000000000000000000000000000'

/**
 * Sends a L2 transaction to the Coordinator
 *
 * @param {Object} transaction - Transaction object prepared by TxUtils.generateL2Transaction
 * @param {String} bJJ - The compressed BabyJubJub in hexadecimal format of the transaction sender.
 *
 * @return {Object} - Object with the response status, transaction id and the transaction nonce
*/
export async function send (transaction, bJJ) {
  const result = await postPoolTransaction(transaction)

  if (result.status === 200) {
    addPoolTransaction(transaction, bJJ)
  }
  return {
    status: result.status,
    id: result.data,
    nonce: transaction.nonce
  }
}

import { Scalar } from 'ffjavascript'
import ethers from 'ethers'

import { postPoolTransaction, getAccounts, getAccount } from '../apis/rollup'
import { fix2Float } from './float16'
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
  Forged: 'fged',
  Forging: 'fing',
  Pending: 'pend',
  Invalid: 'invl'
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
  const hermezContract = getContract(contractAddresses.Hermez, HermezABI)

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

/**
 * Makes a force Exit. This is the L1 transaction equivalent of Exit.
 *
 * @param {BigInt} amount - The amount to be withdrawn
 * @param {String} accountIndex - The account index in hez address format e.g. hez:DAI:4444
 * @param {Object} token - The token information object as returned from the API
 * @param {Number} gasLimit - Optional gas limit
 * @param {Bumber} gasMultiplier - Optional gas multiplier
 */
export const forceExit = async (amount, accountIndex, token, gasLimit = 5000000, gasMultiplier = 1) => {
  const hermezContract = getContract(contractAddresses.Hermez, HermezABI)

  const account = await getAccount(accountIndex)
  const ethereumAddress = getEthereumAddress(account.hezEthereumAddress)

  const overrides = {
    gasLimit,
    gasPrice: await getGasPrice(gasMultiplier)
  }

  const transactionParameters = [
    0,
    getAccountIndex(accountIndex),
    0,
    fix2Float(amount),
    token.id,
    1
  ]

  if (token.id === 0) {
    overrides.value = amount
    return hermezContract.addL1Transaction(...transactionParameters, overrides)
      .then(() => {
        return transactionParameters
      })
  }

  await approve(amount, ethereumAddress, token.ethereumAddress)
  return hermezContract.addL1Transaction(...transactionParameters, overrides)
    .then(() => {
      return transactionParameters
    })
}

/**
 * Finalise the withdraw. This a L1 transaction.
 *
 * @param {BigInt} amount - The amount to be withdrawn
 * @param {String} accountIndex - The account index in hez address format e.g. hez:DAI:4444
 * @param {Object} token - The token information object as returned from the API
 * @param {String} babyJubJub - The compressed BabyJubJub in hexadecimal format of the transaction sender.
 * @param {BigInt} merkleRoot -
 * @param {Array} merkleSiblings -
 * @param {Number} gasLimit - Optional gas limit
 * @param {Bumber} gasMultiplier - Optional gas multiplier
 */
export const withdraw = async (amount, accountIndex, token, babyJubJub, merkleRoot, merkleSiblings, gasLimit = 5000000, gasMultiplier = 1) => {
  const hermezContract = getContract(contractAddresses.Hermez, HermezABI)

  const account = await getAccount(accountIndex)
  const ethereumAddress = getEthereumAddress(account.hezEthereumAddress)

  const overrides = {
    gasLimit,
    gasPrice: await getGasPrice(gasMultiplier)
  }

  const transactionParameters = [
    token.id,
    amount,
    `0x${babyJubJub}`,
    merkleRoot,
    merkleSiblings,
    getAccountIndex(accountIndex),
    true
  ]

  console.log(transactionParameters)

  if (token.id === 0) {
    overrides.value = amount
    return hermezContract.withdrawMerkleProof(...transactionParameters, overrides)
      .then(() => {
        return transactionParameters
      })
  }

  await approve(amount, ethereumAddress, token.ethereumAddress)
  return hermezContract.withdrawMerkleProof(...transactionParameters, overrides)
    .then(() => {
      return transactionParameters
    })
}

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

/**
 * Gets the beautified name of a transaction state
 *
 * @param {String} transactionState - The original transaction state from the API
 *
 * @return {String} - The beautified transaction state
*/
export function beautifyTransactionState (transactionState) {
  return Object.keys(TxState).find(key => TxState[key] === transactionState)
}

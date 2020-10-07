import { Scalar } from 'ffjavascript'
import ethers from 'ethers'

import { postPoolTransaction } from '../apis/rollup'
import { fix2Float } from './float16'
import { CliExternalOperator } from './cli-external-operator'
import { addPoolTransaction } from './tx-pool'

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
 * @param {Object} provider - ethereum provider object
 * @returns {Promise} - promise will return the gas price obtained.
*/
export async function getGasPrice (multiplier, provider) {
  const strAvgGas = await provider.getGasPrice()
  const avgGas = Scalar.e(strAvgGas)
  const res = (avgGas * Scalar.e(multiplier))
  const retValue = res.toString()
  return retValue
}

export const deposit = async (addressSC, loadAmount, tokenId, walletRollup, abi, gasLimit = 5000000, gasMultiplier = 1) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contractWithSigner = new ethers.Contract(addressSC, abi, signer)

  const address = walletRollup.hermezEthereumAddress
  const feeOnchainTx = await contractWithSigner.feeOnchainTx()
  const feeDeposit = await contractWithSigner.depositFee()

  const overrides = {
    gasLimit,
    gasPrice: await getGasPrice(gasMultiplier, provider),
    value: `0x${(Scalar.add(feeOnchainTx, feeDeposit)).toString(16)}`
  }
  try {
    return await contractWithSigner.deposit(loadAmount, tokenId, address, walletRollup.publicKey, overrides)
  } catch (error) {
    throw new Error(`Message error: ${error.message}`)
  }
}

export const depositOnTop = async (addressSC, loadAmount, tokenId, babyjubTo, abi, gasLimit = 5000000, gasMultiplier = 1) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contractWithSigner = new ethers.Contract(addressSC, abi, signer)

  const feeOnchainTx = await contractWithSigner.feeOnchainTx()
  const overrides = {
    gasLimit,
    gasPrice: await getGasPrice(gasMultiplier, provider),
    value: feeOnchainTx
  }

  try {
    return await contractWithSigner.depositOnTop(babyjubTo, loadAmount, tokenId, overrides)
  } catch (error) {
    throw new Error(`Message error: ${error.message}`)
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

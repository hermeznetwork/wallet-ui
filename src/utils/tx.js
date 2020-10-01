import { Scalar } from 'ffjavascript'
import ethers from 'ethers'

import { postPoolTransaction } from '../apis/rollup'
import { fix2Float } from './float16'
import { CliExternalOperator } from './cli-external-operator'
import * as txUtils from './tx-utils'

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
 * send off-chain transaction
 *
 * @param {Object} transaction - ethAddress and babyPubKey together
 * @param {Number} tokenId - token type identifier, the sender and the receive must use the same token
 * @param {String} fee - % of th amount that the user is willing to pay in fees
 * @param {String} nonce - hardcoded from user
 * @param {Object} nonceObject - stored object wich keep tracking of the last transaction nonce sent by the client
 * @param {String} ethAddress - Ethereum address enconded as hexadecimal string to be used in deposit off-chains
 * @returns {Object} - return a object with the response status, current batch, current nonce and nonceObject
*/
export async function send (transaction) {
  const tx = txUtils.generateL2Transaction(transaction)

  const resTx = await postPoolTransaction(tx)

  if (resTx.status.toString() === '200') {
    txUtils.storeL2Transaction(resTx)
  }
  const res = {
    status: resTx.status
    // currentBatch,
    // nonce: nonceToSend,
    // nonceObject: nonceObjectToWrite
  }

  return res
}

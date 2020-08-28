import { Scalar } from 'ffjavascript'
import ethers from 'ethers'

import { fix2float } from './utils'
import { CliExternalOperator } from './cli-external-operator'

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
  const pubKeyBabyjub = [
    walletRollup.publicKey[0].toString(),
    walletRollup.publicKey[1].toString()
  ]

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contractWithSigner = new ethers.Contract(addressSC, abi, signer)

  const address = walletRollup.ethereumAddress
  const feeOnchainTx = await contractWithSigner.feeOnchainTx()
  const feeDeposit = await contractWithSigner.depositFee()

  const overrides = {
    gasLimit,
    gasPrice: await getGasPrice(gasMultiplier, provider),
    value: `0x${(Scalar.add(feeOnchainTx, feeDeposit)).toString(16)}`
  }
  try {
    return await contractWithSigner.deposit(loadAmount, tokenId, address, pubKeyBabyjub, overrides)
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
  const apiOperator = new CliExternalOperator(urlOperator)
  const pubKeyBabyjub = [walletRollup.publicKey[0].toString(16), walletRollup.publicKey[1].toString(16)]
  const pubKeyBabyjubEthCall = [walletRollup.publicKey[0].toString(), walletRollup.publicKey[1].toString()]

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contractWithSigner = new ethers.Contract(addressSC, abi, signer)

  const overrides = {
    gasLimit,
    gasPrice: await getGasPrice(gasMultiplier, provider)
  }

  try {
    const res = await apiOperator.getExitInfo(tokenId, pubKeyBabyjub[0], pubKeyBabyjub[1], numExitRoot)
    const infoExitTree = res.data
    if (infoExitTree.found) {
      return await contractWithSigner.withdraw(infoExitTree.state.amount, numExitRoot,
        infoExitTree.siblings, pubKeyBabyjubEthCall, tokenId, overrides)
    }
    throw new Error(`No exit tree leaf was found in batch: ${numExitRoot} with babyjub: ${pubKeyBabyjub}`)
  } catch (error) {
    throw new Error(`Message error: ${error.message}`)
  }
}

export const forceWithdraw = async (addressSC, tokenId, amount, walletRollup, abi,
  gasLimit = 5000000, gasMultiplier = 1) => {
  const pubKeyBabyjub = [
    walletRollup.publicKey[0],
    walletRollup.publicKey[1]
  ]

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contractWithSigner = new ethers.Contract(addressSC, abi, signer)

  const feeOnchainTx = await contractWithSigner.feeOnchainTx()
  const overrides = {
    gasLimit,
    gasPrice: await getGasPrice(gasMultiplier, provider),
    value: feeOnchainTx
  }

  const amountF = fix2float(amount)
  try {
    return await contractWithSigner.forceWithdraw(pubKeyBabyjub, tokenId, amountF, overrides)
  } catch (error) {
    throw new Error(`Message error: ${error.message}`)
  }
}

// check the nonce from the operator and Nonce object and decide wich one use
async function _checkNonce (responseLeaf, currentBatch, nonceObject) {
  const nonceId = nonceObject.find((x) => x.tokenId === responseLeaf.tokenId)
  let nonce
  if (nonceId !== undefined && nonceId.batch === currentBatch) { // only if the nonce object stores the nonce of the current batch
    nonce = nonceId.nonce
  } else {
    nonce = responseLeaf.nonce
  }
  const infoTx = { tokenId: responseLeaf.tokenId, currentBatch, nonce }
  return infoTx
}

function _addNonce (nonceObject, currentBatch, nonce, tokenId) {
  const newNonce = nonce + 1
  if (nonceObject !== undefined) {
    if (nonceObject.length > 0) {
      const nonceId = nonceObject.find((x) => x.tokenId === tokenId)
      if (nonceId !== undefined) {
        nonceObject = nonceObject.filter((x) => x.tokenId !== tokenId)
      }
    }
  } else {
    nonceObject = []
  }
  nonceObject.push({ tokenId, batch: currentBatch, nonce: newNonce })
  return nonceObject
}

const exitAx = '0x0000000000000000000000000000000000000000000000000000000000000000'
const exitAy = '0x0000000000000000000000000000000000000000000000000000000000000000'
const exitEthAddr = '0x0000000000000000000000000000000000000000'

/**
 * send off-chain transaction
 * @param {String} urlOperator - url from operator
 * @param {String[2]} babyjubTo - babyjub public key receiver
 * @param {String} amount - amount to transfer
 * @param {Object} walletRollup - ethAddress and babyPubKey together
 * @param {Number} tokenId - token type identifier, the sender and the receive must use the same token
 * @param {String} fee - % of th amount that the user is willing to pay in fees
 * @param {String} nonce - hardcoded from user
 * @param {Object} nonceObject - stored object wich keep tracking of the last transaction nonce sent by the client
 * @param {String} ethAddress - Ethereum address enconded as hexadecimal string to be used in deposit off-chains
 * @returns {Object} - return a object with the response status, current batch, current nonce and nonceObject
*/
export async function send (urlOperator, babyjubTo, amount, walletRollup, tokenId, fee, nonce, nonceObject, ethAddress) {
  const [fromAx, fromAy] = [walletRollup.publicKey[0].toString(16), walletRollup.publicKey[1].toString(16)]

  const apiOperator = new CliExternalOperator(urlOperator)
  const generalInfo = await apiOperator.getState()
  const currentBatch = generalInfo.data.rollupSynch.lastBatchSynched

  let toEthAddr
  if (babyjubTo[0] === exitAx && babyjubTo[1] === exitAy) {
    toEthAddr = exitEthAddr
  } else {
    try {
      const res = await apiOperator.getStateAccount(tokenId, babyjubTo[0], babyjubTo[1])
      const senderLeaf = res.data
      toEthAddr = senderLeaf.ethAddress
    } catch (err) {
      toEthAddr = ethAddress
    }
  }

  let nonceToSend
  if (nonce !== undefined) {
    nonceToSend = nonce
  } else {
    const resOp = await apiOperator.getStateAccount(tokenId, fromAx, fromAy)
    const senderLeaf = resOp.data
    if (nonceObject !== undefined) {
      const res = await _checkNonce(senderLeaf, currentBatch, nonceObject)
      nonceToSend = res.nonce
    } else {
      nonceToSend = senderLeaf.nonce
    }
  }

  const tx = {
    toAx: babyjubTo[0],
    toAy: babyjubTo[1],
    toEthAddr,
    coin: tokenId,
    amount,
    nonce: nonceToSend,
    fee,
    rqOffset: 0,
    onChain: 0,
    newAccount: 0
  }

  walletRollup.signRollupTx(tx) // sign included in transaction
  const resTx = await apiOperator.sendTx(tx)

  let nonceObjectToWrite
  if (resTx.status.toString() === '200') {
    nonceObjectToWrite = _addNonce(nonceObject, currentBatch, nonceToSend, tokenId)
  }
  const res = {
    status: resTx.status,
    currentBatch,
    nonce: nonceToSend,
    nonceObject: nonceObjectToWrite
  }

  return res
}

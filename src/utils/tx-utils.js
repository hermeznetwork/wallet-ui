import BigInt from 'big-integer'
import { Scalar } from 'ffjavascript'
import { poseidon } from 'circomlib'
import ethers from 'ethers'

import { feeFactors } from './fee-factors'
import { bufToHex } from './utils'
import { fix2Float } from './float16'

async function encodeTransaction (tx) {
  const encodedTransaction = Object.assign({}, tx)

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  encodedTransaction.chainId = await provider.getNetwork().chainId

  const fromColonIndex = tx.fromAccountIndex.lastIndexOf(':') + 1
  encodedTransaction.fromAccountIndex = tx.fromAccountIndex.substring(fromColonIndex)

  const toColonIndex = tx.toAccountIndex.lastIndexOf(':') + 1
  encodedTransaction.toAccountIndex = tx.toAccountIndex.substring(toColonIndex)

  return encodedTransaction
}

/**
 * TxID (12 bytes) for L2Tx is:
 * bytes:  |  1   |    6    |   5   |
 * values: | type | FromIdx | Nonce |
 * where type for L2Tx is '2'
 *
 * @param {Number} fromIdx
 * @param {Number} nonce
 *
 * @returns {String}
 */
function getTxId (fromIdx, nonce) {
  const fromIdxBytes = new ArrayBuffer(8)
  const fromIdxView = new DataView(fromIdxBytes)
  fromIdxView.setBigUint64(0, BigInt(fromIdx).value, false)

  const nonceBytes = new ArrayBuffer(8)
  const nonceView = new DataView(nonceBytes)
  nonceView.setBigUint64(0, BigInt(nonce).value, false)

  const fromIdxHex = bufToHex(fromIdxView.buffer.slice(2, 8))
  const nonceHex = bufToHex(nonceView.buffer.slice(3, 8))
  return '0x02' + fromIdxHex + nonceHex
}

/**
 *
 * @param {*} fee
 * @param {*} amount
 */
function getFee (fee, amount, decimals) {
  const amountFloat = Number(amount) / Math.pow(10, decimals)
  const percentage = fee / amountFloat
  let low = 0
  let mid
  let high = feeFactors.length - 1
  while (high - low > 1) {
    mid = Math.floor((low + high) / 2)
    if (feeFactors[mid] < percentage) {
      low = mid
    } else {
      high = mid
    }
  }

  return high
}

/**
 * Encode tx compressed data
 * @param {Object} tx - Transaction object
 * @returns {Scalar} Encoded tx compressed data
 */
function buildTxCompressedData (tx) {
  const signatureConstant = Scalar.fromString('3322668559')
  let res = Scalar.e(0)

  res = Scalar.add(res, signatureConstant) // SignConst --> 32 bits
  res = Scalar.add(res, Scalar.shl(tx.chainId || 0, 32)) // chainId --> 16 bits
  res = Scalar.add(res, Scalar.shl(tx.fromAccountIndex || 0, 48)) // fromIdx --> 48 bits
  res = Scalar.add(res, Scalar.shl(tx.toAccountIndex || 0, 96)) // toIdx --> 48 bits
  res = Scalar.add(res, Scalar.shl(fix2Float(tx.amount || 0), 144)) // amounf16 --> 16 bits
  res = Scalar.add(res, Scalar.shl(tx.tokenId || 0, 160)) // tokenID --> 32 bits
  res = Scalar.add(res, Scalar.shl(tx.nonce || 0, 192)) // nonce --> 40 bits
  res = Scalar.add(res, Scalar.shl(tx.fee || 0, 232)) // userFee --> 8 bits
  res = Scalar.add(res, Scalar.shl(tx.toBjjSign ? 1 : 0, 240)) // toBjjSign --> 1 bit

  return res
}

/**
 * Builds the message to hash
 *
 * @param {Object} tx - Transaction object
 *
 * @returns {Scalar} message to sign
 */
function buildTransactionHashMessage (tx) {
  const txCompressedData = buildTxCompressedData(tx)

  const h = poseidon([
    txCompressedData,
    Scalar.fromString(tx.toEthAddr || '0', 16),
    Scalar.fromString(tx.toBjjAy || '0', 16),
    Scalar.e(tx.rqTxCompressedDataV2 || 0),
    Scalar.fromString(tx.rqToEthAddr || '0', 16),
    Scalar.fromString(tx.rqToBjjAy || '0', 16)
  ])

  return h
}

function getTransactionType (transaction) {
  if (transaction.to.includes('hez:')) {
    return 'Transfer'
  }
}

function getNonce (currentNonce) {
  return currentNonce + 1
}

async function generateL2Transaction (tx, token) {
  const transaction = {
    type: getTransactionType(tx),
    tokenId: token.id,
    fromAccountIndex: tx.from,
    toAccountIndex: tx.to,
    toHezEthereumAddress: null,
    toBjj: null,
    amount: tx.amount.toString(),
    fee: getFee(tx.fee, tx.amount, token.decimals),
    nonce: getNonce(tx.nonce),
    requestFromAccountIndex: null,
    requestToAccountIndex: null,
    requestToHezEthereumAddress: null,
    requestToBJJ: null,
    requestTokenId: null,
    requestAmount: null,
    requestFee: null,
    requestNonce: null
  }

  const encodedTransaction = await encodeTransaction(transaction)
  transaction.id = getTxId(encodedTransaction.fromAccountIndex, encodedTransaction.nonce)

  return { transaction, encodedTransaction }
}

function storeL2Transaction (res) {
  return res
}

export {
  getTxId,
  getFee,
  buildTransactionHashMessage,
  getTransactionType,
  generateL2Transaction,
  storeL2Transaction
}

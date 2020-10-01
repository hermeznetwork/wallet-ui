import BigInt from 'big-integer'

import { feeFactors } from './fee-factors'
import { bufToHex } from './utils'

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
  fromIdxView.setBigUint64(0, BigInt(fromIdx), false)

  const nonceBytes = new ArrayBuffer(8)
  const nonceView = new DataView(nonceBytes)
  nonceView.setBigUint64(0, BigInt(nonce), false)

  const fromIdxHex = bufToHex(fromIdxView.buffer.slice(2, 8))
  const nonceHex = bufToHex(nonceView.buffer.slice(3, 8))
  return '0x02' + fromIdxHex + nonceHex
}

function getFee (fee, amount) {
  const percentage = fee / amount
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

function getSignature (transaction) {

}

function getTransactionType (transaction) {

}

function generateL2Transaction (transaction) {
  const tx = {
    id: getTxId(transaction.from, transaction.nonce),
    type: getTransactionType(transaction),
    tokenId: transaction.tokenId,
    fromAccountIndex: transaction.from,
    toAccountIndex: transaction.to,
    toHezEthereumAddress: null,
    toBjj: null,
    amount: transaction.amount.toString(),
    fee: getFee(transaction.fee, transaction.amount),
    nonce: transaction.nonce,
    requestFromAccountIndex: null,
    requestToAccountIndex: null,
    requestToHezEthereumAddress: null,
    requestToBJJ: null,
    requestTokenId: null,
    requestAmount: null,
    requestFee: null,
    requestNonce: null
  }

  tx.signature = getSignature(tx)
}

function storeL2Transaction (res) {
  return res
}

export {
  getTxId,
  getFee,
  getSignature,
  getTransactionType,
  generateL2Transaction,
  storeL2Transaction
}

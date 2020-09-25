import { Scalar } from 'ffjavascript'
import { poseidon, eddsa } from 'circomlib'

import * as eddsaBabyJub from './eddsa-babyjub'
import { hashBuffer, buildTxData } from './utils'

const hash = poseidon([6, 8, 57])

/**
 * Manage Babyjubjub keys
 * Perform standard wallet actions
 */
export class BabyJubWallet {
  /**
     * Initialize Babyjubjub wallet from private key
     * @param {Buffer} privateKey - 32 bytes buffer
     * @param {String} hermezEthereumAddress - Hexadecimal string containing the public Ethereum key from Metamask
     */
  constructor (privateKey, hermezEthereumAddress) {
    const priv = new eddsaBabyJub.PrivateKey(privateKey)
    const pub = priv.public()

    this.privateKey = privateKey
    this.publicKey = [pub.p[0].toString(), pub.p[1].toString()]
    this.publicKeyHex = [pub.p[0].toString(16), pub.p[1].toString(16)]
    this.publicKeyCompressed = pub.compress()
    this.hermezEthereumAddress = hermezEthereumAddress
  }

  /**
     * Signs message with private key
     * @param {String} messageStr - message to sign
     * @returns {String} - Babyjubjub signature packed and encoded as an hex string
     */
  signMessage (messageStr) {
    const messBuff = Buffer.from(messageStr)
    const messHash = hashBuffer(messBuff)
    const privKey = new eddsaBabyJub.PrivateKey(this.privateKey)
    const sig = privKey.signPoseidon(messHash)
    return sig.toString('hex')
  }

  /**
   * To sign transaction with babyjubjub keys
   * @param {Object} tx -transaction
   */
  signRollupTx (tx) {
    const data = buildTxData(tx)

    const h = hash([
      data,
      Scalar.e(tx.rqTxData || 0),
      Scalar.fromString(tx.toAx, 16),
      Scalar.fromString(tx.toAy, 16),
      Scalar.fromString(tx.toEthAddr, 16)
    ])

    const signature = eddsa.signPoseidon(this.privateKey, h)
    tx.r8x = signature.R8[0]
    tx.r8y = signature.R8[1]
    tx.s = signature.S
    tx.fromAx = this.publicKeyHex[0]
    tx.fromAy = this.publicKeyHex[1]
    tx.fromEthAddr = this.hermezEthereumAddress
  }
}

/**
 * Verifies signature for a given message using babyjubjub
 * @param {String} publicKeyHex - Babyjubjub public key encoded as hex string
 * @param {String} messStr - clear message data
 * @param {String} signatureHex - Ecdsa signature compresed and encoded as hex string
 * @returns {boolean} True if validation is succesfull; otherwise false
 */
export function verifyBabyJub (publicKeyHex, messStr, signatureHex) {
  const pkBuff = Buffer.from(publicKeyHex, 'hex')
  const pk = eddsaBabyJub.PublicKey.newFromCompressed(pkBuff)
  const msgBuff = Buffer.from(messStr)
  const hash = hashBuffer(msgBuff)
  const sigBuff = Buffer.from(signatureHex, 'hex')
  const sig = eddsaBabyJub.Signature.newFromCompressed(sigBuff)
  return pk.verifyPoseidon(hash, sig)
}

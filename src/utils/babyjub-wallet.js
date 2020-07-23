const eddsaBabyJub = require('./eddsa-babyjub')
const utils = require('./utils')

/**
 * Manage Babyjubjub keys
 * Perform standard wallet actions
 */
class BabyJubWallet {
  /**
     * Initialize Babyjubjub wallet from private key
     * @param {Buffer} privateKey - 32 bytes buffer
     */
  constructor (privateKey) {
    const priv = new eddsaBabyJub.PrivateKey(privateKey)
    const pub = priv.public()

    this.privateKey = privateKey
    this.publicKey = [pub.p[0], pub.p[1]]
    this.publicKeyCompressed = pub.compress()
  }

  /**
     * Signs message with private key
     * @param {String} messageStr - message to sign
     * @returns {String} - Babyjubjub signature packed and encoded as an hex string
     */
  signMessage (messageStr) {
    const messBuff = Buffer.from(messageStr)
    const messHash = utils.hashBuffer(messBuff)
    const privKey = new eddsaBabyJub.PrivateKey(this.privateKey)
    const sig = privKey.signPoseidon(messHash)
    return sig.toString('hex')
  }
}

/**
 * Verifies signature for a given message using babyjubjub
 * @param {String} publicKeyHex - Babyjubjub public key encoded as hex string
 * @param {String} messStr - clear message data
 * @param {String} signatureHex - Ecdsa signature compresed and encoded as hex string
 * @returns {boolean} True if validation is succesfull; otherwise false
 */
function verifyBabyJub (publicKeyHex, messStr, signatureHex) {
  const pkBuff = Buffer.from(publicKeyHex, 'hex')
  const pk = eddsaBabyJub.PublicKey.newFromCompressed(pkBuff)
  const msgBuff = Buffer.from(messStr)
  const hash = utils.hashBuffer(msgBuff)
  const sigBuff = Buffer.from(signatureHex, 'hex')
  const sig = eddsaBabyJub.Signature.newFromCompressed(sigBuff)
  return pk.verifyPoseidon(hash, sig)
}

module.exports = {
  BabyJubWallet,
  verifyBabyJub
}

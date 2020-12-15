import TransportU2F from '@ledgerhq/hw-transport-u2f'
import Eth from '@ledgerhq/hw-app-eth'
import TrezorConnect from 'trezor-connect'

import { strToHex } from './strings'

/**
 * Builds an Ethereum BIP-44 path from an account type and index
 * @param {number} accountType - Account type
 * @param {number} accountIndex - Account index
 * @returns {string} - BIP-44 path of the account
 */
function buildEthereumBIP44Path (accountType, accountIndex) {
  return `m/44'/60'/${accountType}'/0/${accountIndex}`
}

/**
 * Signs a message using a Ledger hardware wallet
 * @param {string} path - BIP-44 path of the account to use for signing
 * @param {string} message - Message to sign
 * @returns {Object} - Contains the signature of the message and the Ethereum address
 * used to sign the message
 */
async function signMessageWithLedger (path, message) {
  const transport = await TransportU2F.create()
  const ethereum = new Eth(transport)
  const { address } = await ethereum.getAddress(path)
  const result = await ethereum.signPersonalMessage(path, strToHex(message))
  const hexV = (result.v - 27).toString(16)
  const fixedHexV = hexV.length < 2 ? `0${hexV}` : hexV
  const signature = `0x${result.r}${result.s}${fixedHexV}`

  return { address, signature }
}

/**
 * Signs a message using a Trezor hardware wallet
 * @param {string} path - BIP-44 path of the account to use for signing
 * @param {string} message - Message to sign
 * @returns {Object} - Contains the signature of the message and the Ethereum address
 * used to sign the message
 */
async function signMessageWithTrezor (path, message) {
  const result = await TrezorConnect.ethereumSignMessage({
    path,
    message
  })

  if (result.success) {
    return { address: result.payload.address, signature: result.payload.signature }
  } else {
    throw new Error(result.payload.error)
  }
}

export {
  buildEthereumBIP44Path,
  signMessageWithLedger,
  signMessageWithTrezor
}

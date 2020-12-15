import { keccak256 } from 'js-sha3'
import hermezjs from 'hermezjs'
import { getHermezAddress } from 'hermezjs/src/addresses'
import { push } from 'connected-react-router'

import * as globalActions from '../global/global.actions'
import * as loginActions from './login.actions'
import { AUTH_MESSAGE } from '../../constants'
import { buildEthereumBIP44Path, signMessageWithLedger, signMessageWithTrezor } from '../../utils/hw-wallets'
import { signMessage } from '../../utils/metamask'
import { STEP_NAME } from './login.reducer'

/**
 * Signs the auth message using the corresponding wallet provider
 * @param {string} walletName - Name of the wallet to use as sign in method
 * @param {Object} accountData - Account type and index for a hardware wallet
 */
async function signAuthMessage (walletName, accountData) {
  switch (walletName) {
    case 'metaMask': {
      return signMessage(AUTH_MESSAGE)
    }
    case 'ledger': {
      const { accountType, accountIndex } = accountData
      const path = buildEthereumBIP44Path(accountType, accountIndex)

      return signMessageWithLedger(path, AUTH_MESSAGE)
    }
    case 'trezor': {
      const { accountType, accountIndex } = accountData
      const path = buildEthereumBIP44Path(accountType, accountIndex)

      return signMessageWithTrezor(path, AUTH_MESSAGE)
    }
    default: {
      throw new Error('Wallet not supported')
    }
  }
}

/**
 * Asks the user to login using a compatible wallet and stores its data in the Redux
 * store
 * @returns {void}
 */
function fetchWallet (walletName, accountData) {
  return async (dispatch, getState) => {
    try {
      dispatch(loginActions.loadWallet())

      const { address, signature } = await signAuthMessage(walletName, accountData)
      const hermezAddress = getHermezAddress(address)
      const hashedSignature = keccak256(signature)
      const signatureBuffer = hermezjs.Utils.hexToBuffer(hashedSignature)
      const wallet = new hermezjs.HermezWallet.HermezWallet(signatureBuffer, hermezAddress)
      const { global: { redirectRoute }, login: { currentStep } } = getState()

      if (currentStep === STEP_NAME.WALLET_LOADER) {
        dispatch(globalActions.loadWallet(wallet))
        dispatch(push(redirectRoute))
      }
    } catch (error) {
      const { login: { currentStep } } = getState()

      if (currentStep === STEP_NAME.WALLET_LOADER) {
        dispatch(loginActions.loadWalletFailure(error.message))
        dispatch(globalActions.openSnackbar(error.message))
        dispatch(loginActions.goToPreviousStep())
      }
    }
  }
}

export {
  fetchWallet
}

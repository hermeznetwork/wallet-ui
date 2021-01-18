import { keccak256 } from 'js-sha3'
import hermezjs from '@hermeznetwork/hermezjs'
import { push } from 'connected-react-router'

import * as globalActions from '../global/global.actions'
import * as loginActions from './login.actions'
import { AUTH_MESSAGE } from '../../constants'
import { buildEthereumBIP44Path } from '../../utils/hw-wallets'
import { STEP_NAME } from './login.reducer'

async function getSigner (walletName, accountData) {
  const provider = hermezjs.Providers.getProvider()

  switch (walletName) {
    case 'metaMask': {
      try {
        await provider.send('eth_requestAccounts')
      } catch (err) {}

      return hermezjs.Signers.getSigner(provider)
    }
    case 'ledger': {
      const { accountType, accountIndex } = accountData
      const path = buildEthereumBIP44Path(accountType, accountIndex)

      return hermezjs.Signers.getSigner(
        provider,
        {
          type: hermezjs.Signers.SignerType.LEDGER,
          path
        }
      )
    }
    case 'trezor': {
      const { accountType, accountIndex } = accountData
      const path = buildEthereumBIP44Path(accountType, accountIndex)

      return hermezjs.Signers.getSigner(
        provider,
        {
          type: hermezjs.Signers.SignerType.TREZOR,
          path
        }
      )
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

      const signer = await getSigner(walletName, accountData)
      const address = await signer.getAddress()
      const signature = await signer.signMessage(AUTH_MESSAGE)
      const hermezAddress = hermezjs.Addresses.getHermezAddress(address)
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

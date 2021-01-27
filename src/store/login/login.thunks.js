import { keccak256 } from 'js-sha3'
import hermez from '@hermeznetwork/hermezjs'
import { push } from 'connected-react-router'

import * as globalActions from '../global/global.actions'
import * as loginActions from './login.actions'
import { AUTH_MESSAGE, ACCOUNT_AUTH_KEY, ACCOUNT_AUTH_SIGNATURE_KEY } from '../../constants'
import { buildEthereumBIP44Path } from '../../utils/hw-wallets'
import { STEP_NAME } from './login.reducer'
import { WalletName } from '../../views/login/login.view'

async function getSignerData (walletName, accountData) {
  switch (walletName) {
    case WalletName.METAMASK: {
      return {
        type: hermez.Signers.SignerType.JSON_RPC
      }
    }
    case WalletName.LEDGER: {
      const { accountType, accountIndex } = accountData
      const path = buildEthereumBIP44Path(accountType, accountIndex)

      return {
        type: hermez.Signers.SignerType.LEDGER,
        path
      }
    }
    case WalletName.TREZOR: {
      const { accountType, accountIndex } = accountData
      const path = buildEthereumBIP44Path(accountType, accountIndex)

      return {
        type: hermez.Signers.SignerType.TREZOR,
        path
      }
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
      const provider = hermez.Providers.getProvider()

      dispatch(loginActions.loadWallet())

      if (walletName === WalletName.METAMASK) {
        try {
          await provider.send('eth_requestAccounts')
        } catch (err) {
          console.log(err)
        }
      }

      const signerData = await getSignerData(walletName, accountData)
      const signer = await hermez.Signers.getSigner(provider, signerData)
      const address = await signer.getAddress()
      const signature = await signer.signMessage(AUTH_MESSAGE)
      const hermezAddress = hermez.Addresses.getHermezAddress(address)
      const hashedSignature = keccak256(signature)
      const signatureBuffer = hermez.Utils.hexToBuffer(hashedSignature)
      const wallet = new hermez.HermezWallet.HermezWallet(signatureBuffer, hermezAddress)
      const { login: { currentStep } } = getState()

      if (currentStep === STEP_NAME.WALLET_LOADER) {
        dispatch(globalActions.loadWallet(wallet))
        dispatch(globalActions.setSigner(signer))
        dispatch(loginActions.goToCreateAccountAuthStep(wallet))
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

/**
 * Sends a create account authorization request if it hasn't been done
 * for the current coordinator
 */
function postCreateAccountAuthorization (wallet) {
  return (dispatch, getState) => {
    const { login: { accountAuthSignature }, global: { redirectRoute } } = getState()

    const accountAuth = JSON.parse(localStorage.getItem(ACCOUNT_AUTH_KEY))
    const currentAccountAuth = accountAuth[wallet.hermezEthereumAddress]

    const apiUrl = hermez.CoordinatorAPI.getBaseApiUrl()

    if (!currentAccountAuth || !currentAccountAuth[apiUrl]) {
      const currentSignature = accountAuthSignature[wallet.hermezEthereumAddress]
      const getSignature = currentSignature
        ? () => Promise.resolve(currentSignature)
        : wallet.signCreateAccountAuthorization.bind(wallet)

      getSignature()
        .then((signature) => {
          setAccountAuthSignature(wallet.hermezEthereumAddress, signature)

          return hermez.CoordinatorAPI.postCreateAccountAuthorization(
            wallet.hermezEthereumAddress,
            wallet.publicKeyBase64,
            signature
          )
        })
        .then(() => {
          const newAccountAuth = {
            ...accountAuth,
            [wallet.hermezEthereumAddress]: {
              ...currentAccountAuth,
              [apiUrl]: true
            }
          }
          localStorage.setItem(ACCOUNT_AUTH_KEY, JSON.stringify(newAccountAuth))
          dispatch(loginActions.addAccountAuth(wallet.hermezEthereumAddress, apiUrl))
          dispatch(push(redirectRoute))
        })
        .catch(console.log)
    } else {
      dispatch(push(redirectRoute))
    }
  }
}

/**
 * Saves already created Create Account Authorization signatures in LocalStorage
 * @param {String} hermezEthereumAddress
 * @param {String} signature
 */
function setAccountAuthSignature (hermezEthereumAddress, signature) {
  return (dispatch) => {
    const accountAuthSignature = JSON.parse(localStorage.getItem(ACCOUNT_AUTH_SIGNATURE_KEY))
    const newAccountAuthSignature = {
      ...accountAuthSignature,
      [hermezEthereumAddress]: signature
    }
    localStorage.setItem(ACCOUNT_AUTH_SIGNATURE_KEY, JSON.stringify(newAccountAuthSignature))
    dispatch(loginActions.setAccountAuthSignature(hermezEthereumAddress, signature))
  }
}

export {
  fetchWallet,
  postCreateAccountAuthorization,
  setAccountAuthSignature
}

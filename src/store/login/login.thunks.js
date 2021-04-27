import { keccak256 } from 'js-sha3'
import hermez from '@hermeznetwork/hermezjs'
import { push } from 'connected-react-router'

import * as globalActions from '../global/global.actions'
import * as loginActions from './login.actions'
import { ACCOUNT_AUTH_SIGNATURES_KEY, TREZOR_MANIFEST_MAIL } from '../../constants'
import { buildEthereumBIP44Path } from '../../utils/hw-wallets'
import { STEP_NAME } from './login.reducer'
import { WalletName } from '../../views/login/login.view'
import * as storage from '../../utils/storage'

async function getSignerData (provider, walletName, accountData) {
  switch (walletName) {
    case WalletName.METAMASK: {
      return {
        type: hermez.Signers.SignerType.JSON_RPC
      }
    }
    case WalletName.LEDGER: {
      const chainId = (await provider.getNetwork()).chainId
      const { accountType, accountIndex } = accountData
      const path = buildEthereumBIP44Path(chainId, accountType, accountIndex)

      return {
        type: hermez.Signers.SignerType.LEDGER,
        path
      }
    }
    case WalletName.TREZOR: {
      const chainId = (await provider.getNetwork()).chainId
      const { accountType, accountIndex } = accountData
      const path = buildEthereumBIP44Path(chainId, accountType, accountIndex)

      return {
        type: hermez.Signers.SignerType.TREZOR,
        path,
        manifest: {
          email: TREZOR_MANIFEST_MAIL,
          appUrl: window.location.origin
        }
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
      if (walletName !== WalletName.METAMASK) {
        hermez.Providers.setProvider(process.env.REACT_APP_HARDWARE_WALLETS_PROVIDER)
      }

      const provider = hermez.Providers.getProvider()

      dispatch(loginActions.loadWallet())

      if (walletName === WalletName.METAMASK) {
        try {
          await provider.send('eth_requestAccounts')
        } catch (err) {
          console.log(err)
        }
      }

      const signerData = await getSignerData(provider, walletName, accountData)
      const signer = await hermez.Signers.getSigner(provider, signerData)
      const address = await signer.getAddress()
      const hermezAddress = hermez.Addresses.getHermezAddress(address)
      const signature = await signer.signMessage(hermez.Constants.METAMASK_MESSAGE)
      const hashedSignature = keccak256(signature)
      const signatureBuffer = hermez.Utils.hexToBuffer(hashedSignature)
      const wallet = new hermez.HermezWallet.HermezWallet(signatureBuffer, hermezAddress)
      const { login: { currentStep } } = getState()

      if (currentStep === STEP_NAME.WALLET_LOADER) {
        dispatch(globalActions.loadWallet(wallet))
        dispatch(globalActions.setSigner({ ...signerData, address }))
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
    const {
      login: { accountAuthSignatures },
      global: { redirectRoute, ethereumNetworkTask, nextForgers }
    } = getState()

    const hermezAddressAuthSignatures = storage.getItemsByHermezAddress(
      accountAuthSignatures,
      ethereumNetworkTask.data.chainId,
      wallet.hermezEthereumAddress
    )
    const getSignature = hermezAddressAuthSignatures.length === 0
      ? wallet.signCreateAccountAuthorization.bind(wallet)
      : () => Promise.resolve(hermezAddressAuthSignatures[0])

    getSignature()
      .then((signature) => {
        dispatch(setAccountAuthSignature(wallet.hermezEthereumAddress, signature))

        return hermez.CoordinatorAPI.postCreateAccountAuthorization(
          wallet.hermezEthereumAddress,
          wallet.publicKeyBase64,
          signature,
          nextForgers
        )
      })
      .then((res) => {
        dispatch(loginActions.addAccountAuthSuccess())
        dispatch(push(redirectRoute))
      })
      .catch((error) => {
        const errorMessage = error.code === -32603
          ? 'Sorry, hardware wallets are not supported in Hermez yet'
          : error.message
        console.log(error)
        dispatch(loginActions.addAccountAuthFailure(error))
        dispatch(globalActions.openSnackbar(errorMessage))
        dispatch(loginActions.goToWalletSelectorStep())
      })
  }
}

/**
 * Saves already created Create Account Authorization signatures in LocalStorage
 * @param {String} hermezEthereumAddress
 * @param {String} signature
 */
function setAccountAuthSignature (hermezEthereumAddress, signature) {
  return (dispatch, getState) => {
    const { global: { ethereumNetworkTask } } = getState()
    const { data: { chainId } } = ethereumNetworkTask

    storage.addItem(ACCOUNT_AUTH_SIGNATURES_KEY, chainId, hermezEthereumAddress, signature)
    dispatch(loginActions.setAccountAuthSignature(chainId, hermezEthereumAddress, signature))
  }
}

export {
  fetchWallet,
  postCreateAccountAuthorization,
  setAccountAuthSignature
}

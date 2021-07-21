import { keccak256 } from 'js-sha3'
import hermez from '@hermeznetwork/hermezjs'
import { push } from 'connected-react-router'
import { utils } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'

import * as globalActions from '../global/global.actions'
import * as globalThunks from '../global/global.thunks'
import * as loginActions from './login.actions'
import { ACCOUNT_AUTH_SIGNATURES_KEY, TREZOR_MANIFEST_MAIL } from '../../constants'
import { buildEthereumBIP44Path } from '../../utils/hw-wallets'
import { HttpStatusCode } from '../../utils/http'
import { STEP_NAME } from './login.reducer'
import { WalletName } from '../../views/login/login.view'
import { getNextForgerUrls } from '../../utils/coordinator'
import { isEnvironmentSupported } from '@hermeznetwork/hermezjs/dist/node/environment'

async function getSignerData (provider, walletName, accountData) {
  switch (walletName) {
    case WalletName.METAMASK:
    case WalletName.WALLET_CONNECT: {
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
 * Helper function that signs the authentication message depending on Wallet type
 * @param {String} walletName
 * @param {Object} providerOrSigner
 * @param {String} message
 * @param {String} address
 * @returns {Promise} A promise that resolves to the signature
 */
function signMessageHelper (walletName, providerOrSigner, message, address) {
  if (walletName === WalletName.WALLET_CONNECT) {
    const rawMessageLength = new Blob([message]).size
    const messageInBytes = utils.toUtf8Bytes('\x19Ethereum Signed Message:\n' + rawMessageLength + message)
    const msgParams = [
      address.toLowerCase(),
      utils.keccak256(messageInBytes)
    ]
    return providerOrSigner.provider.connector.signMessage(msgParams)
  } else {
    return providerOrSigner.signMessage(message)
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
      if (walletName === WalletName.LEDGER || walletName === WalletName.TREZOR) {
        hermez.Providers.setProvider(process.env.REACT_APP_HARDWARE_WALLETS_PROVIDER)
      }

      if (walletName === WalletName.WALLET_CONNECT) {
        const walletConnectProvider = new WalletConnectProvider({
          infuraId: process.env.REACT_APP_INFURA_API_KEY
        })
        hermez.Providers.setProvider(walletConnectProvider, hermez.Providers.PROVIDER_TYPES.WEB3)
      }

      const provider = hermez.Providers.getProvider()

      dispatch(loginActions.loadWallet())

      if (walletName === WalletName.METAMASK) {
        try {
          await provider.send('eth_requestAccounts')
        } catch (err) {
          console.error(err)
        }
      }

      const signerData = await getSignerData(provider, walletName, accountData)
      const signer = await hermez.Signers.getSigner(provider, signerData)

      if (walletName === WalletName.WALLET_CONNECT) {
        // Enable shows the QR or uses the stored session
        await provider.provider.enable()
      }

      const { chainId, name: chainName } = await provider.getNetwork()

      if (process.env.REACT_APP_ENV === 'production' && !isEnvironmentSupported(chainId)) {
        dispatch(globalActions.openSnackbar('Network not supported'))
        dispatch(loginActions.goToWalletSelectorStep())

        if (walletName === WalletName.WALLET_CONNECT) {
          // Close the stored session to avoid storing a network not supported by Hermez
          await provider.provider.disconnect()
        }

        return
      }

      dispatch(globalThunks.setHermezEnvironment(chainId, chainName))

      const address = await signer.getAddress()
      const hermezAddress = hermez.Addresses.getHermezAddress(address)
      const providerOrSigner = walletName === WalletName.WALLET_CONNECT ? provider : signer
      const signature = await signMessageHelper(walletName, providerOrSigner, hermez.Constants.METAMASK_MESSAGE, address)
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
      global: { redirectRoute, ethereumNetworkTask, coordinatorStateTask }
    } = getState()
    const nextForgerUrls = getNextForgerUrls(coordinatorStateTask.data)

    const chainIdSignatures = accountAuthSignatures[ethereumNetworkTask.data.chainId] || {}
    const currentSignature = chainIdSignatures[wallet.hermezEthereumAddress]
    const getSignature = currentSignature
      ? () => Promise.resolve(currentSignature)
      : wallet.signCreateAccountAuthorization.bind(wallet)

    getSignature()
      .then((signature) => {
        dispatch(setAccountAuthSignature(wallet.hermezEthereumAddress, signature))

        return hermez.CoordinatorAPI.postCreateAccountAuthorization(
          wallet.hermezEthereumAddress,
          wallet.publicKeyBase64,
          signature,
          nextForgerUrls
        ).catch((error) => {
          // If the coordinators already have the CreateAccountsAuth signature,
          // we ignore the error
          console.log(error)
          if (error.response.status !== HttpStatusCode.DUPLICATED) {
            throw error
          }
        })
      })
      .then(() => {
        dispatch(loginActions.addAccountAuthSuccess())
        dispatch(push(redirectRoute))
        if (process.env.REACT_APP_ENABLE_AIRDROP === 'true') {
          dispatch(globalActions.openRewardsSidenav())
        }
      })
      .catch((error) => {
        const errorMessage = error.code === -32603
          ? 'Sorry, hardware wallets are not supported in Hermez yet'
          : error.message

        console.error(error)
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

    const storage = JSON.parse(localStorage.getItem(ACCOUNT_AUTH_SIGNATURES_KEY))
    const chainIdStorage = storage[chainId] || {}
    const newAccountAuthSignature = {
      ...storage,
      [chainId]: {
        ...chainIdStorage,
        [hermezEthereumAddress]: signature
      }
    }
    localStorage.setItem(ACCOUNT_AUTH_SIGNATURES_KEY, JSON.stringify(newAccountAuthSignature))
    dispatch(loginActions.setAccountAuthSignature(chainId, hermezEthereumAddress, signature))
  }
}

export {
  fetchWallet,
  postCreateAccountAuthorization,
  setAccountAuthSignature
}

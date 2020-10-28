import ethers from 'ethers'
import { keccak256 } from 'js-sha3'
import hermezjs from 'hermezjs'

import * as globalActions from './global.actions'
import { METAMASK_MESSAGE } from '../../constants'
import * as fiatExchangeRatesApi from '../../apis/fiat-exchange-rates'

function fetchMetamaskWallet () {
  return async function (dispatch) {
    dispatch(globalActions.loadMetamaskWallet())
    try {
      const { ethereum } = window
      if (!ethereum || !ethereum.isMetaMask) {
        dispatch(globalActions.loadMetamaskWalletFailure('MetaMask is not available'))
      }
      await ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const ethereumAddress = await signer.getAddress()
      const hermezEthereumAddress = hermezjs.Addresses.getHermezAddress(ethereumAddress)
      const signature = await signer.signMessage(METAMASK_MESSAGE)
      const hashedSignature = keccak256(signature)
      const bufferSignature = hermezjs.Utils.hexToBuffer(hashedSignature)
      const wallet = new hermezjs.BabyJubWallet.BabyJubWallet(bufferSignature, hermezEthereumAddress)
      dispatch(globalActions.loadMetamaskWalletSuccess(wallet))
    } catch (error) {
      dispatch(globalActions.loadMetamaskWalletFailure(error.message))
    }
  }
}

function changeRedirectRoute (redirecRoute) {
  return (dispatch) => {
    dispatch(globalActions.changeRedirectRoute(redirecRoute))
  }
}

function fetchFiatExchangeRates (symbols) {
  return (dispatch) => {
    dispatch(globalActions.loadFiatExchangeRates())

    return fiatExchangeRatesApi.getFiatExchangeRates(symbols)
      .then(res => dispatch(globalActions.loadFiatExchangeRatesSuccess(res.rates)))
      .catch(err => dispatch(globalActions.loadFiatExchangeRatesFailure(err)))
  }
}

export {
  fetchMetamaskWallet,
  changeRedirectRoute,
  fetchFiatExchangeRates
}

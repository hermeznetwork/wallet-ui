import ethers from 'ethers'
import { keccak256 } from 'js-sha3'

import * as accountActions from './account.actions'
import { hexToBuffer } from '../../utils/utils'
import { getHermezAddress } from '../../utils/addresses'
import { BabyJubWallet } from '../../utils/babyjub-wallet'
import { METAMASK_MESSAGE } from '../../constants'

function fetchMetamaskWallet () {
  return async function (dispatch) {
    dispatch(accountActions.loadMetamaskWallet())
    try {
      const { ethereum } = window
      if (!ethereum || !ethereum.isMetaMask) {
        dispatch(accountActions.loadMetamaskWalletFailure('MetaMask is not available'))
      }
      await ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const ethereumAddress = await signer.getAddress()
      const hermezEthereumAddress = getHermezAddress(ethereumAddress)
      const signature = await signer.signMessage(METAMASK_MESSAGE)
      const hashedSignature = keccak256(signature)
      const bufferSignature = hexToBuffer(hashedSignature)
      const wallet = new BabyJubWallet(bufferSignature, hermezEthereumAddress)
      dispatch(accountActions.loadMetamaskWalletSuccess(wallet))
    } catch (error) {
      dispatch(accountActions.loadMetamaskWalletFailure(error.message))
    }
  }
}

export {
  fetchMetamaskWallet
}

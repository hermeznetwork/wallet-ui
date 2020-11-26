import { push } from 'connected-react-router'

import * as myAccountActions from './my-account.actions'
import * as globalAction from '../global/global.actions'
import { MY_ACCOUNT } from '../../constants'

/**
 * Changes the preferred currency of the user
 * @param {*} selectedTokenId - ISO 4217 currency code
 * @returns {void}
 */
function changePreferredCurrency (selectedTokenId) {
  return (dispatch) => {
    dispatch(myAccountActions.changePreferredCurrency(selectedTokenId))
    localStorage.setItem(MY_ACCOUNT.PREFERRED_CURRENCY_KEY, selectedTokenId)
  }
}

/**
 * Removes the MetaMask wallet data from the Redux store and the localStorage
 * @returns {void}
 */
function disconnectMetaMaskWallet () {
  return (dispatch) => {
    dispatch(globalAction.unloadMetaMaskWallet())
    dispatch(push('/login'))
  }
}

export { changePreferredCurrency, disconnectMetaMaskWallet }

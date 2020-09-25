import { push } from 'connected-react-router'

import * as settingsActions from './settings.actions'
import * as accountActions from '../account/account.actions'
import { SETTINGS } from '../../constants'

function changePreferredCurrency (selectedTokenId) {
  return (dispatch) => {
    dispatch(settingsActions.changePreferredCurrency(selectedTokenId))
    localStorage.setItem(SETTINGS.PREFERRED_CURRENCY_KEY, selectedTokenId)
  }
}

function disconnectMetaMaskWallet () {
  return (dispatch) => {
    dispatch(accountActions.unloadMetaMaskWallet())
    dispatch(push('/login'))
  }
}

export { changePreferredCurrency, disconnectMetaMaskWallet }

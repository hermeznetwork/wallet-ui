import * as settingsActions from './settings.actions'
import { SETTINGS } from '../../constants'

function changePreferredCurrency (selectedTokenId) {
  return (dispatch) => {
    dispatch(settingsActions.changePreferredCurrency(selectedTokenId))
    localStorage.setItem(SETTINGS.PREFERRED_CURRENCY_KEY, selectedTokenId)
  }
}

export { changePreferredCurrency }

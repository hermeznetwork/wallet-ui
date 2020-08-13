import * as settingsActions from './settings.actions'

function changePreferredCurrency (selectedTokenId) {
  return (dispatch) => {
    dispatch(settingsActions.changePreferredCurrency(selectedTokenId))
    localStorage.setItem('defaultCurrencyId', selectedTokenId)
  }
}

export { changePreferredCurrency }

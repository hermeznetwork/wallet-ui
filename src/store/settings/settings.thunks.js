import * as settingsActions from './settings.actions'

function fetchDefaultCurrency (selectedTokenId) {
  return (dispatch) => {
    dispatch(settingsActions.loadDefaultCurrency(selectedTokenId))

    // function getdefaultCurrencyId (selectedTokenId) {
    //     if (selectedTokenId !== defaultCurrencyId) {
    //       // if selected is different then default, set selected as new default
    //       localStorage.setItem('defaultCurrencyId', selectedTokenId)
    //       defaultCurrencyId = selectedTokenId
    //     }
    //     return defaultCurrencyId
    // }

    localStorage.setItem('defaultCurrencyId', selectedTokenId)

    // console.log("THUNK defaultCurrencyId " + defaultCurrencyId)
    // console.log("THUNK getdefaultCurrencyId "+ getdefaultCurrencyId(selectedTokenId))
    // console.log("THUNK2 defaultCurrencyId " + defaultCurrencyId)

    // return getdefaultCurrencyId(selectedTokenId)
  }
}

export { fetchDefaultCurrency }

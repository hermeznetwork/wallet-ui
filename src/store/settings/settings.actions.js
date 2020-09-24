export const settingsActionTypes = {
  CHANGE_PREFERRED_CURRENCY: '[SETTINGS] CHANGE DEFAULT CURRENCY'
}

function changePreferredCurrency (preferredCurrency) {
  return {
    type: settingsActionTypes.CHANGE_PREFERRED_CURRENCY,
    preferredCurrency
  }
}

export {
  changePreferredCurrency
}

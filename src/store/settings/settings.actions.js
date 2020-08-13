export const settingsActionTypes = {
  CHANGE_PREFERRED_CURRENCY: '[SETTINGS] LOAD DEFAULT CURRENCY'
}

function changePreferredCurrency (tokenId) {
  return {
    type: settingsActionTypes.CHANGE_PREFERRED_CURRENCY,
    tokenId
  }
}

export {
  changePreferredCurrency
}

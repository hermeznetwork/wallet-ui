export const settingsActionTypes = {
  LOAD_DEFAULT_CURRENCY: '[SETTINGS] LOAD DEFAULT CURRENCY'
}

function loadDefaultCurrency (tokenId) {
  return {
    type: settingsActionTypes.LOAD_DEFAULT_CURRENCY,
    tokenId
  }
}

export {
  loadDefaultCurrency
}

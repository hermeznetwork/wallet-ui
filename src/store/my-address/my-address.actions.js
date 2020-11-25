export const myAddressActionTypes = {
  CHANGE_PREFERRED_CURRENCY: '[MY ADDRESS] CHANGE DEFAULT CURRENCY'
}

function changePreferredCurrency (preferredCurrency) {
  return {
    type: myAddressActionTypes.CHANGE_PREFERRED_CURRENCY,
    preferredCurrency
  }
}

export { changePreferredCurrency }

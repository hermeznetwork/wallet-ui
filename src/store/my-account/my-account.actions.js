export const myAccountActionTypes = {
  CHANGE_PREFERRED_CURRENCY: "[MY ACCOUNT] CHANGE DEFAULT CURRENCY",
};

function changePreferredCurrency(preferredCurrency) {
  return {
    type: myAccountActionTypes.CHANGE_PREFERRED_CURRENCY,
    preferredCurrency,
  };
}

export { changePreferredCurrency };

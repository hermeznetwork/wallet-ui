import * as myAccountActions from "./my-account.actions";
import { MY_ACCOUNT } from "../../constants";

/**
 * Changes the preferred currency of the user
 * @param {*} selectedTokenId - ISO 4217 currency code
 * @returns {void}
 */
function changePreferredCurrency(selectedTokenId) {
  return (dispatch) => {
    dispatch(myAccountActions.changePreferredCurrency(selectedTokenId));
    localStorage.setItem(MY_ACCOUNT.PREFERRED_CURRENCY_KEY, selectedTokenId);
  };
}

export { changePreferredCurrency };

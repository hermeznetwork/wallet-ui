import { AppDispatch, AppThunk } from "src/store";
import * as myAccountActions from "src/store/my-account/my-account.actions";
// adapters
import * as localStorage from "src/adapters/local-storage";

/**
 * Changes the preferred currency of the user
 */
function changePreferredCurrency(selectedTokenId: string): AppThunk {
  return (dispatch: AppDispatch) => {
    dispatch(myAccountActions.changePreferredCurrency(selectedTokenId));
    localStorage.setPreferredCurrency(selectedTokenId);
  };
}

export { changePreferredCurrency };

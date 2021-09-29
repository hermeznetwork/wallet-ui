import { MyAccountActionTypes, MyAccountAction } from "src/store/my-account/my-account.actions";
// persistence
import * as localStorage from "src/persistence/local-storage";

export interface MyAccountState {
  preferredCurrency: string;
}

const initialMyAccountState: MyAccountState = {
  preferredCurrency: localStorage.getPreferredCurrency(),
};

function myAccountReducer(
  state: MyAccountState = initialMyAccountState,
  action: MyAccountAction
): MyAccountState {
  switch (action.type) {
    case MyAccountActionTypes.CHANGE_PREFERRED_CURRENCY: {
      return {
        ...state,
        preferredCurrency: action.preferredCurrency,
      };
    }
    default: {
      return state;
    }
  }
}

export default myAccountReducer;

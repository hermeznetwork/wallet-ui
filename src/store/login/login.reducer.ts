import { AsyncTask } from "src/utils/types";
import { LoginActionTypes, LoginAction, WalletName } from "src/store/login/login.actions";
// domain
import { HermezWallet, AuthSignatures } from "src/domain";
// persistence
import { getAuthSignatures } from "src/persistence/local-storage";

export interface LoginState {
  step: Step;
  addAccountAuthTask: AsyncTask<null, string>;
  accountAuthSignatures: AuthSignatures;
}

export type Step =
  | {
      type: "wallet-selector";
    }
  | {
      type: "wallet-loader";
      walletName: WalletName;
      walletTask: AsyncTask<HermezWallet.HermezWallet, string>;
    }
  | {
      type: "create-account-auth";
      wallet: HermezWallet.HermezWallet;
    };

function getInitialLoginState(): LoginState {
  return {
    step: {
      type: "wallet-selector",
    },
    addAccountAuthTask: {
      status: "pending",
    },
    accountAuthSignatures: getAuthSignatures(),
  };
}

function loginReducer(state: LoginState = getInitialLoginState(), action: LoginAction): LoginState {
  switch (action.type) {
    case LoginActionTypes.GO_TO_WALLET_SELECTOR_STEP: {
      const initialLoginState = getInitialLoginState();

      return {
        ...state,
        ...initialLoginState,
      };
    }
    case LoginActionTypes.GO_TO_WALLET_LOADER_STEP: {
      return {
        ...state,
        step: {
          type: "wallet-loader",
          walletName: action.walletName,
          walletTask: {
            status: "pending",
          },
        },
      };
    }
    case LoginActionTypes.GO_TO_CREATE_ACCOUNT_AUTH_STEP: {
      return {
        ...state,
        step: {
          type: "create-account-auth",
          wallet: action.wallet,
        },
      };
    }
    case LoginActionTypes.GO_TO_PREVIOUS_STEP: {
      switch (state.step.type) {
        case "wallet-loader": {
          return {
            ...state,
            step: {
              type: "wallet-selector",
            },
          };
        }
        default: {
          return state;
        }
      }
    }
    case LoginActionTypes.LOAD_WALLET: {
      return {
        ...state,
        step: {
          type: "wallet-loader",
          walletTask: {
            status: "loading",
          },
          walletName: action.walletName,
        },
      };
    }
    case LoginActionTypes.LOAD_WALLET_FAILURE: {
      if (state.step.type !== "wallet-loader") {
        return state;
      }
      return {
        ...state,
        step: {
          ...state.step,
          walletTask: {
            status: "failed",
            error: action.error,
          },
        },
      };
    }
    case LoginActionTypes.ADD_ACCOUNT_AUTH: {
      return {
        ...state,
        addAccountAuthTask: {
          status: "loading",
        },
      };
    }
    case LoginActionTypes.ADD_ACCOUNT_AUTH_SUCCESS: {
      return {
        ...state,
        addAccountAuthTask: {
          status: "successful",
          data: null,
        },
      };
    }
    case LoginActionTypes.ADD_ACCOUNT_AUTH_FAILURE: {
      return {
        ...state,
        addAccountAuthTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case LoginActionTypes.SET_ACCOUNT_AUTH_SIGNATURE: {
      const chainIdAuthSignatures = state.accountAuthSignatures[action.chainId] || {};

      return {
        ...state,
        accountAuthSignatures: {
          ...state.accountAuthSignatures,
          [action.chainId]: {
            ...chainIdAuthSignatures,
            [action.hermezEthereumAddress]: action.signature,
          },
        },
      };
    }
    case LoginActionTypes.RESET_STATE: {
      const initialLoginState = getInitialLoginState();

      return initialLoginState;
    }
    default: {
      return state;
    }
  }
}

export default loginReducer;

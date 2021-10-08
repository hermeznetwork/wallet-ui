import { AsyncTask } from "src/utils/types";
import {
  LoginActionTypes,
  LoginAction,
  WalletName,
  AccountData,
} from "src/store/login/login.actions";
// domain
import { HermezWallet } from "src/domain/hermez";
import { AuthSignatures } from "src/domain/local-storage";
// persistence
import { getAuthSignatures } from "src/persistence/local-storage";

export interface LoginState {
  step: Step;
  addAccountAuthTask: AsyncTask<null, string>;
  accountAuthSignatures: AuthSignatures;
}

// ToDo: This should be removed when we migrate login.view.jsx module to TS
export enum STEP_NAME {
  WALLET_SELECTOR = "wallet-selector",
  ACCOUNT_SELECTOR = "account-selector",
  WALLET_LOADER = "wallet-loader",
  CREATE_ACCOUNT_AUTH = "create-account-auth",
}

export type Step =
  | {
      type: "wallet-selector";
    }
  | {
      // hardware wallets
      type: "account-selector";
    }
  | {
      type: "wallet-loader";
      walletName: WalletName | undefined;
      accountData: AccountData | undefined;
      walletTask: AsyncTask<HermezWallet.HermezWallet, string>;
    }
  | {
      type: "create-account-auth";
      wallet: HermezWallet.HermezWallet | undefined;
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
    case LoginActionTypes.GO_TO_ACCOUNT_SELECTOR_STEP: {
      return {
        ...state,
        step: {
          type: "account-selector",
        },
      };
    }
    case LoginActionTypes.GO_TO_WALLET_LOADER_STEP: {
      return {
        ...state,
        step: {
          type: "wallet-loader",
          walletName: action.walletName,
          accountData: action.accountData,
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
        case "account-selector": {
          return {
            ...state,
            step: {
              type: "wallet-selector",
            },
          };
        }
        case "wallet-loader": {
          return {
            ...state,
            step:
              state.step.walletName === WalletName.METAMASK ||
              state.step.walletName === WalletName.WALLET_CONNECT
                ? {
                    type: "wallet-selector",
                  }
                : {
                    type: "account-selector",
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
          accountData: undefined,
          walletName: state.step.type === "wallet-loader" ? state.step.walletName : undefined,
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

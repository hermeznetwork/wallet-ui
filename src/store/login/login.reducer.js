import { loginActionTypes } from './login.actions'
import { ACCOUNT_AUTH_SIGNATURES_KEY } from '../../constants'
import { getStorage } from '../../utils/storage'
import { WalletName } from '../../views/login/login.view'

export const STEP_NAME = {
  WALLET_SELECTOR: 'wallet-selector',
  ACCOUNT_SELECTOR: 'account-selector',
  WALLET_LOADER: 'wallet-loader',
  CREATE_ACCOUNT_AUTH: 'create-account-auth',
  ERROR: 'error'
}

function getInitialLoginState () {
  return {
    currentStep: STEP_NAME.WALLET_SELECTOR,
    networkNameTask: {
      status: 'pending'
    },
    steps: {
      [STEP_NAME.ACCOUNT_SELECTOR]: {
        walletName: undefined
      },
      [STEP_NAME.WALLET_LOADER]: {
        walletName: undefined,
        accountData: undefined,
        walletTask: {
          status: 'pending'
        }
      },
      [STEP_NAME.CREATE_ACCOUNT_AUTH]: {
        wallet: undefined
      },
      [STEP_NAME.ERROR]: {
        error: undefined
      }
    },
    addAccountAuthTask: {
      status: 'pending'
    },
    accountAuthSignatures: getStorage(ACCOUNT_AUTH_SIGNATURES_KEY)
  }
}

function loginReducer (state = getInitialLoginState(), action) {
  switch (action.type) {
    case loginActionTypes.GO_TO_WALLET_SELECTOR_STEP: {
      const initialLoginState = getInitialLoginState()

      return {
        ...state,
        currentStep: initialLoginState.currentStep,
        steps: { ...initialLoginState.steps },
        addAccountAuthTask: { ...initialLoginState.addAccountAuthTask }
      }
    }
    case loginActionTypes.GO_TO_ACCOUNT_SELECTOR_STEP: {
      return {
        ...state,
        currentStep: STEP_NAME.ACCOUNT_SELECTOR,
        steps: {
          ...state.steps,
          [STEP_NAME.ACCOUNT_SELECTOR]: {
            walletName: action.walletName
          }
        }
      }
    }
    case loginActionTypes.GO_TO_WALLET_LOADER_STEP: {
      return {
        ...state,
        currentStep: STEP_NAME.WALLET_LOADER,
        steps: {
          ...state.steps,
          [STEP_NAME.WALLET_LOADER]: {
            ...state.steps[STEP_NAME.WALLET_LOADER],
            walletName: action.walletName,
            accountData: action.accountData
          }
        }
      }
    }
    case loginActionTypes.GO_TO_CREATE_ACCOUNT_AUTH_STEP: {
      return {
        ...state,
        currentStep: STEP_NAME.CREATE_ACCOUNT_AUTH,
        steps: {
          ...state.steps,
          [STEP_NAME.CREATE_ACCOUNT_AUTH]: {
            wallet: action.wallet
          }
        }
      }
    }
    case loginActionTypes.GO_TO_ERROR_STEP: {
      return {
        ...state,
        currentStep: STEP_NAME.ERROR,
        steps: {
          ...state.steps,
          [STEP_NAME.ERROR]: {
            error: action.error
          }
        }
      }
    }
    case loginActionTypes.GO_TO_PREVIOUS_STEP: {
      const initialLoginState = getInitialLoginState()

      switch (state.currentStep) {
        case STEP_NAME.ACCOUNT_SELECTOR: {
          return {
            ...state,
            currentStep: STEP_NAME.WALLET_SELECTOR,
            steps: {
              ...state.steps,
              [STEP_NAME.ACCOUNT_SELECTOR]: initialLoginState.steps[STEP_NAME.ACCOUNT_SELECTOR]
            }
          }
        }
        case STEP_NAME.WALLET_LOADER: {
          return {
            ...state,
            currentStep: state.steps[STEP_NAME.WALLET_LOADER].walletName === WalletName.METAMASK ||
              state.steps[STEP_NAME.WALLET_LOADER].walletName === WalletName.WALLET_CONNECT
              ? STEP_NAME.WALLET_SELECTOR
              : STEP_NAME.ACCOUNT_SELECTOR,
            steps: {
              ...state.steps,
              [STEP_NAME.WALLET_LOADER]: initialLoginState.steps[STEP_NAME.WALLET_LOADER]
            }
          }
        }
        default: {
          return state
        }
      }
    }
    case loginActionTypes.LOAD_WALLET: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [STEP_NAME.WALLET_LOADER]: {
            ...state.steps[STEP_NAME.WALLET_LOADER],
            walletTask: {
              status: 'loading'
            }
          }
        }
      }
    }
    case loginActionTypes.LOAD_WALLET_FAILURE: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [STEP_NAME.WALLET_LOADER]: {
            ...state.steps[STEP_NAME.WALLET_LOADER],
            walletTask: {
              status: 'failure',
              error: action.error
            }
          }
        }
      }
    }
    case loginActionTypes.ADD_ACCOUNT_AUTH: {
      return {
        ...state,
        addAccountAuthTask: {
          status: 'loading'
        }
      }
    }
    case loginActionTypes.ADD_ACCOUNT_AUTH_SUCCESS: {
      return {
        ...state,
        addAccountAuthTask: {
          status: 'successful'
        }
      }
    }
    case loginActionTypes.ADD_ACCOUNT_AUTH_FAILURE: {
      return {
        ...state,
        addAccountAuthTask: {
          status: 'failure',
          error: action.error
        }
      }
    }
    case loginActionTypes.SET_ACCOUNT_AUTH_SIGNATURE: {
      const chainIdAuthSignatures = state.accountAuthSignatures[action.chainId] || {}

      return {
        ...state,
        accountAuthSignatures: {
          ...state.accountAuthSignatures,
          [action.chainId]: {
            ...chainIdAuthSignatures,
            [action.hermezEthereumAddress]: action.signature
          }
        }
      }
    }
    case loginActionTypes.LOAD_NETWORK_NAME: {
      return {
        ...state,
        networkNameTask: {
          status: 'loading'
        }
      }
    }
    case loginActionTypes.LOAD_NETWORK_NAME_SUCCESS: {
      return {
        ...state,
        networkNameTask: {
          status: 'successful',
          data: action.networkName
        }
      }
    }
    case loginActionTypes.LOAD_NETWORK_NAME_FAILURE: {
      return {
        ...state,
        networkNameTask: {
          status: 'failure',
          error: action.error
        }
      }
    }
    case loginActionTypes.RESET_STATE: {
      const initialLoginState = getInitialLoginState()

      return {
        ...state,
        currentStep: initialLoginState.currentStep,
        steps: { ...initialLoginState.steps },
        addAccountAuthTask: { ...initialLoginState.addAccountAuthTask }
      }
    }
    default: {
      return state
    }
  }
}

export default loginReducer

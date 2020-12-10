import { loginActionTypes } from './login.actions'

export const STEP_NAME = {
  WALLET_SELECTOR: 'wallet-selector',
  ACCOUNT_SELECTOR: 'account-selector',
  WALLET_LOADER: 'wallet-loader'
}

const initialLoginState = {
  currentStep: STEP_NAME.WALLET_SELECTOR,
  steps: {
    [STEP_NAME.ACCOUNT_SELECTOR]: {
      walletName: undefined
    },
    [STEP_NAME.WALLET_LOADER]: {
      walletName: undefined
    }
  }
}

function loginReducer (state = initialLoginState, action) {
  switch (action.type) {
    case loginActionTypes.GO_TO_ACCOUNT_SELECTOR_STEP: {
      return {
        ...state,
        currentStep: STEP_NAME.ACCOUNT_SELECTOR,
        steps: {
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
          [STEP_NAME.WALLET_LOADER]: {
            walletName: action.walletName,
            accountData: action.accountData
          }
        }
      }
    }
    case loginActionTypes.GO_TO_PREVIOUS_STEP: {
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
            currentStep: state.steps[STEP_NAME.WALLET_LOADER].walletName === 'metaMask'
              ? STEP_NAME.WALLET_SELECTOR
              : STEP_NAME.ACCOUNT_SELECTOR,
            steps: {
              ...state.steps,
              [STEP_NAME.WALLET_LOADER]:
                  initialLoginState.steps[STEP_NAME.WALLET_LOADER]
            }
          }
        }
        default: {
          return state
        }
      }
    }
    default: {
      return state
    }
  }
}

export default loginReducer

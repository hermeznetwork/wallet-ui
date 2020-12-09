import { loginActionTypes } from './login.actions'

export const STEP_NAME = {
  WALLET_SELECTOR: 'wallet-selector',
  ACCOUNT_SELECTOR: 'account-selector',
  LOADING: 'loading'
}

const initialLoginState = {
  currentStep: STEP_NAME.WALLET_SELECTOR,
  steps: {
    [STEP_NAME.ACCOUNT_SELECTOR]: {
      walletName: undefined
    },
    [STEP_NAME.LOADING]: {
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
    case loginActionTypes.GO_TO_LOADING_STEP: {
      return {
        ...state,
        currentStep: STEP_NAME.LOADING,
        steps: {
          [STEP_NAME.LOADING]: {
            walletName: action.walletName
          }
        }
      }
    }
    default: {
      return state
    }
  }
}

export default loginReducer

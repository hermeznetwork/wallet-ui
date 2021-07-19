import { tokenSwapActionTypes } from './token-swap.actions'

export const STEP_NAME = {
  SWAP: 'swap',
  QUOTES: 'quotes'
}

const initialTokenSwapState = {
  currentStep: STEP_NAME.SWAP,
  steps: {
    [STEP_NAME.SWAP]: {},
    [STEP_NAME.QUOTES]: {}
  }
}

function tokenSwapReducer (state = initialTokenSwapState, action) {
  switch (action.type) {
    case tokenSwapActionTypes.GO_TO_SWAP: {
      return {
        ...state,
        currentStep: STEP_NAME.SWAP
      }
    }
    case tokenSwapActionTypes.GO_TO_QUOTES: {
      return {
        ...state,
        currentStep: STEP_NAME.QUOTES
      }
    }
    case tokenSwapActionTypes.RESET_STATE: {
      return { ...initialTokenSwapState }
    }
    default: {
      return state
    }
  }
}

export default tokenSwapReducer

import { tokenSwapActionTypes } from './token-swap.actions'

const initialTokenSwapState = {}

function tokenSwapReducer (state = initialTokenSwapState, action) {
  switch (action.type) {
    case tokenSwapActionTypes.RESET_STATE: {
      return { ...initialTokenSwapState }
    }
    default: {
      return state
    }
  }
}

export default tokenSwapReducer

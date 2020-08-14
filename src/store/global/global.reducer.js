import { globalActionTypes } from './global.actions'

const initialGlobalState = {
  tokensTask: {
    status: 'pending'
  }
}

function globalReducer (state = initialGlobalState, action) {
  switch (action.type) {
    case globalActionTypes.LOAD_TOKENS: {
      return {
        ...state,
        tokensTask: {
          status: 'loading'
        }
      }
    }
    case globalActionTypes.LOAD_TOKENS_SUCCESS: {
      return {
        ...state,
        tokensTask: {
          status: 'successful',
          data: action.accounts
        }
      }
    }
    case globalActionTypes.LOAD_TOKENS_FAILURE: {
      return {
        ...state,
        tokensTask: {
          status: 'failed',
          error: 'An error ocurred loading the tokens'
        }
      }
    }
    default: {
      return state
    }
  }
}

export default globalReducer

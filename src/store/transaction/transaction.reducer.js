import { transactionActionTypes } from './transaction.actions'

const initialTransactionState = {
  tokensTask: {
    status: 'pending'
  },
  metaMaskTokensTask: {
    status: 'pending'
  },
  feesTask: {
    status: 'pending'
  },
  exitTask: {
    status: 'pending'
  }
}

function transactionReducer (state = initialTransactionState, action) {
  switch (action.type) {
    case transactionActionTypes.LOAD_TOKENS: {
      return {
        ...state,
        tokensTask: {
          status: 'loading'
        }
      }
    }
    case transactionActionTypes.LOAD_TOKENS_SUCCESS: {
      return {
        ...state,
        tokensTask: {
          status: 'successful',
          data: action.tokens
        }
      }
    }
    case transactionActionTypes.LOAD_TOKENS_FAILURE: {
      return {
        ...state,
        tokensTask: {
          status: 'failed',
          error: 'An error ocurred loading the tokens'
        }
      }
    }
    case transactionActionTypes.LOAD_METAMASK_TOKENS:
      return {
        ...state,
        metaMaskTokensTask: {
          status: 'loading'
        }
      }
    case transactionActionTypes.LOAD_METAMASK_TOKENS_SUCCESS:
      return {
        ...state,
        metaMaskTokensTask: {
          status: 'successful',
          data: action.metaMaskTokens
        }
      }
    case transactionActionTypes.LOAD_METAMASK_TOKENS_FAILURE:
      return {
        ...state,
        metaMaskTokensTask: {
          status: 'failed',
          error: action.error
        }
      }
    case transactionActionTypes.LOAD_FEES:
      return {
        ...state,
        feesTask: {
          status: 'loading'
        }
      }
    case transactionActionTypes.LOAD_FEES_SUCCESS:
      return {
        ...state,
        feesTask: {
          status: 'successful',
          data: action.fees
        }
      }
    case transactionActionTypes.LOAD_FEES_FAILURE:
      return {
        ...state,
        feesTask: {
          status: 'failed',
          error: action.error
        }
      }
    case transactionActionTypes.LOAD_EXIT:
      return {
        ...state,
        exitTask: {
          status: 'loading'
        }
      }
    case transactionActionTypes.LOAD_EXIT_SUCCESS:
      return {
        ...state,
        exitTask: {
          status: 'successful',
          data: action.exit
        }
      }
    case transactionActionTypes.LOAD_EXIT_FAILURE:
      return {
        ...state,
        exitTask: {
          status: 'failed',
          error: action.error
        }
      }
    default: {
      return state
    }
  }
}

export default transactionReducer

import { transactionActionTypes } from './transaction.actions'

const initialTransactionState = {
  metaMaskTokensTask: {
    status: 'pending'
  },
  feesTask: {
    status: 'pending'
  }
}

function transactionReducer (state = initialTransactionState, action) {
  switch (action.type) {
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
    default: {
      return state
    }
  }
}

export default transactionReducer

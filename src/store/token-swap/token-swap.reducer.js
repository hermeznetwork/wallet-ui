import { tokenSwapActionTypes } from './token-swap.actions'
import { getPaginationData } from '../../utils/api'

export const STEP_NAME = {
  SWAP: 'swap',
  QUOTES: 'quotes'
}

const initialTokenSwapState = {
  currentStep: STEP_NAME.SWAP,
  quoteSidenav: {
    status: 'closed'
  },
  accountsTask: { // TODO check the correct place to this values
    status: 'pending'
  },
  quotesTask: {
    status: 'pending'
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
    case tokenSwapActionTypes.OPEN_QUOTE_SIDENAV: {
      return {
        ...state,
        quoteSidenav: {
          status: 'open',
          data: action.quote
        }
      }
    }
    case tokenSwapActionTypes.CLOSE_QUOTE_SIDENAV: {
      return {
        ...state,
        quoteSidenav: {
          status: 'closed'
        }
      }
    }
    case tokenSwapActionTypes.LOAD_ACCOUNTS_SUCCESS: {
      const accounts = action.data.accounts
      const pagination = getPaginationData(action.data.pendingItems, accounts)
      const fromItemHistory = []

      return {
        ...state,
        accountsTask: {
          status: 'successful',
          data: { accounts, pagination, fromItemHistory }
        }
      }
    }
    case tokenSwapActionTypes.LOAD_ACCOUNTS_FAILURE: {
      return {
        ...state,
        accountsTask: {
          status: 'failed',
          error: 'An error ocurred loading the accounts'
        }
      }
    }
    case tokenSwapActionTypes.GET_QUOTES: {
      return {
        ...state,
        quotesTask: {
          status: 'loading'
        }
      }
    }
    case tokenSwapActionTypes.GET_QUOTES_SUCCESS: {
      return {
        ...state,
        quotesTask: {
          status: 'successful',
          data: action.data
        }
      }
    }
    case tokenSwapActionTypes.GET_QUOTES_FAILURE: {
      return {
        ...state,
        quotesTask: {
          status: 'failure',
          error: action.error
        }
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

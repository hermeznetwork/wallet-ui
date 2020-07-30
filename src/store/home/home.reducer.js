import { homeActionTypes } from './home.actions'

const initialHomeState = {
  accountTask: {
    status: 'pending'
  },
  recentTransactionsTask: {
    status: 'pending'
  }
}

function homeReducer (state = initialHomeState, action) {
  switch (action.type) {
    case homeActionTypes.LOAD_ACCOUNTS: {
      return {
        ...state,
        accountTask: {
          status: 'loading'
        }
      }
    }
    case homeActionTypes.LOAD_ACCOUNTS_SUCCESS: {
      return {
        ...state,
        accountTask: {
          status: 'successful',
          data: action.accounts
        }
      }
    }
    case homeActionTypes.LOAD_ACCOUNTS_FAILURE: {
      return {
        ...state,
        accountTask: {
          status: 'failed',
          error: 'An error ocurred loading the accounts'
        }
      }
    }
    case homeActionTypes.LOAD_RECENT_TRANSACTIONS: {
      return {
        ...state,
        recentTransactionsTask: {
          status: 'loading'
        }
      }
    }
    case homeActionTypes.LOAD_RECENT_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        recentTransactionsTask: {
          status: 'successful',
          data: action.transactions
        }
      }
    }
    case homeActionTypes.LOAD_RECENT_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        recentTransactionsTask: {
          status: 'failed',
          error: 'An error ocurred loading the recent transactions'
        }
      }
    }
    default: {
      return state
    }
  }
}

export default homeReducer

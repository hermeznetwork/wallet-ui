import { homeActionTypes } from './home.actions'

const initialHomeState = {
  accountsTask: {
    status: 'pending'
  },
  transactionsTask: {
    status: 'pending'
  }
}

function homeReducer (state = initialHomeState, action) {
  switch (action.type) {
    case homeActionTypes.LOAD_ACCOUNTS: {
      return {
        ...state,
        accountsTask: {
          status: 'loading'
        }
      }
    }
    case homeActionTypes.LOAD_ACCOUNTS_SUCCESS: {
      return {
        ...state,
        accountsTask: {
          status: 'successful',
          data: action.accounts
        }
      }
    }
    case homeActionTypes.LOAD_ACCOUNTS_FAILURE: {
      return {
        ...state,
        accountsTask: {
          status: 'failed',
          error: 'An error ocurred loading the accounts'
        }
      }
    }
    case homeActionTypes.LOAD_TRANSACTIONS: {
      return {
        ...state,
        transactionsTask: {
          status: 'loading'
        }
      }
    }
    case homeActionTypes.LOAD_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        transactionsTask: {
          status: 'successful',
          data: action.transactions
        }
      }
    }
    case homeActionTypes.LOAD_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        transactionsTask: {
          status: 'failed',
          error: 'An error ocurred loading the transactions'
        }
      }
    }
    default: {
      return state
    }
  }
}

export default homeReducer

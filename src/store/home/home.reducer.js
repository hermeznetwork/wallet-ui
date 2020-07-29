import { homeActionTypes } from './home.actions'

const initialHomeState = {
  coinsBalanceTask: {
    status: 'pending'
  },
  recentTransactionsTask: {
    status: 'pending'
  }
}

function homeReducer (state = initialHomeState, action) {
  switch (action.type) {
    case homeActionTypes.LOAD_COINS_BALANCE: {
      return {
        ...state,
        coinsBalanceTask: {
          status: 'loading'
        }
      }
    }
    case homeActionTypes.LOAD_COINS_BALANCE_SUCCESS: {
      return {
        ...state,
        coinsBalanceTask: {
          status: 'successful',
          data: action.coinsBalance
        }
      }
    }
    case homeActionTypes.LOAD_COINS_BALANCE_FAILURE: {
      return {
        ...state,
        coinsBalanceTask: {
          status: 'failed',
          error: 'An error ocurred loading the coins balance'
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
          data: [action.transactions]
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

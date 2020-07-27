import { homeActionTypes } from './home.actions'

const initialHomeState = {
  coinsBalanceTask: {
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
    default: {
      return state
    }
  }
}

export default homeReducer

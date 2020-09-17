import { homeActionTypes } from './home.actions'

const initialHomeState = {
  accountsTask: {
    status: 'pending'
  },
  usdTokenExchangeRatesTask: {
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
    case homeActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATES: {
      return {
        ...state,
        usdTokenExchangeRatesTask: {
          status: 'loading'
        }
      }
    }
    case homeActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATES_SUCCESS: {
      return {
        ...state,
        usdTokenExchangeRatesTask: {
          status: 'successful',
          data: action.usdTokenExchangeRates
        }
      }
    }
    case homeActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATES_FAILURE: {
      return {
        ...state,
        usdTokenExchangeRatesTask: {
          status: 'failed',
          error: 'An error ocurred loading the USD token exchange rates'
        }
      }
    }
    default: {
      return state
    }
  }
}

export default homeReducer

import { homeActionTypes } from './home.actions'

const initialHomeState = {
  accountsTask: {
    status: 'pending'
  },
  tokensPriceTask: {
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
    case homeActionTypes.LOAD_TOKENS_PRICE: {
      return {
        ...state,
        tokensPriceTask: {
          status: 'loading'
        }
      }
    }
    case homeActionTypes.LOAD_TOKENS_PRICE_SUCCESS: {
      return {
        ...state,
        tokensPriceTask: {
          status: 'successful',
          data: action.tokensPrice
        }
      }
    }
    case homeActionTypes.LOAD_TOKENS_PRICE_FAILURE: {
      return {
        ...state,
        tokensPriceTask: {
          status: 'failed',
          error: 'An error ocurred loading the tokens price'
        }
      }
    }
    default: {
      return state
    }
  }
}

export default homeReducer

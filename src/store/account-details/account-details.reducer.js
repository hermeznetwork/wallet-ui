import { accountDetailsActionTypes } from './account-details.actions'

const initialAccountDetailsReducer = {
  accountTask: {
    status: 'pending'
  },
  usdTokenExchangeRateTask: {
    status: 'pending'
  },
  transactionsTask: {
    status: 'pending'
  }
}

function accountDetailsReducer (state = initialAccountDetailsReducer, action) {
  switch (action.type) {
    case accountDetailsActionTypes.LOAD_ACCOUNT: {
      return {
        ...state,
        accountTask: {
          status: 'loading'
        }
      }
    }
    case accountDetailsActionTypes.LOAD_ACCOUNT_SUCCESS: {
      return {
        ...state,
        accountTask: {
          status: 'successful',
          data: action.account
        }
      }
    }
    case accountDetailsActionTypes.LOAD_ACCOUNT_FAILURE: {
      return {
        ...state,
        accountTask: {
          status: 'failed',
          error: 'An error ocurred loading the account'
        }
      }
    }
    case accountDetailsActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATE: {
      return {
        ...state,
        usdTokenExchangeRateTask: {
          status: 'loading'
        }
      }
    }
    case accountDetailsActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATE_SUCCESS: {
      return {
        ...state,
        usdTokenExchangeRateTask: {
          status: 'successful',
          data: action.usdTokenExchangeRate
        }
      }
    }
    case accountDetailsActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATE_FAILURE: {
      return {
        ...state,
        usdTokenExchangeRateTask: {
          status: 'failed',
          error: 'An error ocurred loading the USD token exchange rate'
        }
      }
    }
    case accountDetailsActionTypes.LOAD_TRANSACTIONS: {
      return {
        ...state,
        transactionsTask: {
          status: 'loading'
        }
      }
    }
    case accountDetailsActionTypes.LOAD_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        transactionsTask: {
          status: 'successful',
          data: action.transactions
        }
      }
    }
    case accountDetailsActionTypes.LOAD_TRANSACTIONS_FAILURE: {
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

export default accountDetailsReducer

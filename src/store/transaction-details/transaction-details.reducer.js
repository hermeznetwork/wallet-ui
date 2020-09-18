import { transactionDetailsActionTypes } from './transaction-details.actions'

const initialTransactionDetailsReducer = {
  transactionTask: {
    status: 'pending'
  },
  usdTokenExchangeRateTask: {
    status: 'pending'
  }
}

function transactionDetailsReducer (state = initialTransactionDetailsReducer, action) {
  switch (action.type) {
    case transactionDetailsActionTypes.LOAD_TRANSACTION: {
      return {
        ...state,
        transactionTask: {
          status: 'loading'
        }
      }
    }
    case transactionDetailsActionTypes.LOAD_TRANSACTION_SUCCESS: {
      return {
        ...state,
        transactionTask: {
          status: 'successful',
          data: action.transaction
        }
      }
    }
    case transactionDetailsActionTypes.LOAD_TRANSACTION_FAILURE: {
      return {
        ...state,
        transactionTask: {
          status: 'failed',
          error: 'An error ocurred loading the transaction'
        }
      }
    }
    case transactionDetailsActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATE: {
      return {
        ...state,
        usdTokenExchangeRateTask: {
          status: 'loading'
        }
      }
    }
    case transactionDetailsActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATE_SUCCESS: {
      return {
        ...state,
        usdTokenExchangeRateTask: {
          status: 'successful',
          data: action.usdTokenExchangeRate
        }
      }
    }
    case transactionDetailsActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATE_FAILURE: {
      return {
        ...state,
        usdTokenExchangeRateTask: {
          status: 'failed',
          error: 'An error ocurred loading the USD token exchange rate'
        }
      }
    }
    default: {
      return state
    }
  }
}

export default transactionDetailsReducer

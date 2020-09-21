import { transactionDetailsActionTypes } from './transaction-details.actions'

const initialTransactionDetailsReducer = {
  transactionTask: {
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
    default: {
      return state
    }
  }
}

export default transactionDetailsReducer

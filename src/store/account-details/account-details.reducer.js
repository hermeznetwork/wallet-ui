import { accountDetailsActionTypes } from './account-details.actions'

const initialAccountDetailsReducer = {
  accountTask: {
    status: 'pending'
  },
  transactionsTask: {
    status: 'pending'
  },
  tokensPriceTask: {
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

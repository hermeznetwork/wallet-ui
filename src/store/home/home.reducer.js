import { homeActionTypes } from './home.actions'

const initialHomeState = {
  accountTask: {
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
    default: {
      return state
    }
  }
}

export default homeReducer

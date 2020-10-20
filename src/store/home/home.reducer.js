import { homeActionTypes } from './home.actions'

const initialHomeState = {
  accountsTask: {
    status: 'pending'
  }
}

function homeReducer (state = initialHomeState, action) {
  switch (action.type) {
    case homeActionTypes.LOAD_ACCOUNTS: {
      return {
        ...state,
        accountsTask: state.accountsTask.status === 'pending'
          ? { status: 'loading' }
          : { status: 'reloading', data: state.accountsTask.data }
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
    default: {
      return state
    }
  }
}

export default homeReducer

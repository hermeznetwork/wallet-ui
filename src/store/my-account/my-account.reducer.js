import { myAccountActionTypes } from './my-account.actions'
import { MY_ACCOUNT } from '../../constants'

function getInitialPreferredCurrency () {
  if (!localStorage.getItem(MY_ACCOUNT.PREFERRED_CURRENCY_KEY)) {
    localStorage.setItem(MY_ACCOUNT.PREFERRED_CURRENCY_KEY, MY_ACCOUNT.DEFAULT_PREFERRED_CURRENCY)

    return MY_ACCOUNT.DEFAULT_PREFERRED_CURRENCY
  } else {
    return localStorage.getItem(MY_ACCOUNT.PREFERRED_CURRENCY_KEY)
  }
}

const initialmyAccountState = {
  preferredCurrency: getInitialPreferredCurrency(),
  estimatedRewardTask: {
    status: 'pending'
  },
  earnedRewardTask: {
    status: 'pending'
  }
}

function myAccountReducer (state = initialmyAccountState, action) {
  switch (action.type) {
    case myAccountActionTypes.CHANGE_PREFERRED_CURRENCY: {
      return {
        ...state,
        preferredCurrency: action.preferredCurrency
      }
    }
    case myAccountActionTypes.LOAD_ESTIMATED_REWARD: {
      return {
        ...state,
        estimatedRewardTask: {
          status: 'loading'
        }
      }
    }
    case myAccountActionTypes.LOAD_ESTIMATED_REWARD_SUCCESS: {
      return {
        ...state,
        estimatedRewardTask: {
          status: 'successful',
          data: action.data
        }
      }
    }
    case myAccountActionTypes.LOAD_ESTIMATED_REWARD_FAILURE: {
      return {
        ...state,
        estimatedRewardTask: {
          status: 'failed',
          error: action.error
        }
      }
    }
    case myAccountActionTypes.LOAD_EARNED_REWARD: {
      return {
        ...state,
        earnedRewardTask: {
          status: 'loading'
        }
      }
    }
    case myAccountActionTypes.LOAD_EARNED_REWARD_SUCCESS: {
      return {
        ...state,
        earnedRewardTask: {
          status: 'successful',
          data: action.data
        }
      }
    }
    case myAccountActionTypes.LOAD_EARNED_REWARD_FAILURE: {
      return {
        ...state,
        earnedRewardTask: {
          status: 'failed',
          error: action.error
        }
      }
    }
    default: {
      return state
    }
  }
}

export default myAccountReducer

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
  preferredCurrency: getInitialPreferredCurrency()
}

function myAccountReducer (state = initialmyAccountState, action) {
  switch (action.type) {
    case myAccountActionTypes.CHANGE_PREFERRED_CURRENCY: {
      return {
        ...state,
        preferredCurrency: action.preferredCurrency
      }
    }
    default: {
      return state
    }
  }
}

export default myAccountReducer

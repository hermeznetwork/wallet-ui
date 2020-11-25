import { myAddressActionTypes } from './my-address.actions'
import { MY_ADDRESS } from '../../constants'

function getInitialPreferredCurrency () {
  if (!localStorage.getItem(MY_ADDRESS.PREFERRED_CURRENCY_KEY)) {
    localStorage.setItem(MY_ADDRESS.PREFERRED_CURRENCY_KEY, MY_ADDRESS.DEFAULT_PREFERRED_CURRENCY)

    return MY_ADDRESS.DEFAULT_PREFERRED_CURRENCY
  } else {
    return localStorage.getItem(MY_ADDRESS.PREFERRED_CURRENCY_KEY)
  }
}

const initialMyAddressState = {
  preferredCurrency: getInitialPreferredCurrency()
}

function myAddressReducer (state = initialMyAddressState, action) {
  switch (action.type) {
    case myAddressActionTypes.CHANGE_PREFERRED_CURRENCY: {
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

export default myAddressReducer

import { settingsActionTypes } from './settings.actions'
import { SETTINGS } from '../../constants'

function getInitialPreferredCurrency () {
  if (!localStorage.getItem(SETTINGS.PREFERRED_CURRENCY_KEY)) {
    localStorage.setItem(SETTINGS.PREFERRED_CURRENCY_KEY, SETTINGS.DEFAULT_PREFERRED_CURRENCY)

    return SETTINGS.DEFAULT_PREFERRED_CURRENCY
  } else {
    return localStorage.getItem(SETTINGS.PREFERRED_CURRENCY_KEY)
  }
}

const initialSettingsState = {
  preferredCurrency: getInitialPreferredCurrency()
}

function settingsReducer (state = initialSettingsState, action) {
  switch (action.type) {
    case settingsActionTypes.CHANGE_PREFERRED_CURRENCY: {
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

export default settingsReducer

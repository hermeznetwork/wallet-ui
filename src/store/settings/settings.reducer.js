import { settingsActionTypes } from './settings.actions'
import { SETTINGS } from '../../constants'

function getInitialPreferredCurrency () {
  // if there is no default currency stored, set to one from constants
  if (!localStorage.getItem('defaultCurrencyId')) {
    localStorage.setItem('defaultCurrencyId', SETTINGS.DEFAULT_CURRENCY_ID)

    return SETTINGS.DEFAULT_CURRENCY_ID
  } else {
    return parseInt(localStorage.getItem('defaultCurrencyId'))
  }
}

const initialSettingsState = {
  ethereumAddress: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
  preferredCurrency: getInitialPreferredCurrency()
}

function settingsReducer (state = initialSettingsState, action) {
  switch (action.type) {
    case settingsActionTypes.LOAD_DEFAULT_CURRENCY: {
      return {
        ...state,
        preferredCurrency: action.tokenId
      }
    }
    default: {
      return state
    }
  }
}

export default settingsReducer

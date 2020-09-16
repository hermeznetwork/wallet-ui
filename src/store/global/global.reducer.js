import { globalActionTypes } from './global.actions'

const initialGlobalState = {
  header: {
    type: 'main'
  },
  redirectRoute: '/',
  tokensTask: {
    status: 'pending'
  },
  configTask: {
    status: 'pending'
  },
  fiatExchangeRatesTask: {
    status: 'pending'
  },
  gasMultiplierTask: {},
  currentBatchTask: {
    status: 'pending'
  }
}

function globalReducer (state = initialGlobalState, action) {
  switch (action.type) {
    case globalActionTypes.CHANGE_HEADER: {
      return {
        ...state,
        header: action.header
      }
    }
    case globalActionTypes.CHANGE_REDIRECT_ROUTE: {
      return {
        ...state,
        redirectRoute: action.redirectRoute
      }
    }
    case globalActionTypes.LOAD_TOKENS: {
      return {
        ...state,
        tokensTask: {
          status: 'loading'
        }
      }
    }
    case globalActionTypes.LOAD_TOKENS_SUCCESS: {
      return {
        ...state,
        tokensTask: {
          status: 'successful',
          data: action.accounts
        }
      }
    }
    case globalActionTypes.LOAD_TOKENS_FAILURE: {
      return {
        ...state,
        tokensTask: {
          status: 'failed',
          error: 'An error ocurred loading the tokens'
        }
      }
    }
    case globalActionTypes.LOAD_CONFIG:
      return {
        ...state,
        configTask: {
          status: 'loading'
        }
      }
    case globalActionTypes.LOAD_CONFIG_SUCCESS:
      return {
        ...state,
        configTask: {
          status: 'successful',
          data: action.config,
          error: action.error
        }
      }
    case globalActionTypes.LOAD_CONFIG_FAILURE:
      return {
        ...state,
        configTask: {
          status: 'failed',
          data: {
            chainId: -1,
            config: action.config
          },
          error: action.error
        }
      }
    case globalActionTypes.LOAD_FIAT_EXCHANGE_RATES: {
      return {
        ...state,
        fiatExchangeRatesTask: {
          status: 'loading'
        }
      }
    }
    case globalActionTypes.LOAD_FIAT_EXCHANGE_RATES_SUCCESS: {
      return {
        ...state,
        fiatExchangeRatesTask: {
          status: 'successful',
          data: action.fiatExchangeRates
        }
      }
    }
    case globalActionTypes.LOAD_FIAT_EXCHANGE_RATES_FAILURE: {
      return {
        ...state,
        fiatExchangeRatesTask: {
          status: 'failure',
          error: action.error
        }
      }
    }
    case globalActionTypes.LOAD_GAS_MULTIPLIER:
      return {
        ...state,
        gasMultiplierTask: {
          data: action.gasMultiplier
        }
      }
    case globalActionTypes.LOAD_CURRENT_BATCH:
      return {
        ...state,
        currentBatchTask: {
          status: 'loading'
        }
      }
    case globalActionTypes.LOAD_CURRENT_BATCH_SUCCESS:
      return {
        ...state,
        currentBatchTask: {
          status: 'successful',
          data: state.currentBatch
        }
      }
    case globalActionTypes.LOAD_CURRENT_BATCH_FAILURE:
      return {
        ...state,
        currentBatchTask: {
          status: 'failed'
        }
      }
    default: {
      return state
    }
  }
}

export default globalReducer

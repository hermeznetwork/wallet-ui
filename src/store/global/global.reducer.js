import { globalActionTypes } from './global.actions'
import { PENDING_WITHDRAWS_KEY } from '../../constants'

function getInitialPendingWithdraws () {
  if (!localStorage.getItem(PENDING_WITHDRAWS_KEY)) {
    const emptyPendingWithdraws = {}

    localStorage.setItem(PENDING_WITHDRAWS_KEY, JSON.stringify(emptyPendingWithdraws))

    return emptyPendingWithdraws
  } else {
    return JSON.parse(localStorage.getItem(PENDING_WITHDRAWS_KEY))
  }
}

const initialGlobalState = {
  metaMaskWalletTask: {
    status: 'pending'
  },
  header: {
    type: undefined
  },
  redirectRoute: '/',
  fiatExchangeRatesTask: {
    status: 'pending'
  },
  snackbar: {
    status: 'closed'
  },
  networkStatus: 'online',
  pendingWithdraws: getInitialPendingWithdraws()
}

function globalReducer (state = initialGlobalState, action) {
  switch (action.type) {
    case globalActionTypes.LOAD_METAMASK_WALLET:
      return {
        ...state,
        metaMaskWalletTask: {
          status: 'loading'
        }
      }
    case globalActionTypes.LOAD_METAMASK_WALLET_SUCCESS:
      return {
        ...state,
        metaMaskWalletTask: {
          status: 'successful',
          data: action.metaMaskWallet
        }
      }
    case globalActionTypes.LOAD_METAMASK_WALLET_FAILURE:
      return {
        ...state,
        metaMaskWalletTask: {
          status: 'failed',
          error: action.error
        }
      }
    case globalActionTypes.UNLOAD_METAMASK_WALLET: {
      return {
        ...state,
        metaMaskWalletTask: {
          status: 'pending'
        }
      }
    }
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
    case globalActionTypes.OPEN_SNACKBAR: {
      return {
        ...state,
        snackbar: {
          status: 'open',
          message: action.message,
          backgroundColor: action.backgroundColor
        }
      }
    }
    case globalActionTypes.CLOSE_SNACKBAR: {
      return {
        ...state,
        snackbar: {
          status: 'closed'
        }
      }
    }
    case globalActionTypes.CHANGE_NETWORK_STATUS: {
      return {
        ...state,
        networkStatus: action.networkStatus
      }
    }
    case globalActionTypes.ADD_PENDING_WITHDRAW: {
      const accountPendingWithdraws = state.pendingWithdraws[action.hermezEthereumAddress]

      return {
        ...state,
        pendingWithdraws: {
          ...state.pendingWithdraws,
          [action.hermezEthereumAddress]: accountPendingWithdraws === undefined
            ? [action.pendingWithdraw]
            : [...accountPendingWithdraws, action.pendingWithdraw]
        }
      }
    }
    case globalActionTypes.REMOVE_PENDING_WITHDRAW: {
      const accountPendingWithdraws = state.pendingWithdraws[action.hermezEthereumAddress]

      return {
        ...state,
        pendingWithdraws: {
          ...state.pendingWithdraws,
          [action.hermezEthereumAddress]: accountPendingWithdraws
            .filter(pendingWithdraw => pendingWithdraw.id !== action.pendingWithdrawId)
        }
      }
    }
    default: {
      return state
    }
  }
}

export default globalReducer

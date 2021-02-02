import { globalActionTypes } from './global.actions'
import { PENDING_WITHDRAWS_KEY, PENDING_DELAYED_WITHDRAWS_KEY, PENDING_DEPOSITS_KEY } from '../../constants'

export const LOAD_ETHEREUM_NETWORK_ERROR = {
  METAMASK_NOT_INSTALLED: 'metamask-not-installed',
  CHAIN_ID_NOT_SUPPORTED: 'chain-id-not-supported'
}

function getInitialPendingWithdraws () {
  if (!localStorage.getItem(PENDING_WITHDRAWS_KEY)) {
    const emptyPendingWithdraws = {}

    localStorage.setItem(PENDING_WITHDRAWS_KEY, JSON.stringify(emptyPendingWithdraws))

    return emptyPendingWithdraws
  } else {
    return JSON.parse(localStorage.getItem(PENDING_WITHDRAWS_KEY))
  }
}

function getInitialPendingDelayedWithdraws () {
  if (!localStorage.getItem(PENDING_DELAYED_WITHDRAWS_KEY)) {
    const emptyPendingDelayedWithdraws = {}

    localStorage.setItem(PENDING_DELAYED_WITHDRAWS_KEY, JSON.stringify(emptyPendingDelayedWithdraws))

    return emptyPendingDelayedWithdraws
  } else {
    return JSON.parse(localStorage.getItem(PENDING_DELAYED_WITHDRAWS_KEY))
  }
}

function getInitialPendingDeposits () {
  if (!localStorage.getItem(PENDING_DEPOSITS_KEY)) {
    const emptyPendingDeposits = {}

    localStorage.setItem(PENDING_DEPOSITS_KEY, JSON.stringify(emptyPendingDeposits))

    return emptyPendingDeposits
  } else {
    return JSON.parse(localStorage.getItem(PENDING_DEPOSITS_KEY))
  }
}

const initialGlobalState = {
  ethereumNetworkTask: {
    status: 'pending'
  },
  wallet: undefined,
  signer: undefined,
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
  pendingWithdraws: getInitialPendingWithdraws(),
  pendingDelayedWithdraws: getInitialPendingDelayedWithdraws(),
  pendingDeposits: getInitialPendingDeposits(),
  coordinatorStateTask: {
    status: 'pending'
  }
}

function globalReducer (state = initialGlobalState, action) {
  switch (action.type) {
    case globalActionTypes.LOAD_ETHEREUM_NETWORK: {
      return {
        ...state,
        ethereumNetworkTask: {
          status: 'loading'
        }
      }
    }
    case globalActionTypes.LOAD_ETHEREUM_NETWORK_SUCCESS: {
      return {
        ...state,
        ethereumNetworkTask: {
          status: 'successful',
          data: action.ethereumNetwork
        }
      }
    }
    case globalActionTypes.LOAD_ETHEREUM_NETWORK_FAILURE: {
      return {
        ...state,
        ethereumNetworkTask: {
          status: 'failure',
          error: action.error
        }
      }
    }
    case globalActionTypes.LOAD_WALLET:
      return {
        ...state,
        wallet: action.wallet
      }
    case globalActionTypes.UNLOAD_WALLET: {
      return {
        ...state,
        wallet: undefined
      }
    }
    case globalActionTypes.SET_SIGNER: {
      return {
        ...state,
        signer: action.signer
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
    case globalActionTypes.ADD_PENDING_DELAYED_WITHDRAW: {
      const accountPendingDelayedWithdraws = state.pendingDelayedWithdraws[action.hermezEthereumAddress]

      return {
        ...state,
        pendingDelayedWithdraws: {
          ...state.pendingDelayedWithdraws,
          [action.hermezEthereumAddress]: accountPendingDelayedWithdraws === undefined
            ? [action.pendingDelayedWithdraw]
            : [...accountPendingDelayedWithdraws, action.pendingDelayedWithdraw]
        }
      }
    }
    case globalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW: {
      const accountPendingDelayedWithdraws = state.pendingDelayedWithdraws[action.hermezEthereumAddress]

      return {
        ...state,
        pendingDelayedWithdraws: {
          ...state.pendingDelayedWithdraws,
          [action.hermezEthereumAddress]: accountPendingDelayedWithdraws
            .filter(pendingDelayedWithdraw => pendingDelayedWithdraw.id !== action.pendingDelayedWithdrawId)
        }
      }
    }
    case globalActionTypes.ADD_PENDING_DEPOSIT: {
      const accountPendingDeposits = state.pendingDeposits[action.hermezEthereumAddress]

      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [action.hermezEthereumAddress]: accountPendingDeposits === undefined
            ? [action.pendingDeposit]
            : [...accountPendingDeposits, action.pendingDeposit]
        }
      }
    }
    case globalActionTypes.REMOVE_PENDING_DEPOSIT: {
      const accountPendingDeposits = state.pendingDeposits[action.hermezEthereumAddress]

      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [action.hermezEthereumAddress]: accountPendingDeposits
            .filter(pendingDeposit => pendingDeposit.token.id !== action.tokenId)
        }
      }
    }
    case globalActionTypes.LOAD_COORDINATOR_STATE: {
      return {
        ...state,
        coordinatorStateTask: {
          status: 'loading'
        }
      }
    }
    case globalActionTypes.LOAD_COORDINATOR_STATE_SUCCESS: {
      return {
        ...state,
        coordinatorStateTask: {
          status: 'successful',
          data: action.coordinatorState
        }
      }
    }
    case globalActionTypes.LOAD_COORDINATOR_STATE_FAILURE: {
      return {
        ...state,
        coordinatorStateTask: {
          status: 'failure',
          error: action.error
        }
      }
    }
    default: {
      return state
    }
  }
}

export default globalReducer

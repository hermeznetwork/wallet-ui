import { globalActionTypes } from './global.actions'
import * as constants from '../../constants'
import * as storage from '../../utils/storage'

export const LOAD_ETHEREUM_NETWORK_ERROR = {
  METAMASK_NOT_INSTALLED: 'metamask-not-installed',
  CHAIN_ID_NOT_SUPPORTED: 'chain-id-not-supported'
}

function getInitialGlobalState () {
  return {
    hermezStatusTask: {
      status: 'pending'
    },
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
    pendingWithdraws: storage.getStorage(constants.PENDING_WITHDRAWS_KEY),
    pendingDelayedWithdraws: storage.getStorage(constants.PENDING_DELAYED_WITHDRAWS_KEY),
    pendingDelayedWithdrawCheckTask: {
      status: 'pending'
    },
    pendingWithdrawalsCheckTask: {
      status: 'pending'
    },
    pendingDeposits: storage.getStorage(constants.PENDING_DEPOSITS_KEY),
    pendingDepositsCheckTask: {
      status: 'pending'
    },
    nextForgers: [],
    coordinatorStateTask: {
      status: 'pending'
    },
    estimatedRewardTask: {
      status: 'pending'
    },
    earnedRewardTask: {
      status: 'pending'
    },
    tokenTask: {
      status: 'pending'
    }
  }
}

function globalReducer (state = getInitialGlobalState(), action) {
  switch (action.type) {
    case globalActionTypes.LOAD_HERMEZ_STATUS: {
      return {
        ...state,
        hermezStatusTask: {
          status: 'loading'
        }
      }
    }
    case globalActionTypes.LOAD_HERMEZ_STATUS_SUCCESS: {
      return {
        ...state,
        hermezStatusTask: {
          status: 'successful',
          data: { isUnderMaintenance: Boolean(action.status) }
        }
      }
    }
    case globalActionTypes.LOAD_HERMEZ_STATUS_FAILURE: {
      return {
        ...state,
        hermezStatusTask: {
          status: 'failure',
          error: action.error
        }
      }
    }
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
      const chainIdPendingWithdraws = state.pendingWithdraws[action.chainId] || {}
      const accountPendingWithdraws = chainIdPendingWithdraws[action.hermezEthereumAddress] || []

      return {
        ...state,
        pendingWithdraws: {
          ...state.pendingWithdraws,
          [action.chainId]: {
            ...chainIdPendingWithdraws,
            [action.hermezEthereumAddress]: [...accountPendingWithdraws, action.pendingWithdraw]
          }
        }
      }
    }
    case globalActionTypes.REMOVE_PENDING_WITHDRAW: {
      const chainIdPendingWithdraws = state.pendingWithdraws[action.chainId] || {}
      const accountPendingWithdraws = chainIdPendingWithdraws[action.hermezEthereumAddress] || []

      return {
        ...state,
        pendingWithdraws: {
          ...state.pendingWithdraws,
          [action.chainId]: {
            ...chainIdPendingWithdraws,
            [action.hermezEthereumAddress]: accountPendingWithdraws
              .filter(withdraw => withdraw.hash !== action.hash)
          }
        }
      }
    }
    case globalActionTypes.ADD_PENDING_DELAYED_WITHDRAW: {
      const chainIdPendingDelayedWithdraws = state.pendingDelayedWithdraws[action.chainId] || {}
      const accountPendingDelayedWithdraws = chainIdPendingDelayedWithdraws[action.hermezEthereumAddress] || []

      return {
        ...state,
        pendingDelayedWithdraws: {
          ...state.pendingDelayedWithdraws,
          [action.chainId]: {
            ...chainIdPendingDelayedWithdraws,
            [action.hermezEthereumAddress]: [...accountPendingDelayedWithdraws, action.pendingDelayedWithdraw]
          }
        }
      }
    }
    case globalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW: {
      const chainIdPendingDelayedWithdraws = state.pendingDelayedWithdraws[action.chainId] || {}
      const accountPendingDelayedWithdraws = chainIdPendingDelayedWithdraws[action.hermezEthereumAddress] || []

      return {
        ...state,
        pendingDelayedWithdraws: {
          ...state.pendingDelayedWithdraws,
          [action.chainId]: {
            ...chainIdPendingDelayedWithdraws,
            [action.hermezEthereumAddress]: accountPendingDelayedWithdraws
              .filter(withdraw => withdraw.id !== action.pendingDelayedWithdrawId)
          }
        }
      }
    }
    case globalActionTypes.UPDATE_PENDING_DELAYED_WITHDRAW_DATE: {
      const chainIdPendingDelayedWithdraws = state.pendingDelayedWithdraws[action.chainId] || {}
      const accountPendingDelayedWithdraws = chainIdPendingDelayedWithdraws[action.hermezEthereumAddress] || []

      return {
        ...state,
        pendingDelayedWithdraws: {
          ...state.pendingDelayedWithdraws,
          [action.chainId]: {
            ...chainIdPendingDelayedWithdraws,
            [action.hermezEthereumAddress]: accountPendingDelayedWithdraws.map((delayedWithdraw) => {
              if (delayedWithdraw.hash === action.transactionHash) {
                return { ...delayedWithdraw, date: action.transactionDate }
              }
              return delayedWithdraw
            })
          }
        }
      }
    }
    case globalActionTypes.CHECK_PENDING_DELAYED_WITHDRAW: {
      return {
        ...state,
        pendingDelayedWithdrawCheckTask: {
          status: 'loading'
        }
      }
    }
    case globalActionTypes.CHECK_PENDING_DELAYED_WITHDRAW_SUCCESS: {
      return {
        ...state,
        pendingDelayedWithdrawCheckTask: {
          status: 'successful'
        }
      }
    }
    case globalActionTypes.CHECK_PENDING_WITHDRAWALS: {
      return {
        ...state,
        pendingWithdrawalsCheckTask: {
          status: 'loading'
        }
      }
    }
    case globalActionTypes.CHECK_PENDING_WITHDRAWALS_SUCCESS: {
      return {
        ...state,
        pendingWithdrawalsCheckTask: {
          status: 'successful'
        }
      }
    }
    case globalActionTypes.ADD_PENDING_DEPOSIT: {
      const chainIdPendingDeposits = state.pendingDeposits[action.chainId] || {}
      const accountPendingDeposits = chainIdPendingDeposits[action.hermezEthereumAddress] || []

      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [action.chainId]: {
            ...chainIdPendingDeposits,
            [action.hermezEthereumAddress]: [...accountPendingDeposits, action.pendingDeposit]
          }
        }
      }
    }
    case globalActionTypes.REMOVE_PENDING_DEPOSIT_BY_HASH: {
      const chainIdPendingDeposits = state.pendingDeposits[action.chainId] || {}
      const accountPendingDeposits = chainIdPendingDeposits[action.hermezEthereumAddress] || []

      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [action.chainId]: {
            ...chainIdPendingDeposits,
            [action.hermezEthereumAddress]: accountPendingDeposits
              .filter(deposit => deposit.hash !== action.hash)
          }
        }
      }
    }
    case globalActionTypes.REMOVE_PENDING_DEPOSIT_BY_ID: {
      const chainIdPendingDeposits = state.pendingDeposits[action.chainId] || {}
      const accountPendingDeposits = chainIdPendingDeposits[action.hermezEthereumAddress] || []

      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [action.chainId]: {
            ...chainIdPendingDeposits,
            [action.hermezEthereumAddress]: accountPendingDeposits
              .filter(deposit => deposit.id !== action.id)
          }
        }
      }
    }
    case globalActionTypes.UPDATE_PENDING_DEPOSIT_ID: {
      const chainIdPendingDeposits = state.pendingDeposits[action.chainId] || {}
      const accountPendingDeposits = chainIdPendingDeposits[action.hermezEthereumAddress] || []

      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [action.chainId]: {
            ...chainIdPendingDeposits,
            [action.hermezEthereumAddress]: accountPendingDeposits.map((deposit) => {
              if (deposit.hash === action.transactionHash) {
                return { ...deposit, id: action.transactionId }
              }
              return deposit
            })
          }
        }
      }
    }
    case globalActionTypes.CHECK_PENDING_DEPOSITS: {
      return {
        ...state,
        pendingDepositsCheckTask: {
          status: 'loading'
        }
      }
    }
    case globalActionTypes.CHECK_PENDING_DEPOSITS_SUCCESS: {
      return {
        ...state,
        pendingDepositsCheckTask: {
          status: 'successful'
        }
      }
    }
    case globalActionTypes.LOAD_COORDINATOR_STATE: {
      if (state.coordinatorStateTask.status === 'reloading') {
        return state
      }

      return {
        ...state,
        coordinatorStateTask: state.coordinatorStateTask.status === 'successful'
          ? { status: 'reloading', data: state.coordinatorStateTask.data }
          : { status: 'loading' }
      }
    }
    case globalActionTypes.LOAD_COORDINATOR_STATE_SUCCESS: {
      const nextForgers = [...new Set(action.coordinatorState.network.nextForgers.map((nextForger) => nextForger.coordinator.URL))]
      return {
        ...state,
        nextForgers,
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
    case globalActionTypes.LOAD_ESTIMATED_REWARD: {
      return {
        ...state,
        estimatedRewardTask: {
          status: 'loading'
        }
      }
    }
    case globalActionTypes.LOAD_ESTIMATED_REWARD_SUCCESS: {
      return {
        ...state,
        estimatedRewardTask: {
          status: 'successful',
          data: action.data
        }
      }
    }
    case globalActionTypes.LOAD_ESTIMATED_REWARD_FAILURE: {
      return {
        ...state,
        estimatedRewardTask: {
          status: 'failed',
          error: action.error
        }
      }
    }
    case globalActionTypes.LOAD_EARNED_REWARD: {
      return {
        ...state,
        earnedRewardTask: {
          status: 'loading'
        }
      }
    }
    case globalActionTypes.LOAD_EARNED_REWARD_SUCCESS: {
      return {
        ...state,
        earnedRewardTask: {
          status: 'successful',
          data: action.data
        }
      }
    }
    case globalActionTypes.LOAD_EARNED_REWARD_FAILURE: {
      return {
        ...state,
        earnedRewardTask: {
          status: 'failed',
          error: action.error
        }
      }
    }
    case globalActionTypes.LOAD_TOKEN: {
      return {
        ...state,
        tokenTask: {
          status: 'loading'
        }
      }
    }
    case globalActionTypes.LOAD_TOKEN_SUCCESS: {
      return {
        ...state,
        tokenTask: {
          status: 'successful',
          data: action.data
        }
      }
    }
    case globalActionTypes.LOAD_TOKEN_FAILURE: {
      return {
        ...state,
        tokenTask: {
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

export default globalReducer

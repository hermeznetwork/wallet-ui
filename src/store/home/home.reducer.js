import { homeActionTypes } from './home.actions'
import { getPaginationData } from '../../utils/api'
import { PaginationOrder } from '@hermeznetwork/hermezjs/src/api'

const initialHomeState = {
  totalBalanceTask: {
    status: 'pending'
  },
  accountsTask: {
    status: 'pending'
  },
  poolTransactionsTask: {
    status: 'pending'
  },
  historyTransactionsTask: {
    status: 'pending'
  },
  exitsTask: {
    status: 'pending'
  }
}

function homeReducer (state = initialHomeState, action) {
  switch (action.type) {
    case homeActionTypes.LOAD_TOTAL_BALANCE: {
      const totalBalanceTask = state.totalBalanceTask.status === 'pending'
        ? { status: 'loading' }
        : { status: 'reloading', data: state.totalBalanceTask.data }

      return {
        ...state,
        totalBalanceTask
      }
    }
    case homeActionTypes.LOAD_TOTAL_BALANCE_SUCCESS: {
      return {
        ...state,
        totalBalanceTask: {
          status: 'successful',
          data: action.balance
        }
      }
    }
    case homeActionTypes.LOAD_TOTAL_BALANCE_FAILURE: {
      return {
        ...state,
        totalBalanceTask: {
          status: 'failed',
          error: 'An error ocurred loading the total balance of the accounts'
        }
      }
    }
    case homeActionTypes.LOAD_ACCOUNTS: {
      if (state.accountsTask.status === 'reloading') {
        return state
      }

      return {
        ...state,
        accountsTask: state.accountsTask.status === 'successful'
          ? { status: 'reloading', data: state.accountsTask.data }
          : { status: 'loading' }
      }
    }
    case homeActionTypes.LOAD_ACCOUNTS_SUCCESS: {
      const accounts = state.accountsTask.status === 'reloading'
        ? [...state.accountsTask.data.accounts, ...action.data.accounts]
        : action.data.accounts
      const pagination = getPaginationData(action.data.pendingItems, accounts)
      const fromItemHistory = state.accountsTask.status === 'reloading'
        ? [...state.accountsTask.data.fromItemHistory, state.accountsTask.data.pagination.fromItem]
        : []

      return {
        ...state,
        accountsTask: {
          status: 'successful',
          data: { accounts, pagination, fromItemHistory }
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
    case homeActionTypes.REFRESH_HISTORY_ACCOUNTS: {
      return {
        ...state,
        accountsTask: {
          ...state.accountsTask,
          status: 'reloading'
        }
      }
    }
    case homeActionTypes.REFRESH_HISTORY_ACCOUNTS_SUCCESS: {
      const pagination = getPaginationData(
        action.data.pendingItems,
        action.data.accounts,
        PaginationOrder.DESC
      )

      return {
        ...state,
        accountsTask: {
          status: 'successful',
          data: {
            ...state.accountsTask.data,
            accounts: action.data.accounts,
            pagination
          }
        }
      }
    }
    case homeActionTypes.LOAD_POOL_TRANSACTIONS: {
      return {
        ...state,
        poolTransactionsTask: {
          status: 'loading',
          data: action.transactions
        }
      }
    }
    case homeActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        poolTransactionsTask: {
          status: 'successful',
          data: action.transactions
        }
      }
    }
    case homeActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        poolTransactionsTask: {
          status: 'failed',
          error: 'An error ocurred loading the transactions from the pool'
        }
      }
    }
    case homeActionTypes.LOAD_HISTORY_TRANSACTIONS: {
      return {
        ...state,
        historyTransactionsTask: {
          status: 'loading'
        }
      }
    }
    case homeActionTypes.LOAD_HISTORY_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        historyTransactionsTask: {
          status: 'successful',
          data: action.transactions
        }
      }
    }
    case homeActionTypes.LOAD_HISTORY_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        historyTransactionsTask: {
          status: 'failed',
          error: 'An error ocurred loading the transactions from the history'
        }
      }
    }
    case homeActionTypes.LOAD_EXITS: {
      return {
        ...state,
        exitsTask: {
          status: 'loading'
        }
      }
    }
    case homeActionTypes.LOAD_EXITS_SUCCESS: {
      return {
        ...state,
        exitsTask: {
          status: 'successful',
          data: action.exits
        }
      }
    }
    case homeActionTypes.LOAD_EXITS_FAILURE: {
      return {
        ...state,
        exitsTask: {
          status: 'failed',
          error: action.error
        }
      }
    }
    case homeActionTypes.RESET_STATE: {
      return { ...initialHomeState }
    }
    default: {
      return state
    }
  }
}

export default homeReducer

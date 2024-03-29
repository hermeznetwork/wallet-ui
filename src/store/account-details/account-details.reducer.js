import { PaginationOrder } from '@hermeznetwork/hermezjs/src/api'

import { accountDetailsActionTypes } from './account-details.actions'
import { getPaginationData } from '../../utils/api'

const initialAccountDetailsState = {
  accountTask: {
    status: 'pending'
  },
  l1TokenBalanceTask: {
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

function accountDetailsReducer (state = initialAccountDetailsState, action) {
  switch (action.type) {
    case accountDetailsActionTypes.LOAD_ACCOUNT: {
      return {
        ...state,
        accountTask: state.accountTask.status === 'pending'
          ? { status: 'loading' }
          : { status: 'reloading', data: state.accountTask.data }
      }
    }
    case accountDetailsActionTypes.LOAD_ACCOUNT_SUCCESS: {
      return {
        ...state,
        accountTask: {
          status: 'successful',
          data: action.account
        }
      }
    }
    case accountDetailsActionTypes.LOAD_ACCOUNT_FAILURE: {
      return {
        ...state,
        accountTask: {
          status: 'failed',
          error: 'An error ocurred loading the account'
        }
      }
    }
    case accountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE: {
      return {
        ...state,
        l1TokenBalanceTask: {
          status: 'loading'
        }
      }
    }
    case accountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE_SUCCESS: {
      return {
        ...state,
        l1TokenBalanceTask: {
          status: 'successful'
        }
      }
    }
    case accountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE_FAILURE: {
      return {
        ...state,
        l1TokenBalanceTask: {
          status: 'failed'
        }
      }
    }
    case accountDetailsActionTypes.LOAD_POOL_TRANSACTIONS: {
      return {
        ...state,
        poolTransactionsTask: state.poolTransactionsTask.status === 'pending'
          ? { status: 'loading' }
          : { status: 'reloading', data: state.poolTransactionsTask.data }
      }
    }
    case accountDetailsActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        poolTransactionsTask: {
          status: 'successful',
          data: action.transactions
        }
      }
    }
    case accountDetailsActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        poolTransactionsTask: {
          status: 'failed',
          error: 'An error ocurred loading the transactions from the pool'
        }
      }
    }
    case accountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS: {
      if (state.historyTransactionsTask.status === 'reloading') {
        return state
      }

      return {
        ...state,
        historyTransactionsTask: state.historyTransactionsTask.status === 'successful'
          ? { status: 'reloading', data: state.historyTransactionsTask.data }
          : { status: 'loading' }
      }
    }
    case accountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS_SUCCESS: {
      const transactions = state.historyTransactionsTask.status === 'reloading'
        ? [...state.historyTransactionsTask.data.transactions, ...action.data.transactions]
        : action.data.transactions
      const pagination = getPaginationData(action.data.pendingItems, transactions, PaginationOrder.DESC)
      const fromItemHistory = state.historyTransactionsTask.status === 'reloading'
        ? [...state.historyTransactionsTask.data.fromItemHistory, state.historyTransactionsTask.data.pagination.fromItem]
        : []

      return {
        ...state,
        historyTransactionsTask: {
          status: 'successful',
          data: { transactions, pagination, fromItemHistory }
        }
      }
    }
    case accountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        historyTransactionsTask: {
          status: 'failed',
          error: 'An error ocurred loading the transactions from the history'
        }
      }
    }
    case accountDetailsActionTypes.REFRESH_HISTORY_TRANSACTIONS: {
      return {
        ...state,
        historyTransactionsTask: {
          ...state.historyTransactionsTask,
          status: 'reloading'
        }
      }
    }
    case accountDetailsActionTypes.REFRESH_HISTORY_TRANSACTIONS_SUCCESS: {
      const pagination = getPaginationData(
        action.data.pendingItems,
        action.data.transactions,
        PaginationOrder.DESC
      )

      return {
        ...state,
        historyTransactionsTask: {
          status: 'successful',
          data: {
            ...state.historyTransactionsTask.data,
            transactions: action.data.transactions,
            pagination
          }
        }
      }
    }
    case accountDetailsActionTypes.LOAD_EXITS: {
      return {
        ...state,
        exitsTask: state.exitsTask.status === 'pending'
          ? { status: 'loading' }
          : { status: 'reloading', data: state.exitsTask.data }
      }
    }
    case accountDetailsActionTypes.LOAD_EXITS_SUCCESS: {
      return {
        ...state,
        exitsTask: {
          status: 'successful',
          data: action.exits
        }
      }
    }
    case accountDetailsActionTypes.LOAD_EXITS_FAILURE: {
      return {
        ...state,
        exitsTask: {
          status: 'failed',
          error: action.error
        }
      }
    }
    case accountDetailsActionTypes.RESET_STATE: {
      return initialAccountDetailsState
    }
    default: {
      return state
    }
  }
}

export default accountDetailsReducer

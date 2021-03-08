import { TxType } from '@hermeznetwork/hermezjs/src/enums'

import { getPaginationData } from '../../utils/api'
import { transactionActionTypes } from './transaction.actions'

export const STEP_NAME = {
  LOAD_INITIAL_DATA: 'load-initial-data',
  CHOOSE_ACCOUNT: 'choose-account',
  BUILD_TRANSACTION: 'build-transaction',
  REVIEW_TRANSACTION: 'review-transaction',
  FINISH_TRANSACTION: 'finish-transaction',
  TRANSACTION_ERROR: 'transaction-error'
}

const initialTransactionState = {
  poolTransactionsTask: {
    status: 'pending'
  },
  currentStep: STEP_NAME.LOAD_INITIAL_DATA,
  steps: {
    [STEP_NAME.LOAD_INITIAL_DATA]: {
      status: 'pending'
    },
    [STEP_NAME.CHOOSE_ACCOUNT]: {
      accountsTask: {
        status: 'pending'
      }
    },
    [STEP_NAME.BUILD_TRANSACTION]: {
      feesTask: {
        status: 'pending'
      },
      account: undefined
    },
    [STEP_NAME.REVIEW_TRANSACTION]: {
      transaction: undefined,
      isTransactionBeingSigned: false
    }
  }
}

function transactionReducer (state = initialTransactionState, action) {
  switch (action.type) {
    case transactionActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP: {
      return {
        ...state,
        currentStep: STEP_NAME.CHOOSE_ACCOUNT
      }
    }
    case transactionActionTypes.GO_TO_BUILD_TRANSACTION_STEP: {
      return {
        ...state,
        currentStep: STEP_NAME.BUILD_TRANSACTION,
        steps: {
          ...state.steps,
          [STEP_NAME.BUILD_TRANSACTION]: {
            ...state.steps[STEP_NAME.BUILD_TRANSACTION],
            account: action.account,
            receiver: action.receiver
          }
        }
      }
    }
    case transactionActionTypes.GO_TO_REVIEW_TRANSACTION_STEP: {
      return {
        ...state,
        currentStep: STEP_NAME.REVIEW_TRANSACTION,
        steps: {
          ...state.steps,
          [STEP_NAME.REVIEW_TRANSACTION]: {
            ...state.steps[STEP_NAME.REVIEW_TRANSACTION],
            transaction: action.transaction
          }
        }
      }
    }
    case transactionActionTypes.GO_TO_FINISH_TRANSACTION_STEP: {
      return {
        ...state,
        currentStep: STEP_NAME.FINISH_TRANSACTION
      }
    }
    case transactionActionTypes.GO_TO_TRANSACTION_ERROR_STEP: {
      return {
        ...state,
        currentStep: STEP_NAME.TRANSACTION_ERROR
      }
    }
    case transactionActionTypes.CHANGE_CURRENT_STEP: {
      return {
        ...state,
        currentStep: action.nextStep
      }
    }
    case transactionActionTypes.LOAD_POOL_TRANSACTIONS: {
      return {
        ...state,
        poolTransactionsTask: {
          status: 'loading'
        }
      }
    }
    case transactionActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        poolTransactionsTask: {
          status: 'successful',
          data: action.transactions
        }
      }
    }
    case transactionActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        poolTransactionsTask: {
          status: 'failed',
          error: action.error
        }
      }
    }
    case transactionActionTypes.LOAD_ACCOUNTS: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [STEP_NAME.CHOOSE_ACCOUNT]: {
            ...state.steps[STEP_NAME.CHOOSE_ACCOUNT],
            accountsTask: state.steps[STEP_NAME.CHOOSE_ACCOUNT].accountsTask.status === 'successful'
              ? { status: 'reloading', data: state.steps[STEP_NAME.CHOOSE_ACCOUNT].accountsTask.data }
              : { status: 'loading' }
          }
        }
      }
    }
    case transactionActionTypes.LOAD_ACCOUNTS_SUCCESS: {
      if (action.transactionType === TxType.Deposit) {
        return {
          ...state,
          steps: {
            ...state.steps,
            [STEP_NAME.CHOOSE_ACCOUNT]: {
              ...state.steps[STEP_NAME.CHOOSE_ACCOUNT],
              accountsTask: {
                status: 'successful',
                data: action.data
              }
            }
          }
        }
      } else {
        const accounts = state.steps[STEP_NAME.CHOOSE_ACCOUNT].accountsTask.status === 'reloading'
          ? [...state.steps[STEP_NAME.CHOOSE_ACCOUNT].accountsTask.data.accounts, ...action.data.accounts]
          : action.data.accounts
        const pagination = getPaginationData(action.data.pendingItems, accounts)

        return {
          ...state,
          steps: {
            ...state.steps,
            [STEP_NAME.CHOOSE_ACCOUNT]: {
              ...state.steps[STEP_NAME.CHOOSE_ACCOUNT],
              accountsTask: {
                status: 'successful',
                data: { accounts, pagination }
              }
            }
          }
        }
      }
    }
    case transactionActionTypes.LOAD_ACCOUNTS_FAILURE: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [STEP_NAME.CHOOSE_ACCOUNT]: {
            ...state.steps[STEP_NAME.CHOOSE_ACCOUNT],
            accountsTask: {
              status: 'failed',
              error: action.error
            }
          }
        }
      }
    }
    case transactionActionTypes.LOAD_ACCOUNT:
    case transactionActionTypes.LOAD_EXIT: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [STEP_NAME.LOAD_INITIAL_DATA]: {
            status: 'loading'
          }
        }
      }
    }
    case transactionActionTypes.LOAD_ACCOUNT_SUCCESS: {
      return {
        ...state,
        currentStep: STEP_NAME.BUILD_TRANSACTION,
        steps: {
          ...state.steps,
          [STEP_NAME.LOAD_INITIAL_DATA]: {
            status: 'successful'
          },
          [STEP_NAME.BUILD_TRANSACTION]: {
            ...state.steps[STEP_NAME.BUILD_TRANSACTION],
            account: action.account
          }
        }
      }
    }
    case transactionActionTypes.LOAD_EXIT_SUCCESS:
      return {
        ...state,
        currentStep: STEP_NAME.REVIEW_TRANSACTION,
        steps: {
          ...state.steps,
          [STEP_NAME.LOAD_INITIAL_DATA]: {
            status: 'successful'
          },
          [STEP_NAME.BUILD_TRANSACTION]: {
            account: action.account
          },
          [STEP_NAME.REVIEW_TRANSACTION]: {
            ...state.steps[STEP_NAME.REVIEW_TRANSACTION],
            transaction: {
              exit: action.exit,
              amount: action.exit.balance,
              token: action.exit.token,
              to: {
                hezEthereumAddress: action.hermezEthereumAddress
              }
            }
          }
        }
      }
    case transactionActionTypes.LOAD_ACCOUNT_FAILURE:
    case transactionActionTypes.LOAD_EXIT_FAILURE: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [STEP_NAME.LOAD_INITIAL_DATA]: {
            status: 'failed',
            error: action.error
          }
        }
      }
    }
    case transactionActionTypes.LOAD_FEES:
      return {
        ...state,
        steps: {
          ...state.steps,
          [STEP_NAME.BUILD_TRANSACTION]: {
            ...state.steps[STEP_NAME.BUILD_TRANSACTION],
            feesTask: {
              status: 'loading'
            }
          }
        }
      }
    case transactionActionTypes.LOAD_FEES_SUCCESS:
      return {
        ...state,
        steps: {
          ...state.steps,
          [STEP_NAME.BUILD_TRANSACTION]: {
            ...state.steps[STEP_NAME.BUILD_TRANSACTION],
            feesTask: {
              status: 'successful',
              data: action.fees
            }
          }
        }
      }
    case transactionActionTypes.LOAD_FEES_FAILURE:
      return {
        ...state,
        steps: {
          ...state.steps,
          [STEP_NAME.BUILD_TRANSACTION]: {
            ...state.steps[STEP_NAME.BUILD_TRANSACTION],
            feesTask: {
              status: 'failed',
              error: action.error
            }
          }
        }
      }
    case transactionActionTypes.START_TRANSACTION_SIGNING: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [STEP_NAME.REVIEW_TRANSACTION]: {
            ...state.steps[STEP_NAME.REVIEW_TRANSACTION],
            isTransactionBeingSigned: true
          }
        }
      }
    }
    case transactionActionTypes.STOP_TRANSACTION_SIGNING: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [STEP_NAME.REVIEW_TRANSACTION]: {
            ...state.steps[STEP_NAME.REVIEW_TRANSACTION],
            isTransactionBeingSigned: false
          }
        }
      }
    }
    case transactionActionTypes.RESET_STATE: {
      return initialTransactionState
    }
    default: {
      return state
    }
  }
}

export default transactionReducer

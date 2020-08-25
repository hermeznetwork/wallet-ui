import { txActionTypes } from './tx.actions'

const initialTxState = {
  depositTask: {
    status: 'pending'
  },
  withdrawTask: {
    status: 'pending'
  },
  transferTask: {
    status: 'pending'
  },
  exitTask: {
    status: 'pending'
  },
  forceExitTask: {
    status: 'pending'
  },
  approveTask: {
    status: 'pending'
  },
  fetchTokensTask: {
    status: 'pending'
  }
}

function txReducer (state = initialTxState, action) {
  switch (action.type) {
    case txActionTypes.DEPOSIT:
      return {
        ...state,
        depositTask: {
          status: 'loading'
        }
      }
    case txActionTypes.DEPOSIT_SUCCESS:
      return {
        ...state,
        depositTask: {
          status: 'successful',
          data: action.depositInfo
        }
      }
    case txActionTypes.DEPOSIT_FAILURE:
      return {
        ...state,
        depositTask: {
          status: 'failed',
          error: action.error
        }
      }
    case txActionTypes.WITHDRAW:
      return {
        ...state,
        withdrawTask: {
          status: 'loading'
        }
      }
    case txActionTypes.WITHDRAW_SUCCESS:
      return {
        ...state,
        withdrawTask: {
          status: 'successful',
          data: action.withdrawInfo
        }
      }
    case txActionTypes.WITHDRAW_FAILURE:
      return {
        ...state,
        withdrawTask: {
          status: 'failed',
          data: action.error
        }
      }
    case txActionTypes.FORCE_EXIT:
      return {
        ...state,
        forceExitTask: {
          status: 'loading'
        }
      }
    case txActionTypes.FORCE_EXIT_SUCCESS:
      return {
        ...state,
        forceExitTask: {
          status: 'successful',
          data: action.forceExitInfo
        }
      }
    case txActionTypes.FORCE_EXIT_FAILURE:
      return {
        ...state,
        forceExitTask: {
          status: 'failed',
          data: action.error
        }
      }
    case txActionTypes.TRANSFER:
      return {
        ...state,
        transferTask: {
          status: 'loading'
        }
      }
    case txActionTypes.TRANSFER_SUCCESS:
      return {
        ...state,
        transferTask: {
          status: 'successful',
          data: action.transferInfo
        }
      }
    case txActionTypes.TRANSFER_FAILURE:
      return {
        ...state,
        transferTask: {
          status: 'failed',
          error: action.error
        }
      }
    case txActionTypes.APPROVE:
      return {
        ...state,
        approveTask: {
          status: 'loading'
        }
      }
    case txActionTypes.APPROVE_SUCCESS:
      return {
        ...state,
        approveTask: {
          status: 'successful',
          data: action.approveInfo
        }
      }
    case txActionTypes.APPROVE_FAILURE:
      return {
        ...state,
        approveTask: {
          status: 'failed',
          error: action.error
        }
      }
    case txActionTypes.FETCH_TOKENS:
      return {
        ...state,
        fetchTokensTask: {
          status: 'loading'
        }
      }
    case txActionTypes.FETCH_TOKENS_SUCCESS:
      return {
        ...state,
        fetchTokensTask: {
          status: 'successful',
          data: action.fetchTokensInfo
        }
      }
    case txActionTypes.FETCH_TOKENS_FAILURE:
      return {
        ...state,
        fetchTokensTask: {
          status: 'loading',
          error: action.error
        }
      }
    default:
      return state
  }
}

export default txReducer

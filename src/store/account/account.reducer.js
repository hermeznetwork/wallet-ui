import { accountActionTypes } from './account.actions'

const initialAccountState = {
  metamaskWalletTask: {
    status: 'pending'
  },
  accountInfoTask: {
    status: 'pending'
  }
}

function accountReducer (state = initialAccountState, action) {
  switch (action.type) {
    case accountActionTypes.LOAD_METAMASK_WALLET:
      return {
        ...state,
        metamaskWalletTask: {
          status: 'loading'
        }
      }
    case accountActionTypes.LOAD_METAMASK_WALLET_SUCCESS:
      return {
        ...state,
        metamaskWalletTask: {
          status: 'successful',
          data: action.metamaskWallet
        }
      }
    case accountActionTypes.LOAD_METAMASK_WALLET_ERROR:
      return {
        ...state,
        metamaskWalletTask: {
          stauts: 'failed',
          error: action.error
        }
      }
    case accountActionTypes.ACCOUNT_INFO:
      return {
        ...state,
        accountInfoTask: {
          status: 'loading'
        }
      }
    case accountActionTypes.ACCOUNT_INFO_SUCCESS:
      return {
        ...state,
        accountInfoTask: {
          status: 'successful',
          data: action.accountInfo
        }
      }
    case accountActionTypes.ACCOUNT_INFO_FAILURE:
      return {
        ...state,
        accountInfoTask: {
          status: 'failed',
          error: action.error
        }
      }
    default: {
      return state
    }
  }
}

export default accountReducer

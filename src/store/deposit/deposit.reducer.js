import { depositActionTypes } from './deposit.actions'

const initialDepositState = {
  metaMaskTokensTask: {
    status: 'pending'
  }
}

function depositReducer (state = initialDepositState, action) {
  switch (action.type) {
    case depositActionTypes.LOAD_METAMASK_TOKENS:
      return {
        ...state,
        metaMaskTokensTask: {
          status: 'loading'
        }
      }
    case depositActionTypes.LOAD_METAMASK_TOKENS_SUCCESS:
      return {
        ...state,
        metaMaskTokensTask: {
          status: 'successful',
          data: action.metaMaskTokens
        }
      }
    case depositActionTypes.LOAD_METAMASK_TOKENS_FAILURE:
      return {
        ...state,
        metaMaskTokensTask: {
          status: 'failed',
          error: 'Error fetching the tokens stored in your MetaMask account.'
        }
      }
    default: {
      return state
    }
  }
}

export default depositReducer

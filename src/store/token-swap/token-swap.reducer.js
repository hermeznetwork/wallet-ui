import { tokenSwapActionTypes } from './token-swap.actions'
import { getPaginationData } from '../../utils/api'

export const STEP_NAME = {
  SWAP: 'swap',
  QUOTES: 'quotes'
}

const initialTokenSwapState = {
  currentStep: STEP_NAME.SWAP,
  steps: {
    [STEP_NAME.SWAP]: {},
    [STEP_NAME.QUOTES]: {}
  },
  quoteSidenav: {
    status: 'closed'
  },
  quotesTask: {
    status: 'successful',
    data:
      [
        {
          amountFromToken: '156513938130000',
          amountToToken: '100000000000000000',
          fromToken: '0x0000000000000000000000000000000000000000',
          lpId: 'mockLP',
          lpInfo: {
            description: 'A very cool and honest liquidity provider',
            name: 'Sushi',
            rewards: [
              {
                amount: '100000000000000000',
                comment: 'every time',
                token: 'HEZ'
              }
            ],
            url: 'http://sushiswap.com'
          },
          toToken: '0x55a1db90a5753e6ff50fd018d7e648d58a081486',
          validUntil: '2021-07-28T16:12:19.827987365Z'
        },
        {
          amountFromToken: '156513938130000',
          amountToToken: '1000000000000000000',
          fromToken: '0x0000000000000000000000000000000000000000',
          lpId: 'mockLP2',
          lpInfo: {
            description: 'A very cool and honest liquidity provider',
            name: 'Uniswap',
            rewards: null,
            url: 'http://uniswap.com'
          },
          toToken: '0x55a1db90a5753e6ff50fd018d7e648d58a081486',
          validUntil: '2021-07-28T16:12:19.827987365Z'
        }
      ]
  },
  accountsTask: { // TODO check the correct place to this values
    status: 'pending',
    data: { accounts: [], fromItemHistory: [] }
  }
}

function tokenSwapReducer (state = initialTokenSwapState, action) {
  switch (action.type) {
    case tokenSwapActionTypes.GO_TO_SWAP: {
      return {
        ...state,
        currentStep: STEP_NAME.SWAP
      }
    }
    case tokenSwapActionTypes.GO_TO_QUOTES: {
      return {
        ...state,
        currentStep: STEP_NAME.QUOTES
      }
    }
    case tokenSwapActionTypes.OPEN_QUOTE_SIDENAV: {
      return {
        ...state,
        quoteSidenav: {
          status: 'open',
          data: action.quote
        }
      }
    }
    case tokenSwapActionTypes.CLOSE_QUOTE_SIDENAV: {
      return {
        ...state,
        quoteSidenav: {
          status: 'closed'
        }
      }
    }
    case tokenSwapActionTypes.LOAD_ACCOUNTS_SUCCESS: {
      const accounts = [
        ...state.accountsTask.data.accounts,
        ...action.data.accounts
      ]
      const pagination = getPaginationData(action.data.pendingItems, accounts)
      const fromItemHistory = []

      return {
        ...state,
        accountsTask: {
          status: 'successful',
          data: { accounts, pagination, fromItemHistory }
        }
      }
    }
    case tokenSwapActionTypes.LOAD_ACCOUNTS_FAILURE: {
      return {
        ...state,
        accountsTask: {
          status: 'failed',
          error: 'An error ocurred loading the accounts'
        }
      }
    }
    case tokenSwapActionTypes.RESET_STATE: {
      return { ...initialTokenSwapState }
    }
    default: {
      return state
    }
  }
}

export default tokenSwapReducer

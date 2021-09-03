import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'

import globalReducer, { GlobalState } from './global/global.reducer'
import homeReducer from './home/home.reducer'
import myAccountReducer from './my-account/my-account.reducer'
import accountDetailsReducer, { AccountDetailsState } from './account-details/account-details.reducer'
import transactionDetailsReducer from './transaction-details/transaction-details.reducer'
import transactionReducer from './transaction/transaction.reducer'
import loginReducer from './login/login.reducer'
import tokenSwapReducer from './token-swap/token-swap.reducer'
import { History } from 'history'

export interface RootState {
  accountDetails: AccountDetailsState;
  global: GlobalState;
}

/**
 * Creates the Redux store root reducer combining all the reducers used in the app
 * @param {History} history - Browser history
 * @returns {Object} - Root reducer
 */
export function createRootReducer (history: History) {
  return combineReducers({
    router: connectRouter(history),
    global: globalReducer,
    home: homeReducer,
    accountDetails: accountDetailsReducer,
    myAccount: myAccountReducer,
    transactionDetails: transactionDetailsReducer,
    transaction: transactionReducer,
    login: loginReducer,
    tokenSwap: tokenSwapReducer
  })
}

/**
 * Configures the Redux store and all of its tools: Redux Thunk, Connected React Router
 * and Redux Dev Tools
 * @param {History} history - Browser history
 * @returns {Object} - Redux store
 */
export function configureStore (history: History) {
  const middlewares = [thunk, routerMiddleware(history)]
  const middlewareEnhancer = applyMiddleware(...middlewares)
  const enhancers = [middlewareEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)
  const rootReducer = createRootReducer(history)
  return createStore(rootReducer, composedEnhancers)
}

import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'

import globalReducer from './global/global.reducer'
import accountReducer from './account/account.reducer'
import homeReducer from './home/home.reducer'
import settingsReducer from './settings/settings.reducer'
import accountDetailsReducer from './account-details/account-details.reducer'
import transactionDetailsReducer from './transaction-details/transaction-details.reducer'
import transactionReducer from './transaction/transaction.reducer'

function createRootReducer (history) {
  return combineReducers({
    router: connectRouter(history),
    global: globalReducer,
    account: accountReducer,
    home: homeReducer,
    accountDetails: accountDetailsReducer,
    settings: settingsReducer,
    transactionDetails: transactionDetailsReducer,
    transaction: transactionReducer
  })
}

function configureStore (history) {
  const middlewares = [thunk, routerMiddleware(history)]
  const middlewareEnhancer = applyMiddleware(...middlewares)
  const enhancers = [middlewareEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)
  const rootReducer = createRootReducer(history)

  return createStore(rootReducer, composedEnhancers)
}

export default configureStore

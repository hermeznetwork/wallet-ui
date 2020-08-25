import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'

import transactionsReducer from './tx/tx.reducer'
import txStateReducer from './tx-state/tx-state.reducer'
import globalReducer from './global/global.reducer'
import accountReducer from './account/account.reducer'
import homeReducer from './home/home.reducer'
import settingsReducer from './settings/settings.reducer'
import accountDetailsReducer from './account-details/account-details.reducer'

const rootReducer = combineReducers({
  global: globalReducer,
  account: accountReducer,
  home: homeReducer,
  accountDetails: accountDetailsReducer,
  settings: settingsReducer,
  transactions: transactionsReducer,
  txState: txStateReducer
})

const middlewares = [thunk]
const middlewareEnhancer = applyMiddleware(...middlewares)

const enhancers = [middlewareEnhancer]
const composedEnhancers = compose(...enhancers)

const store = createStore(rootReducer, composedEnhancers)

export default store

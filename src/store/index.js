import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'

import generalReducer from './general/reducer'
import transactionsReducer from './tx/reducer'
import txStateReducer from './tx-state/reducer'
import globalReducer from './global/global.reducer'
import homeReducer from './home/home.reducer'
import accountReducer from './account/account.reducer'

const rootReducer = combineReducers({
  global: globalReducer,
  home: homeReducer,
  account: accountReducer,
  general: generalReducer,
  transactions: transactionsReducer,
  txState: txStateReducer
})

const middlewares = [thunk]
const middlewareEnhancer = applyMiddleware(...middlewares)

const enhancers = [middlewareEnhancer]
const composedEnhancers = compose(...enhancers)

const store = createStore(rootReducer, composedEnhancers)

export default store

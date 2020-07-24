import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'

import generalReducer from './general/reducer'
import transactionsReducer from './tx/reducer'
import txStateReducer from './tx-state/reducer'
import homeReducer from './home/home.reducer'

const rootReducer = combineReducers({
  home: homeReducer,
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

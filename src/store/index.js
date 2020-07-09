import {
  createStore, applyMiddleware, compose, combineReducers
} from 'redux'
import thunk from 'redux-thunk'

import generalReducer from './general/reducer'
import transactionsReducer from './tx/reducer'
import txStateReducer from './tx-state/reducer'

const rootReducer = combineReducers({
  general: generalReducer,
  transactions: transactionsReducer,
  txState: txStateReducer
})

const middleware = [thunk]

const store = createStore(rootReducer, compose(applyMiddleware(...middleware)))

export default store

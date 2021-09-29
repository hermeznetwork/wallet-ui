import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { connectRouter, routerMiddleware, RouterState } from "connected-react-router";
import thunk from "redux-thunk";
import { History } from "history";

import globalReducer, { GlobalState } from "./global/global.reducer";
import homeReducer, { HomeState } from "./home/home.reducer";
import myAccountReducer from "./my-account/my-account.reducer";
import accountDetailsReducer, {
  AccountDetailsState,
} from "./account-details/account-details.reducer";
import transactionDetailsReducer from "./transaction-details/transaction-details.reducer";
import transactionReducer from "./transaction/transaction.reducer";
import loginReducer from "./login/login.reducer";
import tokenSwapReducer from "./token-swap/token-swap.reducer";

export interface RootState {
  accountDetails: AccountDetailsState;
  global: GlobalState;
  home: HomeState;
  router: RouterState;
}

/**
 * Creates the Redux store root reducer combining all the reducers used in the app
 * @param {History} history - Browser history
 * @returns {Object} - Root reducer
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    global: globalReducer,
    home: homeReducer,
    accountDetails: accountDetailsReducer,
    myAccount: myAccountReducer,
    transactionDetails: transactionDetailsReducer,
    transaction: transactionReducer,
    login: loginReducer,
    tokenSwap: tokenSwapReducer,
  });
}

/**
 * Configures the Redux store and all of its tools: Redux Thunk, Connected React Router
 * and Redux Dev Tools
 * @param {History} history - Browser history
 * @returns {Object} - Redux store
 */
// ToDo: Create the AppAction type and replace this AnyAction with the AppAction
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function configureStore(history: History) {
  const middlewares = [thunk, routerMiddleware(history)];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);
  const rootReducer = createRootReducer(history);

  return createStore(rootReducer, composedEnhancers);
}

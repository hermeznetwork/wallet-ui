import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { connectRouter, routerMiddleware, RouterState, RouterAction } from "connected-react-router";
import thunk from "redux-thunk";
import { History } from "history";

import globalReducer, { GlobalState } from "src/store/global/global.reducer";
import { GlobalAction } from "src/store/global/global.actions";
import homeReducer, { HomeState } from "src/store/home/home.reducer";
import { HomeAction } from "src/store/home/home.actions";
import myAccountReducer, { MyAccountState } from "src/store/my-account/my-account.reducer";
import { MyAccountAction } from "src/store/my-account/my-account.actions";
import accountDetailsReducer, {
  AccountDetailsState,
} from "src/store/account-details/account-details.reducer";
import { AccountDetailsAction } from "src/store/account-details/account-details.actions";
import transactionDetailsReducer from "src/store/transaction-details/transaction-details.reducer";
import transactionReducer from "src/store/transaction/transaction.reducer";
import loginReducer, { LoginState } from "src/store/login/login.reducer";
import { LoginAction } from "src/store/login/login.actions";
import tokenSwapReducer from "src/store/token-swap/token-swap.reducer";
import transferReducer, { TransferState } from "src/store/transactions/transfer/transfer.reducer";
import { TransferAction } from "src/store/transactions/transfer/transfer.actions";

export type AppAction =
  | RouterAction
  | GlobalAction
  | HomeAction
  | MyAccountAction
  | AccountDetailsAction
  | LoginAction
  | TransferAction;

export interface RootState {
  router: RouterState;
  global: GlobalState;
  home: HomeState;
  accountDetails: AccountDetailsState;
  myAccount: MyAccountState;
  login: LoginState;
  transfer: TransferState;
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
    transfer: transferReducer,
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
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function configureStore(history: History) {
  const middlewares = [thunk, routerMiddleware(history)];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);
  const rootReducer = createRootReducer(history);

  return createStore(rootReducer, composedEnhancers);
}

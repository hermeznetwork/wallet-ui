import { createStore, applyMiddleware, combineReducers, Reducer, Store } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
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
import transactionDetailsReducer, {
  TransactionDetailsState,
} from "src/store/transaction-details/transaction-details.reducer";
import { TransactionDetailsAction } from "src/store/transaction-details/transaction-details.actions";
import loginReducer, { LoginState } from "src/store/login/login.reducer";
import { LoginAction } from "src/store/login/login.actions";
import transferReducer, { TransferState } from "src/store/transactions/transfer/transfer.reducer";
import { TransferAction } from "src/store/transactions/transfer/transfer.actions";
import { ExitAction } from "src/store/transactions/exit/exit.actions";
import exitReducer, { ExitState } from "src/store/transactions/exit/exit.reducer";
import { WithdrawAction } from "src/store/transactions/withdraw/withdraw.actions";
import withdrawReducer, { WithdrawState } from "src/store/transactions/withdraw/withdraw.reducer";
import { DepositAction } from "src/store/transactions/deposit/deposit.actions";
import depositReducer, { DepositState } from "./transactions/deposit/deposit.reducer";
import { ForceExitAction } from "./transactions/force-exit/force-exit.actions";
import forceExitReducer, { ForceExitState } from "./transactions/force-exit/force-exit.reducer";

export type AppAction =
  | RouterAction
  | GlobalAction
  | HomeAction
  | MyAccountAction
  | AccountDetailsAction
  | LoginAction
  | TransferAction
  | ExitAction
  | WithdrawAction
  | DepositAction
  | ForceExitAction
  | TransactionDetailsAction;

export interface AppState {
  router: RouterState;
  global: GlobalState;
  home: HomeState;
  accountDetails: AccountDetailsState;
  myAccount: MyAccountState;
  login: LoginState;
  transfer: TransferState;
  exit: ExitState;
  withdraw: WithdrawState;
  deposit: DepositState;
  forceExit: ForceExitState;
  transactionDetails: TransactionDetailsState;
}

export type AppDispatch = ThunkDispatch<AppState, undefined, AppAction>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, AppAction>;

/**
 * Creates the Redux store root reducer combining all the reducers used in the app
 */
export function createAppReducer(history: History): Reducer<AppState> {
  return combineReducers({
    router: connectRouter(history),
    global: globalReducer,
    home: homeReducer,
    accountDetails: accountDetailsReducer,
    myAccount: myAccountReducer,
    transactionDetails: transactionDetailsReducer,
    transfer: transferReducer,
    exit: exitReducer,
    withdraw: withdrawReducer,
    deposit: depositReducer,
    forceExit: forceExitReducer,
    login: loginReducer,
  });
}

/**
 * Configures the Redux store and all of its tools: Redux Thunk, Connected React Router
 * and Redux Dev Tools
 */
export function configureStore(history: History): Store<AppState, AppAction> {
  const middlewares = [thunk, routerMiddleware(history)];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);
  const appReducer = createAppReducer(history);

  return createStore(appReducer, composedEnhancers);
}

import React from "react";

import Home from "src/views/home/home.view";
import Login from "src/views/login/login.view";
import Transfer from "src/views/transactions/transfer/transfer.view";
import Deposit from "src/views/transactions/deposit/deposit.view";
import Exit from "src/views/transactions/exit/exit.view";
import Withdraw from "src/views/transactions/withdraw/withdraw.view";
import ForceExit from "src/views/transactions/force-exit/force-exit.view";
import MyAccount from "src/views/my-account/my-account.view";
import AccountDetails from "src/views/account-details/account-details.view";
import TransactionDetails from "src/views/transaction-details/transaction-details.view";
import MyCode from "src/views/my-code/my-code.view";

type RouteKey =
  | "home"
  | "login"
  | "deposit"
  | "transfer"
  | "withdraw"
  | "withdrawComplete"
  | "forceWithdraw"
  | "myAccount"
  | "myCode"
  | "accountDetails"
  | "transactionDetails";

export interface Route {
  path: string;
  render: () => JSX.Element;
  isPublic?: boolean;
  isHidden?: boolean;
}

const routes: Record<RouteKey, Route> = {
  home: {
    path: "/",
    render: () => <Home />,
  },
  login: {
    path: "/login",
    isPublic: true,
    render: () => <Login />,
  },
  deposit: {
    path: "/deposit",
    render: () => <Deposit />,
  },
  transfer: {
    path: "/transfer",
    render: () => <Transfer />,
  },
  withdraw: {
    path: "/withdraw",
    render: () => <Exit />,
  },
  withdrawComplete: {
    path: "/withdraw-complete",
    render: () => <Withdraw />,
  },
  forceWithdraw: {
    path: "/force-withdraw",
    render: () => <ForceExit />,
  },
  myAccount: {
    path: "/my-account",
    render: () => <MyAccount />,
  },
  myCode: {
    path: "/my-code",
    render: () => <MyCode />,
  },
  accountDetails: {
    path: "/accounts/:accountIndex",
    render: () => <AccountDetails />,
  },
  transactionDetails: {
    path: "/accounts/:accountIndex/transactions/:transactionId",
    render: () => <TransactionDetails />,
  },
};

export default routes;

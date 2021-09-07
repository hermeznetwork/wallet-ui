import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import Home from "../views/home/home.view";
import Login from "../views/login/login.view";
import Transaction from "../views/transaction/transaction.view";
import MyAccount from "../views/my-account/my-account.view";
import AccountDetails from "../views/account-details/account-details.view";
import TransactionDetails from "../views/transaction-details/transaction-details.view";
import MyCode from "../views/my-code/my-code.view";
import TokenSwap from "../views/token-swap/token-swap.view";

const routes = {
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
    render: () => <Transaction transactionType={TxType.Deposit} />,
  },
  transfer: {
    path: "/transfer",
    render: () => <Transaction transactionType={TxType.Transfer} />,
  },
  withdraw: {
    path: "/withdraw",
    render: () => <Transaction transactionType={TxType.Exit} />,
  },
  withdrawComplete: {
    path: "/withdraw-complete",
    render: () => <Transaction transactionType={TxType.Withdraw} />,
  },
  forceWithdraw: {
    path: "/force-withdrawal",
    render: () => <Transaction transactionType={TxType.ForceExit} />,
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
  tokenSwap: {
    path: "/token-swap",
    render: () => <TokenSwap />,
    isHidden: process.env.REACT_APP_ENABLE_TOKEN_SWAP !== "true",
  },
};

export default routes;

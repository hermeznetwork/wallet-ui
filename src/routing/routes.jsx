import React from 'react'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'

import Home from '../views/home/home.view'
import Login from '../views/login/login.view'
import Transaction from '../views/transaction/transaction.view'
import MyAccount from '../views/my-account/my-account.view'
import AccountDetails from '../views/account-details/account-details.view'
import TransactionDetails from '../views/transaction-details/transaction-details.view'
import MyCode from '../views/my-code/my-code.view'

const routes = [
  {
    path: '/',
    render: () => <Home />
  },
  {
    path: '/login',
    isPublic: true,
    render: () => <Login />
  },
  {
    path: '/deposit',
    render: () => <Transaction transactionType={TxType.Deposit} />
  },
  {
    path: '/transfer',
    render: () => <Transaction transactionType={TxType.Transfer} />
  },
  {
    path: '/withdraw',
    render: () => <Transaction transactionType={TxType.Exit} />
  },
  {
    path: '/withdraw-complete',
    render: () => <Transaction transactionType={TxType.Withdraw} />
  },
  {
    path: '/force-withdrawal',
    render: () => <Transaction transactionType={TxType.ForceExit} />
  },
  {
    path: '/my-account',
    render: () => <MyAccount />
  },
  {
    path: '/my-code',
    render: () => <MyCode />
  },
  {
    path: '/accounts/:accountIndex',
    render: () => <AccountDetails />
  },
  {
    path: '/accounts/:accountIndex/transactions/:transactionId',
    render: () => <TransactionDetails />
  }
]

export default routes

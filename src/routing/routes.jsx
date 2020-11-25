import React from 'react'

import Home from '../views/home/home.view'
import Transaction, { TransactionType } from '../views/transaction/transaction.view'
import Settings from '../views/settings/settings.view'
import AccountDetails from '../views/account-details/account-details.view'
import TransactionDetails from '../views/transaction-details/transaction-details.view'
import Login from '../views/login/login.view'
import MyAddress from '../views/my-address/my-address.view'

const routes = [
  {
    path: '/',
    render: () => <Home />
  },
  {
    path: '/login',
    render: () => <Login />
  },
  {
    path: '/deposit',
    render: () => <Transaction transactionType={TransactionType.Deposit} />
  },
  {
    path: '/transfer',
    render: () => <Transaction transactionType={TransactionType.Transfer} />
  },
  {
    path: '/withdraw',
    render: () => <Transaction transactionType={TransactionType.Exit} />
  },
  {
    path: '/withdraw-complete',
    render: () => <Transaction transactionType={TransactionType.Withdraw} />
  },
  {
    path: '/force-withdrawal',
    render: () => <Transaction transactionType={TransactionType.ForceExit} />
  },
  {
    path: '/settings',
    render: () => <Settings />
  },
  {
    path: '/my-address',
    render: () => <MyAddress />
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

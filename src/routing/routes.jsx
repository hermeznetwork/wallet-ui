import React from 'react'

import Home from '../views/home/home.view'
import Transaction from '../views/transaction/transaction.view'
import Settings from '../views/settings/settings.view'
import AccountDetails from '../views/account-details/account-details.view'
import TransactionDetails from '../views/transaction-details/transaction-details.view'
import Login from '../views/login/login.view'
import TransactionConfirmation from '../views/transaction-confirmation/transaction-confirmation.view'

const routes = [
  {
    path: '/',
    render: () => <Home />,
    renderLayout: true
  },
  {
    path: '/login',
    render: () => <Login />,
    renderLayout: false
  },
  {
    path: '/deposit',
    render: () => <Transaction transactionType='deposit' />,
    renderLayout: false
  },
  {
    path: '/transfer',
    render: () => <Transaction transactionType='transfer' />,
    renderLayout: false
  },
  {
    path: '/settings',
    render: () => <Settings />,
    renderLayout: true
  },
  {
    path: '/accounts/:tokenId',
    render: () => <AccountDetails />,
    renderLayout: true
  },
  {
    path: '/accounts/:tokenId/transactions/:transactionId',
    render: () => <TransactionDetails />,
    renderLayout: true
  },
  {
    path: '/transaction-confirmation',
    render: () => <TransactionConfirmation />,
    renderLayout: false
  }
]

export default routes

import Home from '../views/home/home.view'
import Deposit from '../views/deposit/deposit.view'
import Transfer from '../views/transfer/transfer.view'
import Settings from '../views/settings/settings.view'
import AccountDetails from '../views/account-details/account-details.view'
import TransactionDetails from '../views/transaction-details/transaction-details.view'
import Login from '../views/login/login.view'

const routes = [
  {
    path: '/',
    component: Home,
    renderLayout: true
  },
  {
    path: '/login',
    component: Login,
    renderLayout: false
  },
  {
    path: '/deposit',
    component: Deposit,
    renderLayout: false
  },
  {
    path: '/transfer',
    component: Transfer,
    renderLayout: false
  },
  {
    path: '/settings',
    component: Settings,
    renderLayout: true
  },
  {
    path: '/accounts/:accountIndex',
    component: AccountDetails,
    renderLayout: true
  },
  {
    path: '/accounts/:tokenId/transactions/:transactionId',
    component: TransactionDetails,
    renderLayout: true
  }
]

export default routes

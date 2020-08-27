import Home from '../views/home/home.view'
import Transfer from '../views/transfer/transfer.view'
import Settings from '../views/settings/settings.view'
import AccountDetails from '../views/account-details/account-details.view'
import TransactionDetails from '../views/transaction-details/transaction-details.view'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/transfer',
    component: Transfer
  },
  {
    path: '/settings',
    component: Settings
  },
  {
    path: '/accounts/:tokenId',
    component: AccountDetails
  },
  {
    path: '/accounts/:tokenId/transactions/:transactionId',
    component: TransactionDetails
  }
]

export default routes

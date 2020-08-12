import Home from '../views/home/home.view'
import Transfer from '../views/transfer/transfer.view'
import Settings from '../views/settings/settings.view'
import AccountDetails from '../views/account-details/account-details.view'

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
  }
]

export default routes

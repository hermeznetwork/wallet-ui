import Home from '../views/home/home.view'
import Activity from '../views/activity/activity.view'
import Transfer from '../views/transfer/transfer.view'
import Settings from '../views/settings/settings.view'

const routes = [
  {
    path: '/',
    label: 'Home',
    component: Home
  },
  {
    path: '/transfer',
    label: 'Transfer',
    component: Transfer
  },
  {
    path: '/activity',
    label: 'Activity',
    component: Activity
  },
  {
    path: '/settings',
    label: 'Settings',
    component: Settings
  }
]

export default routes

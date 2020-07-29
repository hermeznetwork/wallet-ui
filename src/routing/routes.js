import Home from '../views/home/home.view'
import Transfer from '../views/transfer/transfer.view'

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
  }
]

export default routes

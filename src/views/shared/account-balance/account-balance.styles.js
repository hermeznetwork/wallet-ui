import { createUseStyles } from 'react-jss'

const useAccountBalanceStyles = createUseStyles({
  root: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center'
  },
  amount: {
    margin: 0
  },
  currency: {
    margin: 0,
    marginLeft: 8
  }
})

export default useAccountBalanceStyles

import { createUseStyles } from 'react-jss'

const useAccountBalanceStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center'
  },
  amount: {
    fontSize: theme.spacing(5),
    margin: 0
  },
  currency: {
    margin: 0,
    marginLeft: 8
  }
}))

export default useAccountBalanceStyles

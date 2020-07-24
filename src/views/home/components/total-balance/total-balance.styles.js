import { createUseStyles } from 'react-jss'

const useTotalBalanceStyles = createUseStyles({
  root: {
    display: 'flex',
    alignItems: 'baseline'
  },
  amount: {
    margin: 0
  },
  currency: {
    margin: 0,
    marginLeft: 8
  }
})

export default useTotalBalanceStyles

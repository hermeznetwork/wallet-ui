import { createUseStyles } from 'react-jss'

const usePendingDepositListStyles = createUseStyles(theme => ({
  pendingDeposit: {
    width: '100%',
    marginBottom: theme.spacing(2.5)
  }
}))

export default usePendingDepositListStyles

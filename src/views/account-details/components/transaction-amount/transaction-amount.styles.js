import { createUseStyles } from 'react-jss'

const useTransactionAmountStyles = createUseStyles(theme => ({
  root: {
    fontWeight: theme.fontWeights.bold
  },
  depositAmount: {
    color: theme.palette.green
  }
}))

export default useTransactionAmountStyles

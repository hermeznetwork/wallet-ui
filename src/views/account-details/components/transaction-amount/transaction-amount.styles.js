import { createUseStyles } from 'react-jss'

const useTransactionAmountStyles = createUseStyles(theme => ({
  depositAmount: {
    color: theme.palette.green
  }
}))

export default useTransactionAmountStyles

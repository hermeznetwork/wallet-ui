import { createUseStyles } from 'react-jss'

const useTransactionDetailsStyles = createUseStyles(theme => ({
  root: {
    width: '100%'
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  highlightedAmount: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  }
}))

export default useTransactionDetailsStyles

import { createUseStyles } from 'react-jss'

const useTransactionStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: `${theme.spacing(3)}px 0`
  },
  row: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  topRow: {
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing(2)
  },
  bottomRow: {
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main
  }
}))

export default useTransactionStyles

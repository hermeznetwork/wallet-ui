import { createUseStyles } from 'react-jss'

const useTransactionInfoRowStyles = createUseStyles(theme => ({
  root: {
    padding: `${theme.spacing(3.5)}px 0 ${theme.spacing(3)}px`,
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.grey.veryLight}`
  },
  title: {
    color: theme.palette.black.dark,
    fontWeight: theme.fontWeights.medium
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  subtitle: {
    color: theme.palette.black.dark,
    fontWeight: theme.fontWeights.bold,
    marginBottom: `${theme.spacing(1.5)}px`
  },
  value: {
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium
  }
}))

export default useTransactionInfoRowStyles

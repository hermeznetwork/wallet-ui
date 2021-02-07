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
  },
  link: {
    fontWeight: theme.fontWeights.bold,
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.grey.main,
    padding: theme.spacing(1),
    marginTop: theme.spacing(6)
  },
  linkIcon: {
    marginRight: theme.spacing(1.5),
    '& > path': {
      fill: theme.palette.grey.main
    }
  }
}))

export default useTransactionDetailsStyles

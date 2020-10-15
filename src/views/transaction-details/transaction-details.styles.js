import { createUseStyles } from 'react-jss'

const useTransactionDetailsStyles = createUseStyles(theme => ({
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  fiatAmount: {
    fontSize: `${theme.spacing(5)}px`,
    color: theme.palette.black.light,
    fontWeight: theme.fontWeights.extraBold,
    marginBottom: `${theme.spacing(1)}px`
  },
  tokenAmount: {
    fontSize: `${theme.spacing(2.5)}px`,
    color: theme.palette.grey.dark,
    fontWeight: theme.fontWeights.medium
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
    marginRight: theme.spacing(1.5)
  }
}))

export default useTransactionDetailsStyles

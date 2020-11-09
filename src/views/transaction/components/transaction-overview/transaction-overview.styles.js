import { createUseStyles } from 'react-jss'

const useTransactionOverviewStyles = createUseStyles(theme => ({
  root: {
    marginTop: theme.headerHeight,
    marginBottom: theme.spacing(3)
  },
  amountsSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: theme.spacing(6.5)
  },
  transactionInfoSection: {
    top: theme.spacing(29),
    position: 'absolute',
    left: 0,
    width: '100%'
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  fiatAmount: {
    marginTop: `${theme.spacing(2)}px`,
    marginBottom: `${theme.spacing(1)}px`
  },
  txButton: {
    width: '100%',
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.white,
    padding: `${theme.spacing(2.25)}px 0`,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 20,
    border: 0,
    marginTop: `${theme.spacing(5)}px`,
    cursor: 'pointer',
    outline: 0,
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(3)}px`,
      padding: `${theme.spacing(3)}px 0`
    }
  }
}))

export default useTransactionOverviewStyles

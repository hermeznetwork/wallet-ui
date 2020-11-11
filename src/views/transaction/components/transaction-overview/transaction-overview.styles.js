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
  signingSpinnerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(10)
  },
  signingText: {
    width: 200,
    lineHeight: 1.75,
    marginTop: theme.spacing(4),
    textAlign: 'center'
  },
  txButton: {
    width: '100%',
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.white,
    padding: `${theme.spacing(2.25)}px 0`,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 20,
    border: 0,
    marginTop: theme.spacing(10),
    cursor: 'pointer',
    outline: 0,
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(3),
      padding: `${theme.spacing(3)}px 0`
    }
  }
}))

export default useTransactionOverviewStyles

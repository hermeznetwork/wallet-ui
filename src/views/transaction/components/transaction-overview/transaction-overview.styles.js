import { createUseStyles } from 'react-jss'

const useTransactionOverviewStyles = createUseStyles(theme => ({
  root: {
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
  highlightedAmount: {
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
  exitInfoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(3)
  },
  exitHelperTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.grey.light,
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: 50
  },
  exitHelperIcon: {
    fill: theme.palette.grey.main,
    marginRight: theme.spacing(1)
  },
  exitHelperText: {
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium
  },
  exitEstimatedFeeHelperText: {
    marginTop: theme.spacing(2),
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium
  }
}))

export default useTransactionOverviewStyles

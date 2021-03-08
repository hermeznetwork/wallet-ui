import { createUseStyles } from 'react-jss'

const useAccountStyles = createUseStyles(theme => ({
  root: ({ hasPendingDeposit, isDisabled }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: hasPendingDeposit ? theme.palette.black : theme.palette.grey.light,
    borderRadius: theme.spacing(2),
    cursor: isDisabled ? 'default' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    pointerEvents: isDisabled ? 'none' : 'all'
  }),
  account: {
    padding: theme.spacing(2.5),
    [theme.breakpoints.upSm]: {
      padding: `${theme.spacing(3)}px ${theme.spacing(5)}px`
    }
  },
  values: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  topRow: ({ hasPendingDeposit }) => ({
    color: hasPendingDeposit ? theme.palette.white : theme.palette.black,
    marginBottom: theme.spacing(1.5)
  }),
  topRowText: {
    fontSize: theme.spacing(2),
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2.5)
    }
  },
  tokenName: {
    fontWeight: theme.fontWeights.medium
  },
  tokenSymbol: {
    fontWeight: theme.fontWeights.bold
  },
  tokenBalance: {
    fontWeight: theme.fontWeights.medium
  },
  fiatBalance: {
    fontWeight: theme.fontWeights.medium
  },
  bottomRow: {
    color: theme.palette.grey.main
  },
  pendingLabelContainer: {
    backgroundColor: theme.palette.orange.light,
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginTop: -theme.spacing(0.5)
  },
  pendingLabelText: {
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.secondary.dark
  }
}))

export default useAccountStyles

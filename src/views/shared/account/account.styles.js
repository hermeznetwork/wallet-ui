import { createUseStyles } from 'react-jss'

const useAccountStyles = createUseStyles(theme => ({
  root: ({ hasPendingDeposit, isDisabled, isClickable }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: hasPendingDeposit ? theme.palette.black : theme.palette.grey.light,
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(3)}px ${theme.spacing(5)}px`,
    cursor: isDisabled || !isClickable ? 'default' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    pointerEvents: isDisabled ? 'none' : 'all'
  }),
  values: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  topRow: ({ hasPendingDeposit }) => ({
    color: hasPendingDeposit ? theme.palette.white : theme.palette.black,
    fontSize: theme.spacing(2.5),
    marginBottom: theme.spacing(1.5)
  }),
  tokenName: {
    fontWeight: theme.fontWeights.bold
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

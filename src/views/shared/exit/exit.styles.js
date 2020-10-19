import { createUseStyles } from 'react-jss'

const useExitStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: theme.palette.black,
    padding: `${theme.spacing(2.5)}px ${theme.spacing(5)}px ${theme.spacing(3.5)}px`,
    marginBottom: `${theme.spacing(2.5)}px`
  },
  step: {
    color: theme.palette.grey.dark,
    fontWeight: theme.fontWeights.medium,
    fontSize: theme.spacing(1.75),
    marginBottom: theme.spacing(2)
  },
  rowTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  txType: {
    color: theme.palette.white,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.spacing(2.5)
  },
  amountFiat: {
    color: theme.palette.white,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.spacing(2.5)
  },
  rowBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  stepTagWrapper: {
    borderRadius: 8,
    backgroundColor: theme.palette.orange.light,
    padding: `${theme.spacing(1)}px`
  },
  stepTag: {
    color: theme.palette.orange.dark,
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium
  },
  tokenAmount: {
    color: theme.palette.grey.dark,
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.medium
  }
}))

export default useExitStyles

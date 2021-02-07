import { createUseStyles } from 'react-jss'

const useAccountStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: theme.palette.grey.light,
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(3)}px ${theme.spacing(5)}px`,
    cursor: 'pointer'
  },
  values: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  topRow: {
    color: theme.palette.black,
    fontSize: theme.spacing(2.5),
    marginBottom: theme.spacing(1.5)
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
  }
}))

export default useAccountStyles

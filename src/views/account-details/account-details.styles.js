import { createUseStyles } from 'react-jss'

const useAccountDetailsStyles = createUseStyles(theme => ({
  root: {
    width: '100%'
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  tokenBalance: {
    textAlign: 'center',
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.dark,
    marginBottom: theme.spacing(2)
  },
  fiatBalance: {
    fontSize: theme.spacing(5),
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.black,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  }
}))

export default useAccountDetailsStyles

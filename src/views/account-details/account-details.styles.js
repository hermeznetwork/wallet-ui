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
  fiatBalance: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  tokenBalance: {
    marginBottom: theme.spacing(3)
  }
}))

export default useAccountDetailsStyles

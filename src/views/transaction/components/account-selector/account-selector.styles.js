import { createUseStyles } from 'react-jss'

const useAccountSelectorStyles = createUseStyles(theme => ({
  root: {
    marginTop: theme.headerHeight,
    marginBottom: theme.spacing(3),
    paddingTop: theme.spacing(4),
    [theme.breakpoints.upSm]: {
      paddingTop: theme.spacing(6)
    }
  },
  accountListWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

export default useAccountSelectorStyles

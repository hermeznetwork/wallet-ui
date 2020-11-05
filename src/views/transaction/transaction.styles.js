import { createUseStyles } from 'react-jss'

const useTransactionLayoutStyles = createUseStyles(theme => ({
  wrapper: {
    width: '100%',
    paddingTop: theme.headerHeight,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.upSm]: {
      marginTop: theme.spacing(6)
    }
  }
}))

export default useTransactionLayoutStyles

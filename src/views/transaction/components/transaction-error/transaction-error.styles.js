import { createUseStyles } from 'react-jss'

const useTransactionErrorStyles = createUseStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: '100%',
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  image: {
    marginTop: theme.spacing(20),
    width: '100%',
    maxWidth: theme.spacing(28)
  },
  text: {
    fontSize: `${theme.spacing(3)}px`,
    color: theme.palette.black.light,
    fontWeight: theme.fontWeights.bold,
    textAlign: 'center',
    marginTop: theme.spacing(5),
    marginLeft: theme.spacing(6),
    marginRight: theme.spacing(6),
    [theme.breakpoints.upSm]: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3)
    }
  }
}))

export default useTransactionErrorStyles

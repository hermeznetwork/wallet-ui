import { createUseStyles } from 'react-jss'

const useSnackbarStyles = createUseStyles(theme => ({
  root: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: theme.spacing(5)
  },
  wrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.black,
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(1),
    color: theme.palette.white,
    fontWeight: 'bold'
  }
}))

export default useSnackbarStyles

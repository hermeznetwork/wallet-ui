import { createUseStyles } from 'react-jss'

const useSnackbarStyles = createUseStyles(theme => ({
  root: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: theme.spacing(5)
  },
  wrapper: ({ backgroundColor }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: backgroundColor || theme.palette.white,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    color: backgroundColor ? theme.palette.white : theme.palette.black,
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing(3),
    border: backgroundColor ? 'none' : `solid 1.5px ${theme.palette.grey.veryLight}`
  }),
  message: {
    textAlign: 'center'
  }
}))

export default useSnackbarStyles

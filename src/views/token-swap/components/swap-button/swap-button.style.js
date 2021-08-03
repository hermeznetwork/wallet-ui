import { createUseStyles } from 'react-jss'

const useSwapButtonStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    border: 'none',
    color: theme.palette.white,
    fontWeight: theme.fontWeights.bold,
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2.5)
    },
    padding: `${theme.spacing(2.25)}px 0`,
    marginTop: theme.spacing(3),
    width: '50%',
    borderRadius: theme.spacing(10)
  },
  btnDisabled: {
    backgroundColor: theme.palette.grey.main
  }
}))

export default useSwapButtonStyles

import { createUseStyles } from 'react-jss'

const useMetaMaskErrorStyles = createUseStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(12)
  },
  errorTitle: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.dark,
    marginBottom: theme.spacing(6),
    textAlign: 'center'
  },
  href: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.bold,
    marginTop: theme.spacing(6),
    padding: `${theme.spacing(3)}px ${theme.spacing(9)}px`,
    color: theme.palette.white,
    backgroundColor: theme.palette.secondary.main,
    border: 0,
    outline: 'none',
    borderRadius: 100,
    transition: theme.hoverTransition,
    '&:hover': {
      backgroundColor: theme.palette.secondary.hover
    }
  }
}))

export default useMetaMaskErrorStyles

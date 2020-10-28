import { createUseStyles } from 'react-jss'

const useMainHeaderStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    position: 'fixed',
    height: theme.headerHeight,
    display: 'flex',
    alignItems: 'center',
    zIndex: 999,
    background: theme.palette.primary.main
  },
  headerContent: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  logo: {
    textDecoration: 'none',
    color: 'currentColor',
    display: 'flex'
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  settingsLink: {
    left: 0,
    marginLeft: -(theme.spacing(1))
  },
  addressLink: {
    right: 0,
    marginRight: -(theme.spacing(1))
  },
  linkText: {
    fontWeight: theme.fontWeights.bold,
    whiteSpace: 'nowrap'
  },
  settingsIcon: {
    marginRight: theme.spacing(1.5)
  },
  addressIcon: {
    marginLeft: theme.spacing(1.5)
  }
}))

export default useMainHeaderStyles

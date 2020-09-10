import { createUseStyles } from 'react-jss'

const useHeaderStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    padding: `${theme.spacing(2)}px 0`,
    position: 'fixed',
    background: theme.palette.primary.main
  },
  headerContent: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: `0 -${theme.spacing(1)}px`
  },
  logo: {
    textDecoration: 'none',
    color: 'currentColor',
    display: 'flex'
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1)
  },
  linkText: {
    fontWeight: 'bold'
  },
  myAccountIcon: {
    marginRight: theme.spacing(1.5)
  },
  qrScannerIcon: {
    marginLeft: theme.spacing(1.5)
  }
}))

export default useHeaderStyles

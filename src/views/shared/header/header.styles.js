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
    justifyContent: 'space-between'
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
    fontWeight: theme.fontWeights.bold
  },
  myAccountIcon: {
    marginLeft: -8,
    marginRight: theme.spacing(1.5)
  },
  qrScannerIcon: {
    marginLeft: theme.spacing(1.5),
    marginRight: -8
  }
}))

export default useHeaderStyles

import { createUseStyles } from 'react-jss'

const useLoginStyles = createUseStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  goBackButton: {
    position: 'absolute',
    top: theme.spacing(2),
    right: 0,
    display: 'flex',
    background: 'transparent',
    border: 0,
    outline: 'none',
    cursor: 'pointer',
    padding: theme.spacing(1),
    marginRight: -theme.spacing(1)
  },
  logo: {
    width: 128,
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.upSm]: {
      marginTop: theme.spacing(9)
    }
  },
  description: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    marginBottom: theme.spacing(7),
    textAlign: 'center'
  },
  networkName: {
    marginBottom: theme.spacing(8)
  },
  connectText: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    marginBottom: theme.spacing(6),
    color: theme.palette.grey.dark
  },
  addAccountText: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing(6)
  },
  connectedText: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing(6)
  },
  updateMetaMaskAlert: {
    marginTop: theme.spacing(5),
    maxWidth: 564
  },
  legalContainer: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(12.5),
    color: theme.palette.grey.dark
  },
  legalSeparator: {
    margin: `0 ${theme.spacing(1.5)}px`,
    cursor: 'default'
  },
  privacyPolicyUrl: {
    position: 'absolute',
    transform: 'translateX(-64px)',
    padding: theme.spacing(1)
  },
  termsOfServiceUrl: {
    position: 'absolute',
    transform: 'translateX(73px)',
    padding: theme.spacing(1)
  }
}))

export default useLoginStyles

import { createUseStyles } from 'react-jss'

const useLoginStyles = createUseStyles(theme => ({
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
  }
}))

export default useLoginStyles

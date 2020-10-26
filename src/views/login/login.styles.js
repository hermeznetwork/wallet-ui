import { createUseStyles } from 'react-jss'

const metaMaskIconWrapperStyles = (theme) => ({
  border: 0,
  borderRadius: theme.spacing(4),
  background: theme.palette.white,
  width: theme.spacing(12),
  height: theme.spacing(12),
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

const useLoginStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    background: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  logo: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(12),
    [theme.breakpoints.sm]: {
      marginTop: theme.spacing(9)
    }
  },
  connectText: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.normal,
    marginBottom: theme.spacing(6)
  },
  connectedText: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing(6)
  },
  walletContainer: {
    ...metaMaskIconWrapperStyles(theme)
  },
  walletButtonContainer: {
    ...metaMaskIconWrapperStyles(theme),
    cursor: 'pointer',
    '&:focus': {
      outline: 'none'
    }
  },
  walletButtonImage: {
    width: '100%'
  },
  walletName: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.bold,
    marginTop: theme.spacing(2)
  },
  helperText: {
    lineHeight: 1.75,
    fontWeight: theme.fontWeights.medium,
    marginTop: theme.spacing(4),
    maxWidth: 176,
    textAlign: 'center'
  }
}))

export default useLoginStyles

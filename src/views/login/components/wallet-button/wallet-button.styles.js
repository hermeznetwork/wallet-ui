import { createUseStyles } from 'react-jss'

const metaMaskLogoWrapperStyles = (theme) => ({
  border: 0,
  borderRadius: theme.spacing(4),
  background: theme.palette.white,
  boxShadow: `0px 3px 16px ${theme.palette.orange.light}`,
  transition: theme.hoverTransition,
  width: theme.spacing(12),
  height: theme.spacing(12),
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

const WalletButtonStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  walletDivContainer: {
    ...metaMaskLogoWrapperStyles(theme)
  },
  walletButtonContainer: {
    ...metaMaskLogoWrapperStyles(theme),
    cursor: 'pointer',
    '&:hover': {
      boxShadow: 'none',
      transform: 'scale(0.97)'
    },
    '&:focus': {
      outline: 'none'
    }
  },
  walletName: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.bold,
    marginTop: theme.spacing(2)
  }
}))

export default WalletButtonStyles

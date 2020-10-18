import { createUseStyles } from 'react-jss'

const useMyAddressStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  qrCode: {
    marginTop: theme.spacing(7)
  },
  address: {
    maxWidth: 216,
    lineHeight: `${theme.spacing(2.5)}px`,
    fontWeight: theme.fontWeights.medium,
    marginTop: theme.spacing(4),
    wordBreak: 'break-word',
    textAlign: 'center'
  }
}))

export default useMyAddressStyles

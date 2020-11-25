import { createUseStyles } from 'react-jss'

import { MY_CODE } from '../../constants'

const useMyCodeStyles = createUseStyles(theme => ({
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
    maxWidth: MY_CODE.QR_CODE_SIZE,
    lineHeight: 1.6,
    fontWeight: theme.fontWeights.medium,
    marginTop: theme.spacing(4),
    wordBreak: 'break-word',
    textAlign: 'center'
  },
  qrScannerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  qrScannerButton: {
    display: 'flex',
    padding: theme.spacing(2),
    background: theme.palette.primary.dark,
    borderRadius: 50,
    cursor: 'pointer',
    outline: 'none',
    border: 0,
    marginTop: theme.spacing(6),
    '&:disabled': {
      cursor: 'default'
    }
  },
  qrScannerLabel: {
    fontWeight: theme.fontWeights.bold,
    marginTop: theme.spacing(1)
  }
}))

export default useMyCodeStyles

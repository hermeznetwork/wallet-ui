import React from 'react'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import QRCode from 'qrcode.react'
import { push } from 'connected-react-router'
import { useLocation } from 'react-router-dom'

import useMyCodeStyles from './my-code.styles'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'
import { MY_CODE } from '../../constants'
import { ReactComponent as QRScannerIcon } from '../../images/icons/qr-scanner.svg'
import QRScanner from '../shared/qr-scanner/qr-scanner.view'
import { isAnyVideoDeviceAvailable } from '../../utils/browser'

function MyCode ({ metaMaskWalletTask, onChangeHeader, onNavigateToTransfer }) {
  const theme = useTheme()
  const classes = useMyCodeStyles()
  const { search } = useLocation()
  const urlSearchParams = new URLSearchParams(search)
  const from = urlSearchParams.get('from')
  const [isVideoDeviceAvailable, setisVideoDeviceAvailable] = React.useState(false)
  const [isQRScannerOpen, setIsQRScannerOpen] = React.useState(false)

  React.useEffect(() => {
    onChangeHeader(from)
  }, [from, onChangeHeader])

  React.useEffect(() => {
    isAnyVideoDeviceAvailable()
      .then(setisVideoDeviceAvailable)
      .catch(() => setisVideoDeviceAvailable(false))
  }, [])

  /**
   * Sets the local state variable isQRScannerOpen to true when the user requests to open
   * the QR Scanner
   * @returns {void}
   */
  function handleOpenQRScanner () {
    setIsQRScannerOpen(true)
  }

  /**
   * Sets the local state variable isQRScannerOpen to false when the user requests to
   * close the QR Scanner
   * @returns {void}
   */
  function handleCloseQRScanner () {
    setIsQRScannerOpen(false)
  }

  /**
   * Sets the local state variable isQRScannerOpen to false and navigates to the transfer
   * view
   * @param {string} hermezEthereumAddress - Hermez Ethereum address scanned
   * @returns {void}
   */
  function handleQRScanningSuccess (hermezEthereumAddress) {
    setIsQRScannerOpen(false)
    onNavigateToTransfer(hermezEthereumAddress)
  }

  return (
    <Container backgroundColor={theme.palette.primary.main} addHeaderPadding fullHeight>
      <div className={classes.root}>
        {metaMaskWalletTask.status === 'successful' && (
          <>
            <QRCode
              value={metaMaskWalletTask.data.hermezEthereumAddress}
              size={MY_CODE.QR_CODE_SIZE}
              bgColor='transparent'
              fgColor={theme.palette.black}
              className={classes.qrCode}
            />
            <p className={classes.address}>
              {metaMaskWalletTask.data.hermezEthereumAddress}
            </p>
          </>
        )}
        <div className={classes.qrScannerWrapper}>
          <button
            disabled={!isVideoDeviceAvailable}
            className={classes.qrScannerButton}
            onClick={handleOpenQRScanner}
          >
            <QRScannerIcon />
          </button>
          <p className={classes.qrScannerLabel}>Scan</p>
        </div>
      </div>
      {isVideoDeviceAvailable && isQRScannerOpen && (
        <QRScanner
          onSuccess={handleQRScanningSuccess}
          onClose={handleCloseQRScanner}
        />
      )}
    </Container>
  )
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.global.metaMaskWalletTask
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: (from) =>
    dispatch(changeHeader({
      type: 'page',
      data: {
        title: 'My code',
        goBackAction:
          from === 'my-account'
            ? push('/my-account')
            : push('/')
      }
    })),
  onNavigateToTransfer: (hermezEthereumAddress) =>
    dispatch(push(`/transfer?receiver=${hermezEthereumAddress}`))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(MyCode))

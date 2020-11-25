import React from 'react'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import QRCode from 'qrcode.react'
import { push } from 'connected-react-router'

import useMyAddressStyles from './my-address.styles'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'
import { MY_ADDRESS } from '../../constants'
import { ReactComponent as QRScannerIcon } from '../../images/icons/qr-scanner.svg'
import QRScanner from '../shared/qr-scanner/qr-scanner.view'
import { isAnyVideoDeviceAvailable } from '../../utils/browser'

function MyAddress ({ metaMaskWalletTask, onChangeHeader, onQRScanned }) {
  const theme = useTheme()
  const classes = useMyAddressStyles()
  const [isVideoDeviceAvailable, setisVideoDeviceAvailable] = React.useState(false)
  const [isQRScannerOpen, setIsQRScannerOpen] = React.useState(false)

  React.useEffect(() => {
    onChangeHeader()
  }, [onChangeHeader])

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
   * Sets the local state variable isQRScannerOpen to false and bubbles up the read value
   * @param {string} hermezEthereumAddress - Hermez Ethereum address scanned
   * @returns {void}
   */
  function handleQRScanningSuccess (hermezEthereumAddress) {
    setIsQRScannerOpen(false)
    onQRScanned(hermezEthereumAddress)
  }

  return (
    <Container backgroundColor={theme.palette.primary.main} addHeaderPadding fullHeight>
      <div className={classes.root}>
        {metaMaskWalletTask.status === 'successful' && (
          <>
            <QRCode
              value={metaMaskWalletTask.data.hermezEthereumAddress}
              size={MY_ADDRESS.QR_CODE_SIZE}
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
  onChangeHeader: (backgroundColor) =>
    dispatch(changeHeader({
      type: 'page',
      data: {
        title: 'My address',
        goBackAction: push('/')
      }
    })),
  onQRScanned: (hermezEthereumAddress) =>
    dispatch(push(`/transfer?receiver=${hermezEthereumAddress}`))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(MyAddress))

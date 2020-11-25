import React from 'react'
import QrReader from 'react-qr-reader'
import { useTheme } from 'react-jss'
import { Addresses } from 'hermezjs'

import useQRScannerStyles from './qr-scanner.styles'
import Portal from '../portal/portal.view'
import Container from '../container/container.view'
import { ReactComponent as QRScannerMask } from '../../../images/qr-scanner-mask.svg'
import { ReactComponent as ArrowBackIcon } from '../../../images/icons/arrow-back.svg'
import { ReactComponent as QRCodeIcon } from '../../../images/icons/qr-code.svg'
import Spinner from '../spinner/spinner.view'

function QRScanner ({ onSuccess, onError, onClose }) {
  const theme = useTheme()
  const classes = useQRScannerStyles()
  const [isQRScannerLoaded, setIsQRScannerLoaded] = React.useState(false)

  /**
   * Handles the onLoad event from the QrReader component. It sets the isQRScannerLoaded
   * to true when the QR Scanner has being loaded on the DOM
   * @returns {void}
   */
  function handleQRScanLoad () {
    setIsQRScannerLoaded(true)
  }

  /**
   * Handles the onScan event from the QrReader component. If the result is a valid
   * hermez address it bubbles up the read value to the parent component
   * @returns {void}
   */
  function handleQRScan (result) {
    if (result && Addresses.isHermezEthereumAddress(result)) {
      onSuccess(result)
    }
  }

  /**
   * Handles the onError event from the QrReader component. Logs the error to the console
   * @returns {void}
   */
  function handleQRScanError (error) {
    console.log(error)
  }

  return (
    <Portal>
      <div className={classes.section}>
        <Container disableGutters backgroundColor={theme.palette.primary.main}>
          <div className={classes.sectionContent}>
            {!isQRScannerLoaded && <div className={classes.spinnerWrapper}><Spinner /></div>}
            <QrReader
              showViewFinder={false}
              className={classes.qrReaderWrapper}
              onLoad={handleQRScanLoad}
              onScan={handleQRScan}
              onError={handleQRScanError}
            />
            {isQRScannerLoaded && (
              <>
                <div className={classes.qrReaderFrame}>
                  <QRScannerMask className={classes.qrScannerMask} />
                </div>
                <div className={classes.goBackButtonWrapper}>
                  <Container disableVerticalGutters>
                    <button
                      className={classes.goBackButton}
                      onClick={onClose}
                    >
                      <ArrowBackIcon className={classes.goBackButtonIcon} />
                    </button>
                  </Container>
                </div>
                <div className={classes.myCodeButtonWrapper}>
                  <button
                    className={classes.myCodeButton}
                    onClick={onClose}
                  >
                    <QRCodeIcon />
                  </button>
                  <p className={classes.myCodeLabel}>My code</p>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>
    </Portal>
  )
}

export default QRScanner

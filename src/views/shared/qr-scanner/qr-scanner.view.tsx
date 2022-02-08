import React from "react";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { useTheme } from "react-jss";
import { Addresses } from "@hermeznetwork/hermezjs";

import useQRScannerStyles from "./qr-scanner.styles";
import Portal from "../portal/portal.view";
import Container from "../container/container.view";
import { ReactComponent as QRScannerMask } from "../../../images/qr-scanner-mask.svg";
import { ReactComponent as ArrowBackIcon } from "../../../images/icons/arrow-back.svg";
import { ReactComponent as QRCodeIcon } from "../../../images/icons/qr-code.svg";
import Button from "../button/button.view";
import { Theme } from "src/styles/theme";

interface QRScannerProps {
  hideMyCode?: boolean;
  onSuccess: (address: string) => void;
  onClose: () => void;
}

function QRScanner({ hideMyCode, onSuccess, onClose }: QRScannerProps): JSX.Element {
  const theme = useTheme<Theme>();
  const classes = useQRScannerStyles();
  const [scanned, setScanned] = React.useState("");

  React.useEffect(() => {
    if (Addresses.isHermezEthereumAddress(scanned) || Addresses.isEthereumAddress(scanned)) {
      onSuccess(scanned);
      setScanned("");
    }
  }, [scanned, onSuccess]);

  /**
   * Handles the onError event from the QrReader component. Logs the error to the console
   */
  function handleQRScanError(error: unknown) {
    console.error(error);
  }

  const NO_QR_CODE_FOUND_ERROR = "NotFoundException";
  const CHECKSUM_EXCEPTION_ERROR = "ChecksumException";

  return (
    <Portal>
      <div className={classes.section}>
        <Container disableGutters backgroundColor={theme.palette.primary.main}>
          <div className={classes.sectionContent}>
            <QrReader
              className={classes.qrReaderWrapper}
              onResult={(result, error) => {
                if (result) {
                  setScanned(result.getText());
                }
                if (
                  error &&
                  error.name !== NO_QR_CODE_FOUND_ERROR &&
                  error.name !== CHECKSUM_EXCEPTION_ERROR
                ) {
                  handleQRScanError(error);
                }
              }}
              // We have to pass in the default value because the prop is not optional ¯\_(ツ)_/¯
              constraints={{ facingMode: "user" }}
            />
            <div className={classes.qrReaderFrame}>
              <QRScannerMask className={classes.qrScannerMask} />
            </div>
            <div className={classes.goBackButtonWrapper}>
              <Container disableVerticalGutters>
                <button className={classes.goBackButton} onClick={onClose}>
                  <ArrowBackIcon className={classes.goBackButtonIcon} />
                </button>
              </Container>
            </div>
            <div className={classes.myCodeButtonWrapper}>
              {!hideMyCode && (
                <>
                  <Button Icon={<QRCodeIcon />} onClick={onClose} />
                  <p className={classes.myCodeLabel}>My Code</p>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>
    </Portal>
  );
}

export default QRScanner;

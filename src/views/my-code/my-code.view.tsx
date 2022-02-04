import React from "react";
import { connect } from "react-redux";
import { useTheme } from "react-jss";
import QRCode from "qrcode.react";
import { push } from "@lagunovsky/redux-react-router";
import { useLocation } from "react-router-dom";
import { HermezWallet } from "@hermeznetwork/hermezjs";

import useMyCodeStyles from "src/views/my-code/my-code.styles";
import Container from "src/views/shared/container/container.view";
import { changeHeader } from "src/store/global/global.actions";
import { MY_CODE } from "src/constants";
import { ReactComponent as QRScannerIcon } from "src/images/icons/qr-scanner.svg";
import QRScanner from "src/views/shared/qr-scanner/qr-scanner.view";
import { isAnyVideoDeviceAvailable } from "src/utils/browser";
import Button from "src/views/shared/button/button.view";
import { Theme } from "src/styles/theme";
import { AppDispatch, AppState } from "src/store";

interface MyCodeStateProps {
  wallet: HermezWallet.HermezWallet | undefined;
}

interface MyCodeHandlerProps {
  onChangeHeader: (from: string | null) => void;
  onNavigateToTransfer: (hermezEthereumAddress: string) => void;
}

type MyCodeProps = MyCodeStateProps & MyCodeHandlerProps;

function MyCode({ wallet, onChangeHeader, onNavigateToTransfer }: MyCodeProps): JSX.Element {
  const theme = useTheme<Theme>();
  const classes = useMyCodeStyles();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const from = urlSearchParams.get("from");
  const [isVideoDeviceAvailable, setIsVideoDeviceAvailable] = React.useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = React.useState(false);

  React.useEffect(() => {
    onChangeHeader(from);
  }, [from, onChangeHeader]);

  React.useEffect(() => {
    isAnyVideoDeviceAvailable()
      .then(setIsVideoDeviceAvailable)
      .catch(() => setIsVideoDeviceAvailable(false));
  }, []);

  /**
   * Sets the local state variable isQRScannerOpen to true when the user requests to open
   * the QR Scanner
   */
  function handleOpenQRScanner() {
    setIsQRScannerOpen(true);
  }

  /**
   * Sets the local state variable isQRScannerOpen to false when the user requests to
   * close the QR Scanner
   */
  function handleCloseQRScanner() {
    setIsQRScannerOpen(false);
  }

  /**
   * Sets the local state variable isQRScannerOpen to false and navigates to the transfer
   * view
   */
  function handleQRScanningSuccess(hermezEthereumAddress: string) {
    setIsQRScannerOpen(false);
    onNavigateToTransfer(hermezEthereumAddress);
  }

  return (
    <Container backgroundColor={theme.palette.primary.main} addHeaderPadding fullHeight>
      <>
        <div className={classes.root}>
          {wallet && (
            <>
              <QRCode
                value={wallet.hermezEthereumAddress}
                size={MY_CODE.QR_CODE_SIZE}
                bgColor="transparent"
                fgColor={theme.palette.black.main}
                className={classes.qrCode}
              />
              <p className={classes.address}>{wallet.hermezEthereumAddress}</p>
            </>
          )}
          <div className={classes.qrScannerWrapper}>
            <Button
              Icon={<QRScannerIcon />}
              disabled={!isVideoDeviceAvailable}
              onClick={handleOpenQRScanner}
            />
            <p className={classes.qrScannerLabel}>Scan</p>
          </div>
        </div>
        {isVideoDeviceAvailable && isQRScannerOpen && (
          <QRScanner onSuccess={handleQRScanningSuccess} onClose={handleCloseQRScanner} />
        )}
      </>
    </Container>
  );
}

const mapStateToProps = (state: AppState): MyCodeStateProps => ({
  wallet: state.global.wallet,
});

const mapDispatchToProps = (dispatch: AppDispatch): MyCodeHandlerProps => ({
  onChangeHeader: (from) =>
    dispatch(
      changeHeader({
        type: "page",
        data: {
          title: "Polygon Hermez Internal Address",
          subtitle: "Read this code from another Polygon Hermez account",
          goBackAction: from === "my-account" ? push("/my-account") : push("/"),
        },
      })
    ),
  onNavigateToTransfer: (hermezEthereumAddress) =>
    dispatch(push(`/transfer?receiver=${hermezEthereumAddress}`)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyCode);

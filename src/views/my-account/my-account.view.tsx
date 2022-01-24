import React from "react";
import { connect } from "react-redux";
import { useTheme } from "react-jss";
import { push } from "connected-react-router";
import hermezjs from "@hermeznetwork/hermezjs";

import useMyAccountStyles from "src/views/my-account/my-account.styles";
import { changeHeader, openSnackbar } from "src/store/global/global.actions";
import { changePreferredCurrency } from "src/store/my-account/my-account.thunks";
import { disconnectWallet } from "src/store/global/global.thunks";
import Container from "src/views/shared/container/container.view";
import { ReactComponent as ExchangeIcon } from "src/images/icons/exchange.svg";
import { ReactComponent as ExitIcon } from "src/images/icons/exit.svg";
import { ReactComponent as OpenInNewTabIcon } from "src/images/icons/open-in-new-tab.svg";
import { ReactComponent as PowerOffIcon } from "src/images/icons/power-off.svg";
import { CurrencySymbol } from "src/utils/currencies";
import PreferredCurrencySelector from "src/views/my-account/components/preferred-currency-selector/preferred-currency-selector.view";
import { getPartiallyHiddenHermezAddress } from "src/utils/addresses";
import { ReactComponent as CopyIcon } from "src/images/icons/copy.svg";
import Button from "src/views/shared/button/button.view";
import { copyToClipboard } from "src/utils/browser";
import { ReactComponent as QRCodeIcon } from "src/images/icons/qr-code.svg";
import { version as packagejsonVersion } from "src/../package.json";
import { AppDispatch, AppState } from "src/store";
import { Theme } from "src/styles/theme";
//domain
import { HermezWallet, Message } from "src/domain";

interface MyAccountStateProps {
  wallet: HermezWallet.HermezWallet | undefined;
  preferredCurrency: string;
}

interface MyAccountHandlerProps {
  onChangeHeader: () => void;
  onChangePreferredCurrency: (selectedTokenId: string) => void;
  onDisconnectWallet: () => void;
  onOpenSnackbar: (message: Message) => void;
  onNavigateToForceExit: () => void;
  onNavigateToMyCode: () => void;
}

type MyAccountProps = MyAccountStateProps & MyAccountHandlerProps;

function MyAccount({
  wallet,
  preferredCurrency,
  onChangeHeader,
  onChangePreferredCurrency,
  onDisconnectWallet,
  onOpenSnackbar,
  onNavigateToForceExit,
  onNavigateToMyCode,
}: MyAccountProps): JSX.Element {
  const theme = useTheme<Theme>();
  const classes = useMyAccountStyles();

  React.useEffect(() => {
    onChangeHeader();
  }, [onChangeHeader]);

  /**
   * Copies the Hermez Ethereum address to the clipboard when it's clicked
   */
  function handleEthereumAddressClick(hermezEthereumAddress: string) {
    copyToClipboard(hermezEthereumAddress);
    onOpenSnackbar({
      type: "info-msg",
      text: "The Polygon Hermez address has been copied to the clipboard!",
    });
  }

  /**
   * Disconnects the currently connected Ethereum wallet when the disconnect wallet button
   * is clicked
   */
  function handleOnDisconnectWallet() {
    onDisconnectWallet();
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter addHeaderPadding>
        <section className={classes.topSection}>
          {wallet && (
            <>
              <h1 className={classes.hermezEthereumAddress}>
                {getPartiallyHiddenHermezAddress(wallet.hermezEthereumAddress)}
              </h1>
              <div className={classes.buttonsWrapper}>
                <Button
                  text="Show QR"
                  className={classes.qrButton}
                  Icon={<QRCodeIcon className={classes.qrIcon} />}
                  onClick={onNavigateToMyCode}
                />
                <Button
                  text="Copy"
                  Icon={<CopyIcon />}
                  onClick={() => handleEthereumAddressClick(wallet.hermezEthereumAddress)}
                />
              </div>
            </>
          )}
        </section>
      </Container>
      <Container>
        <section className={classes.bottomSection}>
          <div>
            <div className={classes.settingContainer}>
              <div className={classes.settingHeader}>
                <ExchangeIcon />
                <p className={classes.settingTitle}>Currency conversion</p>
              </div>
              <div className={classes.settingContent}>
                <PreferredCurrencySelector
                  preferredCurrency={preferredCurrency}
                  currencies={Object.values(CurrencySymbol)}
                  onChange={onChangePreferredCurrency}
                />
              </div>
            </div>
            <div className={classes.settingContainer}>
              <div className={classes.settingHeader} onClick={onNavigateToForceExit}>
                <ExitIcon />
                <p className={classes.settingTitle}>Force withdraw</p>
                <p className={classes.settingSubTitle}>
                  Forces the coordinator to process the transaction (more Gas is required).
                </p>
              </div>
            </div>
            {wallet && (
              <a
                className={classes.settingContainer}
                href={`${hermezjs.Environment.getBatchExplorerUrl()}/user-account/${
                  wallet.hermezEthereumAddress
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={classes.settingHeader}>
                  <OpenInNewTabIcon />
                  <p className={classes.settingTitle}>View in batch explorer</p>
                </div>
              </a>
            )}
            <button className={classes.settingContainer} onClick={handleOnDisconnectWallet}>
              <div className={classes.settingHeader}>
                <PowerOffIcon />
                <p className={classes.settingTitle}>Disconnect wallet</p>
              </div>
            </button>
          </div>
        </section>
      </Container>
    </div>
  );
}

const mapStateToProps = (state: AppState): MyAccountStateProps => ({
  wallet: state.global.wallet,
  preferredCurrency: state.myAccount.preferredCurrency,
});

const mapDispatchToProps = (dispatch: AppDispatch): MyAccountHandlerProps => ({
  onChangeHeader: () =>
    dispatch(
      changeHeader({
        type: "page",
        data: {
          title: "My Account",
          subtitle: `version ${packagejsonVersion}`,
          goBackAction: push("/"),
        },
      })
    ),
  onNavigateToMyCode: () => dispatch(push("/my-code?from=my-account")),
  onChangePreferredCurrency: (selectedTokenId) =>
    dispatch(changePreferredCurrency(selectedTokenId)),
  onDisconnectWallet: () => dispatch(disconnectWallet()),
  onOpenSnackbar: (message) => dispatch(openSnackbar(message)),
  onNavigateToForceExit: () => dispatch(push("/force-withdraw")),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);

import React from "react";

import useWalletButtonStyles from "src/views/login/components/wallet-button/wallet-button.styles";
import WalletButtonLogo from "src/views/login/components/wallet-button-logo/wallet-button-logo.view";
import * as loginActions from "src/store/login/login.actions";

interface WalletButtonProps {
  walletName: loginActions.WalletName;
  hideName?: boolean;
  onClick?: () => void;
}

function WalletButton({ walletName, hideName = false, onClick }: WalletButtonProps): JSX.Element {
  const classes = useWalletButtonStyles();
  const isClickable = onClick !== undefined;
  const Component = isClickable ? "button" : "div";

  function getButtonLabel(walletName: string) {
    return walletName[0].toUpperCase() + walletName.slice(1);
  }

  return (
    <div className={classes.root}>
      {
        <Component
          className={isClickable ? classes.walletButtonContainer : classes.walletDivContainer}
          onClick={onClick}
        >
          <WalletButtonLogo walletName={walletName} />
        </Component>
      }
      {!hideName && <p className={classes.walletName}>{getButtonLabel(walletName)}</p>}
    </div>
  );
}

export default WalletButton;

import React from "react";

import useWalletButtonStyles from "src/views/login/components/wallet-button-logo/wallet-button-logo.styles";
import { ReactComponent as MetaMaskLogo } from "src/images/wallet-logos/metamask.svg";
import { ReactComponent as WalletConnectLogo } from "src/images/wallet-logos/walletconnect.svg";
import * as loginActions from "src/store/login/login.actions";

interface WalletButtonLogoProps {
  walletName: loginActions.WalletName;
}

function WalletButtonLogo({ walletName }: WalletButtonLogoProps): JSX.Element {
  const classes = useWalletButtonStyles();

  switch (walletName) {
    case loginActions.WalletName.METAMASK: {
      return <MetaMaskLogo className={classes.root} />;
    }
    case loginActions.WalletName.WALLET_CONNECT: {
      return <WalletConnectLogo className={classes.root} />;
    }
  }
}

export default WalletButtonLogo;

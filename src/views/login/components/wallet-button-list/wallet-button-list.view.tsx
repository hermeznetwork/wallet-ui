import React from "react";

import useWalletButtonListStyles from "src/views/login/components/wallet-button-list/wallet-button-list.styles";
import WalletButton from "src/views/login/components/wallet-button/wallet-button.view";
import { WalletName } from "src/store/login/login.actions";

declare const window: Window & typeof globalThis & { ethereum?: unknown };

interface WalletButtonListProps {
  onClick: (walletName: WalletName) => void;
}

function WalletButtonList({ onClick }: WalletButtonListProps): JSX.Element {
  const classes = useWalletButtonListStyles();

  return (
    <div className={classes.root}>
      {window.ethereum && (
        <div className={classes.walletButtonContainer}>
          <WalletButton
            walletName={WalletName.METAMASK}
            onClick={() => onClick(WalletName.METAMASK)}
          />
        </div>
      )}
      <div className={classes.walletButtonContainer}>
        <WalletButton
          walletName={WalletName.WALLET_CONNECT}
          onClick={() => onClick(WalletName.WALLET_CONNECT)}
        />
      </div>
    </div>
  );
}

export default WalletButtonList;

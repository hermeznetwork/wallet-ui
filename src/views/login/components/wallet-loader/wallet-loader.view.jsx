import React from "react";
import WalletButton from "../wallet-button/wallet-button.view";

import useWalletLoaderStyles from "./wallet-loader.styles";

function WalletLoader({ walletName, accountData, walletTask, onLoadWallet }) {
  const classes = useWalletLoaderStyles();

  React.useEffect(() => {
    if (walletTask.status === "pending") {
      onLoadWallet(walletName, accountData);
    }
  }, [walletName, accountData, walletTask, onLoadWallet]);

  return (
    <div>
      <WalletButton walletName={walletName} hideName isClickable={false} />
      <p className={classes.followInstructionsText}>Sign to confirm in your connected wallet.</p>
    </div>
  );
}

export default WalletLoader;

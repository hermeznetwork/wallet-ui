import React from "react";
import WalletButton from "src/views/login/components/wallet-button/wallet-button.view";

import useWalletLoaderStyles from "src/views/login/components/wallet-loader/wallet-loader.styles";
import * as loginActions from "src/store/login/login.actions";
import { AsyncTask } from "src/utils/types";
// domain
import { HermezWallet } from "src/domain";

interface WalletLoaderProps {
  walletName: loginActions.WalletName;
  walletTask: AsyncTask<HermezWallet.HermezWallet, string>;
  onLoadWallet: (walletName: loginActions.WalletName) => void;
}

function WalletLoader({ walletName, walletTask, onLoadWallet }: WalletLoaderProps): JSX.Element {
  const classes = useWalletLoaderStyles();

  React.useEffect(() => {
    if (walletTask.status === "pending") {
      onLoadWallet(walletName);
    }
  }, [walletName, walletTask, onLoadWallet]);

  return (
    <div>
      <WalletButton walletName={walletName} hideName />
      <p className={classes.followInstructionsText}>Sign to confirm in your connected wallet.</p>
    </div>
  );
}

export default WalletLoader;

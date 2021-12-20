import React from "react";
import { connect } from "react-redux";

import { AppState, AppDispatch } from "src/store";
import * as globalActions from "src/store/global/global.actions";
import * as loginActions from "src/store/login/login.actions";
import * as loginThunks from "src/store/login/login.thunks";
import { Step } from "src/store/login/login.reducer";
import { AsyncTask, isAsyncTaskDataAvailable } from "src/utils/types";
import WalletButtonList from "src/views/login/components/wallet-button-list/wallet-button-list.view";
import WalletLoader from "src/views/login/components/wallet-loader/wallet-loader.view";
import CreateAccountAuth from "src/views/login/components/create-account-auth/create-account-auth.view";
import useLoginStyles from "src/views/login/login.styles";
// domain
import { Header } from "src/domain/";
import { HermezWallet } from "src/domain/hermez";
import { EthereumNetwork } from "src/domain/ethereum";
import { AuthSignatures } from "src/domain/local-storage";

interface LoginStateProps {
  ethereumNetworkTask: AsyncTask<EthereumNetwork, string>;
  step: Step;
  accountAuthSignatures: AuthSignatures;
}

interface LoginHandlerProps {
  onChangeHeader: (step: Step) => void;
  onGoToWalletLoaderStep: (walletName: loginActions.WalletName) => void;
  onLoadWallet: (walletName: loginActions.WalletName) => void;
  onCreateAccountAuthorization: (wallet: HermezWallet.HermezWallet) => void;
  onCleanup: () => void;
}

type LoginProps = LoginStateProps & LoginHandlerProps;

function Login({
  onChangeHeader,
  ethereumNetworkTask,
  step,
  accountAuthSignatures,
  onGoToWalletLoaderStep,
  onLoadWallet,
  onCreateAccountAuthorization,
  onCleanup,
}: LoginProps): JSX.Element {
  const classes = useLoginStyles();

  React.useEffect(() => {
    onChangeHeader(step);
  }, [step, onChangeHeader]);

  React.useEffect(() => onCleanup, [onCleanup]);

  function capitalizeLabel(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  switch (step.type) {
    case "wallet-selector": {
      return (
        <>
          <h1 className={classes.connectText}>Connect with</h1>
          <WalletButtonList onClick={onGoToWalletLoaderStep} />
        </>
      );
    }
    case "wallet-loader": {
      const walletLabel = capitalizeLabel(step.walletName);

      return (
        <>
          <h1 className={classes.connectedText}>Connected to {walletLabel}</h1>
          <WalletLoader
            walletName={step.walletName}
            walletTask={step.walletTask}
            onLoadWallet={onLoadWallet}
          />
        </>
      );
    }
    case "create-account-auth": {
      const chainIdSignatures = isAsyncTaskDataAvailable(ethereumNetworkTask)
        ? accountAuthSignatures[ethereumNetworkTask.data.chainId] || {}
        : {};
      const hermezAddressAuthSignature =
        step.wallet && chainIdSignatures[step.wallet.hermezEthereumAddress];

      return (
        <CreateAccountAuth
          hermezAddressAuthSignature={hermezAddressAuthSignature}
          wallet={step.wallet}
          onCreateAccountAuthorization={onCreateAccountAuthorization}
        />
      );
    }
  }
}

const mapStateToProps = (state: AppState): LoginStateProps => ({
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  step: state.login.step,
  accountAuthSignatures: state.login.accountAuthSignatures,
});

const getHeader = (currentStep: Step): Header => {
  if (currentStep.type === "wallet-selector") {
    return { type: undefined };
  } else {
    return {
      type: "page",
      data: {
        title: "",
        closeAction: loginActions.goToWalletSelectorStep(),
      },
    };
  }
};

const mapDispatchToProps = (dispatch: AppDispatch): LoginHandlerProps => ({
  onChangeHeader: (currentStep) => dispatch(globalActions.changeHeader(getHeader(currentStep))),
  onGoToWalletLoaderStep: (walletName) => dispatch(loginActions.goToWalletLoaderStep(walletName)),
  onLoadWallet: (walletName) => dispatch(loginThunks.fetchWallet(walletName)),
  onCreateAccountAuthorization: (wallet) =>
    dispatch(loginThunks.postCreateAccountAuthorization(wallet)),
  onCleanup: () => dispatch(loginActions.resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

import React from "react";
import { connect } from "react-redux";

import useLoginStyles from "./login.styles";
import * as globalActions from "../../store/global/global.actions";
import * as loginActions from "../../store/login/login.actions";
import * as loginThunks from "../../store/login/login.thunks";
import { STEP_NAME } from "../../store/login/login.reducer";
import WalletButtonList from "./components/wallet-button-list/wallet-button-list.view";
import AccountSelectorForm from "./components/account-selector/account-selector-form.view";
import WalletLoader from "./components/wallet-loader/wallet-loader.view";
import CreateAccountAuth from "./components/create-account-auth/create-account-auth.view";
import Alert, { AlertVariant } from "../shared/alert/alert.view";
import * as constants from "../../constants";

// ToDo: Shouldn't we import this from the login actions?
export const WalletName = {
  METAMASK: "metaMask",
  WALLET_CONNECT: "walletConnect",
  LEDGER: "ledger",
  TREZOR: "trezor",
};

function Login({
  currentStep,
  onChangeHeader,
  ethereumNetworkTask,
  steps,
  accountAuthSignatures,
  onGoToAccountSelectorStep,
  onGoToWalletLoaderStep,
  onGoToPreviousStep,
  onLoadWallet,
  onCreateAccountAuthorization,
  onCleanup,
}) {
  const classes = useLoginStyles();
  const stepData = steps[currentStep];
  const MetaMaskAlert = (
    <div className={classes.updateMetaMaskAlert}>
      <Alert
        message="If you're unable to login with Metamask make sure you have the latest version."
        variant={AlertVariant.LIGHT}
        showHelpButton
        helpButtonLink={constants.METAMASK_UPDATE_HELP_LINK}
      />
    </div>
  );

  React.useEffect(() => {
    onChangeHeader(currentStep);
  }, [currentStep, onChangeHeader]);

  React.useEffect(() => onCleanup, [onCleanup]);

  /**
   * Handles the click on the MetaMask button
   * @returns {void}
   */
  function handleWalletClick(walletName) {
    switch (walletName) {
      case WalletName.METAMASK:
      case WalletName.WALLET_CONNECT: {
        return onGoToWalletLoaderStep(walletName);
      }
      case WalletName.LEDGER:
      case WalletName.TREZOR: {
        return onGoToAccountSelectorStep(walletName);
      }
    }
  }

  function capitalizeLabel(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function handleSelectAccount(walletName, accountData) {
    onGoToWalletLoaderStep(walletName, accountData);
  }

  switch (currentStep) {
    case STEP_NAME.WALLET_SELECTOR: {
      return (
        <>
          <h1 className={classes.connectText}>Connect with</h1>
          <WalletButtonList onClick={handleWalletClick} />
          {window.ethereum && MetaMaskAlert}
        </>
      );
    }
    case STEP_NAME.ACCOUNT_SELECTOR: {
      const walletLabel = capitalizeLabel(stepData.walletName);

      return (
        <>
          <h1 className={classes.addAccountText}>Add account through {walletLabel}</h1>
          <AccountSelectorForm
            walletName={stepData.walletName}
            walletLabel={walletLabel}
            onSelectAccount={handleSelectAccount}
          />
        </>
      );
    }
    case STEP_NAME.WALLET_LOADER: {
      const walletLabel = capitalizeLabel(stepData.walletName);

      return (
        <>
          <h1 className={classes.connectedText}>Connected to {walletLabel}</h1>
          <WalletLoader
            walletName={stepData.walletName}
            accountData={stepData.accountData}
            walletTask={stepData.walletTask}
            onLoadWallet={onLoadWallet}
          />
          {stepData.walletName === WalletName.METAMASK && MetaMaskAlert}
        </>
      );
    }
    case STEP_NAME.CREATE_ACCOUNT_AUTH: {
      const chainIdSignatures = accountAuthSignatures[ethereumNetworkTask.data.chainId] || {};
      const hermezAddressAuthSignature = chainIdSignatures[stepData.wallet.hermezEthereumAddress];

      return (
        <CreateAccountAuth
          hermezAddressAuthSignature={hermezAddressAuthSignature}
          steps={steps}
          onCreateAccountAuthorization={onCreateAccountAuthorization}
        />
      );
    }
    default: {
      return <></>;
    }
  }
}

const mapStateToProps = (state) => ({
  currentStep: state.login.currentStep,
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  steps: state.login.steps,
  accountAuthSignatures: state.login.accountAuthSignatures,
});

const getHeader = (currentStep) => {
  if (currentStep === STEP_NAME.WALLET_SELECTOR) {
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

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: (currentStep) => dispatch(globalActions.changeHeader(getHeader(currentStep))),
  onGoToAccountSelectorStep: (walletName) =>
    dispatch(loginActions.goToAccountSelectorStep(walletName)),
  onGoToWalletLoaderStep: (walletName, accountData) =>
    dispatch(loginActions.goToWalletLoaderStep(walletName, accountData)),
  onGoToPreviousStep: () => dispatch(loginActions.goToPreviousStep()),
  onLoadWallet: (walletName, accountData) =>
    dispatch(loginThunks.fetchWallet(walletName, accountData)),
  onCreateAccountAuthorization: (wallet) =>
    dispatch(loginThunks.postCreateAccountAuthorization(wallet)),
  onCleanup: () => dispatch(loginActions.resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

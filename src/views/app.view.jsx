import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useTheme } from "react-jss";

import useAppStyles from "./app.styles";
import routes from "../routing/routes";
import * as globalActions from "../store/global/global.actions";
import * as globalThunks from "../store/global/global.thunks";
import Spinner from "./shared/spinner/spinner.view";
import { COORDINATOR_STATE_REFRESH_RATE, RETRY_POOL_TXS_RATE } from "../constants";
import Route from "./shared/route/route.view";
import BaseLayout from "./shared/base-layout/base-layout.view";
import { closeSnackbar } from "../store/global/global.actions";
import UnderMaintenanceError from "./shared/under-maintenance-error/under-maintenance-error.view";

function App({
  wallet,
  header,
  snackbar,
  rewards,
  preferredCurrency,
  fiatExchangeRatesTask,
  hermezStatusTask,
  ethereumNetworkTask,
  coordinatorStateTask,
  onChangeRedirectRoute,
  onGoBack,
  onClose,
  onCloseSnackbar,
  onLoadEarnedReward,
  onLoadRewardPercentage,
  onLoadRewardAccountEligibility,
  onLoadToken,
  onCloseRewardsSidenav,
  onLoadCoordinatorState,
  onLoadFiatExchangeRates,
  onCheckHermezStatus,
  onLoadReward,
  onChangeNetworkStatus,
  onDisconnectAccount,
  onCheckPendingTransactions,
  onReloadApp,
  onLoadTokensPrice,
}) {
  const theme = useTheme();
  const classes = useAppStyles();

  React.useEffect(() => {
    onCheckHermezStatus();
    onLoadFiatExchangeRates();
  }, [onCheckHermezStatus]);

  React.useEffect(() => {
    let intervalId;

    if (ethereumNetworkTask.status === "successful") {
      intervalId = setInterval(onLoadCoordinatorState, COORDINATOR_STATE_REFRESH_RATE);

      onLoadCoordinatorState();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [ethereumNetworkTask]);

  React.useEffect(() => {
    let intervalId;

    if (wallet && ethereumNetworkTask.status === "successful") {
      intervalId = setInterval(onCheckPendingTransactions, RETRY_POOL_TXS_RATE);
    }

    return () => {
      intervalId && clearInterval(intervalId);
    };
  }, [ethereumNetworkTask, onCheckPendingTransactions]);

  React.useEffect(() => {
    window.addEventListener("online", () => onChangeNetworkStatus("online", theme.palette.green));
  }, [theme, onChangeNetworkStatus]);

  React.useEffect(() => {
    window.addEventListener("offline", () => onChangeNetworkStatus("offline"));
  }, [theme, onChangeNetworkStatus]);

  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        onDisconnectAccount();
      });
      window.ethereum.on("chainChanged", () => {
        onReloadApp();
      });
    }
  }, [onDisconnectAccount, onReloadApp]);

  React.useEffect(() => {
    if (process.env.REACT_APP_ENABLE_AIRDROP === "true") {
      onLoadReward();
    }
  }, []);

  React.useEffect(() => {
    onLoadTokensPrice();
  }, []);

  if (hermezStatusTask.status === "successful" && hermezStatusTask.data.isUnderMaintenance) {
    return <UnderMaintenanceError />;
  }

  if (hermezStatusTask.status !== "successful" || fiatExchangeRatesTask.status !== "successful") {
    return (
      <div className={classes.root}>
        <Spinner size={theme.spacing(8)} />
      </div>
    );
  }

  return (
    <Switch>
      <BaseLayout
        header={header}
        snackbar={snackbar}
        rewards={rewards}
        preferredCurrency={preferredCurrency}
        onGoBack={onGoBack}
        onClose={onClose}
        onCloseSnackbar={onCloseSnackbar}
        onLoadEarnedReward={onLoadEarnedReward}
        onLoadRewardPercentage={onLoadRewardPercentage}
        onLoadRewardAccountEligibility={onLoadRewardAccountEligibility}
        onLoadToken={onLoadToken}
        onCloseRewardsSidenav={onCloseRewardsSidenav}
      >
        {Object.values(routes)
          .filter((route) => !route.isHidden)
          .map((route) => (
            <Route
              key={route.path}
              route={route}
              wallet={wallet}
              onChangeRedirectRoute={onChangeRedirectRoute}
            />
          ))}
        <Redirect to="/login" />
      </BaseLayout>
    </Switch>
  );
}

App.propTypes = {
  fiatExchangeRatesTask: PropTypes.object,
};

const mapStateToProps = (state) => ({
  wallet: state.global.wallet,
  header: state.global.header,
  snackbar: state.global.snackbar,
  rewards: state.global.rewards,
  preferredCurrency: state.global.preferredCurrency,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  hermezStatusTask: state.global.hermezStatusTask,
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  coordinatorStateTask: state.global.coordinatorStateTask,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeRedirectRoute: (redirectRoute) =>
    dispatch(globalThunks.changeRedirectRoute(redirectRoute)),
  onGoBack: (action) => dispatch(action),
  onClose: (action) => dispatch(action),
  onCloseSnackbar: () => dispatch(closeSnackbar()),
  onCheckHermezStatus: () => dispatch(globalThunks.checkHermezStatus()),
  onLoadCoordinatorState: () => dispatch(globalThunks.fetchCoordinatorState()),
  onLoadFiatExchangeRates: () => dispatch(globalThunks.fetchFiatExchangeRates()),
  onLoadReward: () => dispatch(globalThunks.fetchReward()),
  onLoadEarnedReward: () => dispatch(globalThunks.fetchEarnedReward()),
  onLoadRewardPercentage: () => dispatch(globalThunks.fetchRewardPercentage()),
  onLoadRewardAccountEligibility: () => dispatch(globalThunks.fetchRewardAccountEligibility()),
  onLoadToken: () => dispatch(globalThunks.fetchRewardToken()),
  onCloseRewardsSidenav: () => dispatch(globalActions.closeRewardsSidenav()),
  onCheckPendingTransactions: () => dispatch(globalThunks.checkPendingTransactions()),
  onChangeNetworkStatus: (networkStatus, backgroundColor) =>
    dispatch(globalThunks.changeNetworkStatus(networkStatus, backgroundColor)),
  onDisconnectAccount: () => dispatch(globalThunks.disconnectWallet()),
  onReloadApp: () => dispatch(globalThunks.reloadApp()),
  onLoadTokensPrice: () => dispatch(globalThunks.fetchTokensPrice()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { useTheme } from "react-jss";

import { AppDispatch, AppState, AppAction } from "src/store";
import * as globalThunks from "src/store/global/global.thunks";
import { closeSnackbar } from "src/store/global/global.actions";
import { SnackbarState, HeaderState } from "src/store/global/global.reducer";
import routes from "src/routing/routes";
import Spinner from "src/views/shared/spinner/spinner.view";
import Route from "src/views/shared/route/route.view";
import BaseLayout from "src/views/shared/base-layout/base-layout.view";
import UnderMaintenanceError from "src/views/shared/under-maintenance-error/under-maintenance-error.view";
import useAppStyles from "src/views/app.styles";
import { COORDINATOR_STATE_REFRESH_RATE, RETRY_POOL_TXS_RATE } from "src/constants";
import { AsyncTask } from "src/utils/types";
import { Theme } from "src/styles/theme";
//domain
import {
  FiatExchangeRates,
  HermezWallet,
  HermezNetworkStatus,
  HermezStatus,
} from "src/domain/hermez";
import { EthereumNetwork } from "src/domain/ethereum";

declare const window: WindowOverride;

interface AppStateProps {
  wallet: HermezWallet.HermezWallet | undefined;
  header: HeaderState;
  snackbar: SnackbarState;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
  hermezStatusTask: AsyncTask<HermezStatus, string>;
  ethereumNetworkTask: AsyncTask<EthereumNetwork, string>;
}

interface AppHandlerProps {
  onChangeRedirectRoute: (redirectRoute: string) => void;
  onGoBack: (action: AppAction) => void;
  onClose: (action: AppAction) => void;
  onCloseSnackbar: () => void;
  onLoadCoordinatorState: () => void;
  onLoadFiatExchangeRates: () => void;
  onCheckHermezStatus: () => void;
  onChangeNetworkStatus: (hermezNetworkStatus: HermezNetworkStatus, color: string) => void;
  onDisconnectAccount: () => void;
  onCheckPendingTransactions: () => void;
  onReloadApp: () => void;
  onLoadTokensPrice: () => void;
}

type AppProps = AppStateProps & AppHandlerProps;

function App({
  wallet,
  header,
  snackbar,
  fiatExchangeRatesTask,
  hermezStatusTask,
  ethereumNetworkTask,
  onChangeRedirectRoute,
  onGoBack,
  onClose,
  onCloseSnackbar,
  onLoadCoordinatorState,
  onLoadFiatExchangeRates,
  onCheckHermezStatus,
  onChangeNetworkStatus,
  onDisconnectAccount,
  onCheckPendingTransactions,
  onReloadApp,
  onLoadTokensPrice,
}: AppProps): JSX.Element {
  const theme = useTheme<Theme>();
  const classes = useAppStyles();

  React.useEffect(() => {
    onCheckHermezStatus();
    onLoadFiatExchangeRates();
  }, [onCheckHermezStatus, onLoadFiatExchangeRates]);

  React.useEffect(() => {
    if (ethereumNetworkTask.status === "successful") {
      const intervalId = setInterval(onLoadCoordinatorState, COORDINATOR_STATE_REFRESH_RATE);
      onLoadCoordinatorState();
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [ethereumNetworkTask, onLoadCoordinatorState]);

  React.useEffect(() => {
    if (wallet && ethereumNetworkTask.status === "successful") {
      const intervalId = setInterval(onCheckPendingTransactions, RETRY_POOL_TXS_RATE);
      return () => {
        intervalId && clearInterval(intervalId);
      };
    }
  }, [wallet, ethereumNetworkTask, onCheckPendingTransactions]);

  React.useEffect(() => {
    window.addEventListener("online", () => onChangeNetworkStatus("online", theme.palette.green));
  }, [theme, onChangeNetworkStatus]);

  React.useEffect(() => {
    window.addEventListener("offline", () =>
      onChangeNetworkStatus("offline", theme.palette.red.main)
    );
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
    onLoadTokensPrice();
  }, [onLoadTokensPrice]);

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
        onGoBack={onGoBack}
        onClose={onClose}
        onCloseSnackbar={onCloseSnackbar}
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

const mapStateToProps = (state: AppState): AppStateProps => ({
  wallet: state.global.wallet,
  header: state.global.header,
  snackbar: state.global.snackbar,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  hermezStatusTask: state.global.hermezStatusTask,
  ethereumNetworkTask: state.global.ethereumNetworkTask,
});

const mapDispatchToProps = (dispatch: AppDispatch): AppHandlerProps => ({
  onChangeRedirectRoute: (redirectRoute: string) =>
    dispatch(globalThunks.changeRedirectRoute(redirectRoute)),
  onGoBack: (action: AppAction) => dispatch(action),
  onClose: (action: AppAction) => dispatch(action),
  onCloseSnackbar: () => dispatch(closeSnackbar()),
  onCheckHermezStatus: () => dispatch(globalThunks.checkHermezStatus()),
  onLoadCoordinatorState: () => dispatch(globalThunks.fetchCoordinatorState()),
  onLoadFiatExchangeRates: () => dispatch(globalThunks.fetchFiatExchangeRates()),
  onCheckPendingTransactions: () => dispatch(globalThunks.checkPendingTransactions()),
  onChangeNetworkStatus: (networkStatus, backgroundColor) =>
    dispatch(globalThunks.changeNetworkStatus(networkStatus, backgroundColor)),
  onDisconnectAccount: () => dispatch(globalThunks.disconnectWallet()),
  onReloadApp: () => dispatch(globalThunks.reloadApp()),
  onLoadTokensPrice: () => dispatch(globalThunks.fetchTokensPrice()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

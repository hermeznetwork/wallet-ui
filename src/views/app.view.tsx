import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { useTheme } from "react-jss";
import { HermezWallet } from "@hermeznetwork/hermezjs";

import { AppDispatch, AppState, AppAction } from "src/store";
import * as globalThunks from "src/store/global/global.thunks";
import { closeSnackbar } from "src/store/global/global.actions";
import { SnackbarState, HeaderState } from "src/store/global/global.reducer";
import PrivateRoute from "src/views/shared/private-route/private-route.view";
import PublicRoute from "src/views/shared/public-route/public-route.view";
import routes from "src/routing/routes";
import BaseLayout from "src/views/shared/base-layout/base-layout.view";
import useAppStyles from "src/views/app.styles";
import { COORDINATOR_STATE_REFRESH_RATE, RETRY_POOL_TXS_RATE } from "src/constants";
import { AsyncTask } from "src/utils/types";
import { Theme } from "src/styles/theme";
//domain
import { EthereumNetwork, Env, FiatExchangeRates, NetworkStatus, HermezStatus } from "src/domain";

interface AppStateProps {
  env: Env | undefined;
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
  onReportFromSnackbar: (error: string) => void;
  onLoadCoordinatorState: () => void;
  onLoadFiatExchangeRates: (env: Env) => void;
  onCheckHermezStatus: () => void;
  onLoadEnv: () => void;
  onChangeNetworkStatus: (networkStatus: NetworkStatus) => void;
  onDisconnectAccount: () => void;
  onCheckPendingTransactions: () => void;
  onReloadApp: () => void;
  onLoadTokensPrice: () => void;
}

type AppProps = AppStateProps & AppHandlerProps;

function App({
  env,
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
  onReportFromSnackbar,
  onLoadCoordinatorState,
  onLoadFiatExchangeRates,
  onCheckHermezStatus,
  onLoadEnv,
  onChangeNetworkStatus,
  onDisconnectAccount,
  onCheckPendingTransactions,
  onReloadApp,
  onLoadTokensPrice,
}: AppProps): JSX.Element {
  const theme = useTheme<Theme>();
  useAppStyles();

  React.useEffect(() => {
    onLoadEnv();
  }, [onLoadEnv]);

  React.useEffect(() => {
    if (env) {
      onCheckHermezStatus();
      onLoadFiatExchangeRates(env);
    }
  }, [env, onCheckHermezStatus, onLoadFiatExchangeRates]);

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
    window.addEventListener("online", () => onChangeNetworkStatus("online"));
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
    onLoadTokensPrice();
  }, [onLoadTokensPrice]);

  return (
    <BaseLayout
      header={header}
      snackbar={snackbar}
      fiatExchangeRatesTask={fiatExchangeRatesTask}
      hermezStatusTask={hermezStatusTask}
      onGoBack={onGoBack}
      onClose={onClose}
      onCloseSnackbar={onCloseSnackbar}
      onReportFromSnackbar={onReportFromSnackbar}
    >
      <Routes>
        {Object.values(routes)
          .filter((route) => !route.isHidden)
          .map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.isPublic ? (
                  <PublicRoute route={route} />
                ) : (
                  <PrivateRoute
                    isUserLoggedIn={wallet !== undefined}
                    route={route}
                    onChangeRedirectRoute={onChangeRedirectRoute}
                  />
                )
              }
            />
          ))}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BaseLayout>
  );
}

const mapStateToProps = (state: AppState): AppStateProps => ({
  env: state.global.env,
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
  onReportFromSnackbar: (error: string) => dispatch(globalThunks.reportError(error)),
  onClose: (action: AppAction) => dispatch(action),
  onCloseSnackbar: () => dispatch(closeSnackbar()),
  onLoadEnv: () => dispatch(globalThunks.loadEnv()),
  onCheckHermezStatus: () => dispatch(globalThunks.checkHermezStatus()),
  onLoadCoordinatorState: () => dispatch(globalThunks.fetchCoordinatorState()),
  onLoadFiatExchangeRates: (env: Env) => dispatch(globalThunks.fetchFiatExchangeRates(env)),
  onCheckPendingTransactions: () => dispatch(globalThunks.checkPendingTransactions()),
  onChangeNetworkStatus: (networkStatus) =>
    dispatch(globalThunks.changeNetworkStatus(networkStatus)),
  onDisconnectAccount: () => dispatch(globalThunks.disconnectWallet()),
  onReloadApp: () => dispatch(globalThunks.reloadApp()),
  onLoadTokensPrice: () => dispatch(globalThunks.fetchTokensPrice()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

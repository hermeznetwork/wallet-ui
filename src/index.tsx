import React from "react";
import ReactDOM from "react-dom";
import { Action } from "redux";
import { Provider } from "react-redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { ThemeProvider } from "react-jss";
import { createBrowserHistory } from "history";
import { ConnectedRouter } from "connected-react-router";
import "normalize.css/normalize.css";

import * as serviceWorkerRegistration from "src/serviceWorkerRegistration";
import { configureStore, RootState, AppAction } from "src/store";
import * as storage from "src/utils/storage";
import theme from "src/styles/theme";
import App from "src/views/app.view";

storage.checkVersion();

const history = createBrowserHistory<RootState>();
const store = configureStore(history);

export type AppDispatch = ThunkDispatch<RootState, undefined, AppAction>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("app-root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

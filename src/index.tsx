import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "react-jss";
import { createBrowserHistory } from "history";
import { ConnectedRouter } from "connected-react-router";
import "normalize.css/normalize.css";

import * as serviceWorkerRegistration from "src/serviceWorkerRegistration";
import { configureStore, AppState } from "src/store";
import * as storage from "src/utils/storage";
import theme from "src/styles/theme";
import App from "src/views/app.view";

storage.checkVersion();

const history = createBrowserHistory<AppState>();
const store = configureStore(history);

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

serviceWorkerRegistration.register();

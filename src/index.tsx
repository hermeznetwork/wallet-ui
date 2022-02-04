import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "react-jss";
import { createBrowserHistory } from "history";
import { ReduxRouter } from "@lagunovsky/redux-react-router";
import "normalize.css/normalize.css";

import * as serviceWorkerRegistration from "src/serviceWorkerRegistration";
import { configureStore } from "src/store";
import * as storage from "src/utils/storage";
import theme from "src/styles/theme";
import App from "src/views/app.view";

storage.checkVersion();

const history = createBrowserHistory();
const store = configureStore(history);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ReduxRouter history={history} store={store}>
          <App />
        </ReduxRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("app-root")
);

serviceWorkerRegistration.register();

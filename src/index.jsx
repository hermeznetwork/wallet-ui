import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'react-jss'
import { createBrowserHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import 'normalize.css/normalize.css'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import configureStore from './store'
import * as storage from './utils/storage'
import theme from './styles/theme'
import App from './views/app.view'

storage.checkVersion()

const history = createBrowserHistory()
const store = configureStore(history)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app-root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()

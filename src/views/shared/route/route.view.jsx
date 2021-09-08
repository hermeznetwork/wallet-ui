import React from 'react'
import PrivateRoute from '../private-route/private-route.view'

import PublicRoute from '../public-route/public-route.view'

function Route ({ route, wallet, onChangeRedirectRoute }) {
  return route.isPublic
    ? <PublicRoute route={route} />
    : (
      <PrivateRoute
        isUserLoggedIn={wallet !== undefined}
        route={route}
        onChangeRedirectRoute={onChangeRedirectRoute}
      />
      )
}

export default Route

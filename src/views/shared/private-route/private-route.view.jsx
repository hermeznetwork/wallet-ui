import React from 'react'
import { Route, useLocation, Redirect } from 'react-router-dom'

import PrivateLayout from '../private-layout/private-layout.view'

function PrivateRoute ({ isUserLoggedIn, route, onChangeRedirectRoute }) {
  const { pathname, search } = useLocation()

  return (
    <Route
      exact
      key={route.path}
      path={route.path}
      render={() => {
        if (isUserLoggedIn) {
          return (
            <PrivateLayout>
              {route.render()}
            </PrivateLayout>
          )
        } else {
          const currentRoute = `${pathname}${search}`

          onChangeRedirectRoute(currentRoute)

          return <Redirect to='/login' />
        }
      }}
    />
  )
}

export default PrivateRoute

import React from "react";
import { Route, useLocation, Redirect } from "react-router-dom";

import PrivateLayout from "src/views/shared/private-layout/private-layout.view";
import * as routes from "src/routing/routes";

interface PrivateRouteProps {
  isUserLoggedIn: boolean;
  route: routes.Route;
  onChangeRedirectRoute: (route: string) => void;
}

function PrivateRoute({
  isUserLoggedIn,
  route,
  onChangeRedirectRoute,
}: PrivateRouteProps): JSX.Element {
  const { pathname, search } = useLocation();

  return (
    <Route
      exact
      key={route.path}
      path={route.path}
      render={() => {
        if (isUserLoggedIn) {
          return <PrivateLayout>{route.render()}</PrivateLayout>;
        } else {
          const currentRoute = `${pathname}${search}`;

          onChangeRedirectRoute(currentRoute);

          return <Redirect to="/login" />;
        }
      }}
    />
  );
}

export default PrivateRoute;

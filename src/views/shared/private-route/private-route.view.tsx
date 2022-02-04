import React from "react";
import { useLocation, Navigate } from "react-router-dom";

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

  if (isUserLoggedIn) {
    return <PrivateLayout>{route.render()}</PrivateLayout>;
  } else {
    const currentRoute = `${pathname}${search}`;

    onChangeRedirectRoute(currentRoute);

    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;

import React from "react";

import PrivateRoute from "src/views/shared/private-route/private-route.view";
import PublicRoute from "src/views/shared/public-route/public-route.view";
import * as routes from "src/routing/routes";
import { HermezWallet } from "src/domain";

interface RouteProps {
  route: routes.Route;
  wallet?: HermezWallet.HermezWallet;
  onChangeRedirectRoute: (route: string) => void;
}

function Route({ route, wallet, onChangeRedirectRoute }: RouteProps): JSX.Element {
  return route.isPublic ? (
    <PublicRoute route={route} />
  ) : (
    <PrivateRoute
      isUserLoggedIn={wallet !== undefined}
      route={route}
      onChangeRedirectRoute={onChangeRedirectRoute}
    />
  );
}

export default Route;

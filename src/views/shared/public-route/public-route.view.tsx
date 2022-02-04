import React from "react";

import PublicLayout from "src/views/shared/public-layout/public-layout.view";
import * as routes from "src/routing/routes";

interface PublicRouteProps {
  route: routes.Route;
}

function PublicRoute({ route }: PublicRouteProps): JSX.Element {
  return <PublicLayout>{route.render()}</PublicLayout>;
}

export default PublicRoute;

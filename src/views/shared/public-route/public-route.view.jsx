import React from "react";
import { Route } from "react-router-dom";

import PublicLayout from "../public-layout/public-layout.view";

function PublicRoute({ route }) {
  return (
    <Route
      exact
      key={route.path}
      path={route.path}
      render={() => <PublicLayout>{route.render()}</PublicLayout>}
    />
  );
}

export default PublicRoute;

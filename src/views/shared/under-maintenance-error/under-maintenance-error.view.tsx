import React from "react";

import useUnderMaintenanceErrorStyles from "src/views/shared/under-maintenance-error/under-maintenance-error.styles";
import { ReactComponent as UnderMaintenanceIcon } from "src/images/icons/under-maintenance.svg";
import PublicLayout from "src/views/shared/public-layout/public-layout.view";

function UnderMaintenanceError(): JSX.Element {
  const classes = useUnderMaintenanceErrorStyles();

  return (
    <PublicLayout>
      <div className={classes.root}>
        <UnderMaintenanceIcon className={classes.icon} />
        <h1 className={classes.message}>
          Hermez is currently under maintenance. Please, try to access it again later.
        </h1>
      </div>
    </PublicLayout>
  );
}

export default UnderMaintenanceError;

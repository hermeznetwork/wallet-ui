import React from "react";

import usePrivateLayoutStyles from "src/views/shared/private-layout/private-layout.styles";

interface PrivateLayoutProps {
  children: JSX.Element;
}

function PrivateLayout({ children }: PrivateLayoutProps): JSX.Element {
  const classes = usePrivateLayoutStyles();

  return (
    <div className={classes.root}>
      <main className={classes.main}>{children}</main>
    </div>
  );
}

export default PrivateLayout;

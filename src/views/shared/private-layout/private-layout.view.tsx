import React from "react";

import usePrivateLayoutStyles from "src/views/shared/private-layout/private-layout.styles";

const PrivateLayout: React.FC = ({ children }) => {
  const classes = usePrivateLayoutStyles();

  return (
    <div className={classes.root}>
      <main className={classes.main}>{children}</main>
    </div>
  );
};

export default PrivateLayout;

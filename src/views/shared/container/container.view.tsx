import React from "react";

import useContainerStyles, { ContainerStyles } from "src/views/shared/container/container.styles";

function Container({
  backgroundColor,
  addHeaderPadding,
  disableGutters,
  disableVerticalGutters,
  disableTopGutter,
  children,
  fullHeight,
}: ContainerStyles & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  const classes = useContainerStyles({
    addHeaderPadding,
    disableGutters,
    disableVerticalGutters,
    disableTopGutter,
    backgroundColor,
    fullHeight,
  });

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>{children}</div>
    </div>
  );
}

export default Container;

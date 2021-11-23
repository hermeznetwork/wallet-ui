import React from "react";

import useContainerStyles, { ContainerStyles } from "src/views/shared/container/container.styles";

type ContainerProps = ContainerStyles & {
  children: JSX.Element;
};

function Container({
  backgroundColor,
  addHeaderPadding,
  disableGutters,
  disableVerticalGutters,
  disableTopGutter,
  children,
  fullHeight,
}: ContainerProps): JSX.Element {
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

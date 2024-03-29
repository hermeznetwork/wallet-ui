import React from "react";

import useContainerStyles, { ContainerStyles } from "src/views/shared/container/container.styles";

const Container: React.FC<ContainerStyles> = ({
  backgroundColor,
  addHeaderPadding,
  disableGutters,
  disableVerticalGutters,
  disableTopGutter,
  children,
  fullHeight,
}) => {
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
};

export default Container;

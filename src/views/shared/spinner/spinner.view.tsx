import React from "react";
import { useTheme } from "react-jss";

import useSpinnerStyles from "src/views/shared/spinner/spinner.styles";
import { Theme } from "src/styles/theme";

const SIZE = 44;
const THICKNESS = 6;

interface SpinnerProps {
  size?: number;
}

function Spinner({ size }: SpinnerProps): JSX.Element {
  const theme = useTheme<Theme>();
  const classes = useSpinnerStyles({ size: size !== undefined ? size : theme.spacing(6) });

  return (
    <div className={classes.root}>
      <svg className={classes.svg} viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}>
        <circle
          className={classes.bottomCircle}
          cx={SIZE}
          cy={SIZE}
          r={(SIZE - THICKNESS) / 2}
          fill="none"
          strokeWidth={THICKNESS}
        />
        <circle
          className={classes.topCircle}
          cx={SIZE}
          cy={SIZE}
          r={(SIZE - THICKNESS) / 2}
          fill="none"
          strokeWidth={THICKNESS}
        />
      </svg>
    </div>
  );
}

export default Spinner;

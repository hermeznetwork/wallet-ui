import React from "react";

import Container from "src/views/shared/container/container.view";
import useSnackbarStyles from "src/views/shared/snackbar/snackbar.styles";
import { SNACKBAR_AUTO_HIDE_DURATION } from "src/constants";

interface SnackbarProps {
  message: string;
  backgroundColor?: string;
  onClose: () => void;
}

function Snackbar({ message, backgroundColor, onClose }: SnackbarProps): JSX.Element {
  const classes = useSnackbarStyles({ backgroundColor });

  React.useEffect(() => {
    const closingTimeoutId = setTimeout(onClose, SNACKBAR_AUTO_HIDE_DURATION);

    return () => clearTimeout(closingTimeoutId);
  }, [onClose]);

  return (
    <div className={classes.root}>
      <Container disableVerticalGutters>
        <div className={classes.wrapper}>
          <p className={classes.message}>{message}</p>
        </div>
      </Container>
    </div>
  );
}

export default Snackbar;

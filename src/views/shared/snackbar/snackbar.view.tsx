import React from "react";

import Container from "src/views/shared/container/container.view";
import { ReactComponent as CloseIconDark } from "src/images/icons/close.svg";
import { ReactComponent as CloseIconLight } from "src/images/icons/close-white.svg";
import useSnackbarStyles from "src/views/shared/snackbar/snackbar.styles";
import { SNACKBAR_AUTO_HIDE_DURATION } from "src/constants";

interface SnackbarProps {
  message: string;
  autoClose?: boolean;
  backgroundColor?: string;
  onClose: () => void;
}

function Snackbar({
  message,
  autoClose = true,
  backgroundColor,
  onClose,
}: SnackbarProps): JSX.Element {
  const classes = useSnackbarStyles({ backgroundColor });

  React.useEffect(() => {
    if (autoClose) {
      const closingTimeoutId = setTimeout(onClose, SNACKBAR_AUTO_HIDE_DURATION);

      return () => clearTimeout(closingTimeoutId);
    }
  }, [autoClose, onClose]);

  return (
    <div className={classes.root}>
      <Container disableVerticalGutters>
        <div className={classes.wrapper}>
          <p className={classes.message}>{message}</p>
          {!autoClose ? (
            <button className={classes.button} onClick={onClose}>
              {backgroundColor ? <CloseIconLight /> : <CloseIconDark />}
            </button>
          ) : null}
        </div>
      </Container>
    </div>
  );
}

export default Snackbar;

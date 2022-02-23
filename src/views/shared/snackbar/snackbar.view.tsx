import React from "react";

import Container from "src/views/shared/container/container.view";
import Button from "src/views/shared/button/button.view";
import { ReactComponent as CloseIconDark } from "src/images/icons/close.svg";
import { ReactComponent as CloseIconLight } from "src/images/icons/close-white.svg";
import useSnackbarStyles from "src/views/shared/snackbar/snackbar.styles";
import { SNACKBAR_AUTO_HIDE_DURATION } from "src/constants";
//domain
import { Message } from "src/domain";

interface SnackbarProps {
  message: Message;
  onClose: () => void;
  onReport: (error: string) => void;
}

function Snackbar({ message, onClose, onReport }: SnackbarProps): JSX.Element {
  const classes = useSnackbarStyles({ type: message.type });

  React.useEffect(() => {
    if (message.type !== "error") {
      const closingTimeoutId = setTimeout(onClose, SNACKBAR_AUTO_HIDE_DURATION);

      return () => clearTimeout(closingTimeoutId);
    }
  }, [message.type, onClose]);

  if (message.type !== "error") {
    return (
      <div className={classes.root}>
        <Container disableVerticalGutters>
          <div className={classes.wrapper}>
            <p className={classes.message}>{message.text}</p>
          </div>
        </Container>
      </div>
    );
  } else {
    const { text = "Oops, an error occurred. Would you mind reporting it?", parsed } = message;
    return (
      <div className={classes.root}>
        <Container disableVerticalGutters>
          <div className={classes.wrapper}>
            <p className={classes.message}>{text}</p>
            <Button
              className={classes.reportButton}
              text="Report"
              onClick={() => {
                onReport(parsed);
              }}
            />
            <button className={classes.closeButton} onClick={onClose}>
              {message.type === "error" ? <CloseIconLight /> : <CloseIconDark />}
            </button>
          </div>
        </Container>
      </div>
    );
  }
}

export default Snackbar;

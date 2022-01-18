import React from "react";

import Container from "src/views/shared/container/container.view";
import Button from "src/views/shared/button/button.view";
import { ReactComponent as CloseIconDark } from "src/images/icons/close.svg";
import { ReactComponent as CloseIconLight } from "src/images/icons/close-white.svg";
import useSnackbarStyles from "src/views/shared/snackbar/snackbar.styles";
import { SNACKBAR_AUTO_HIDE_DURATION } from "src/constants";
import theme from "src/styles/theme";
//domain
import { Message } from "src/domain";

interface SnackbarProps {
  message: Message;
  backgroundColor?: string;
  onClose: () => void;
  onReport: (raw: unknown, parsed: string) => void;
}

function Snackbar({ message, backgroundColor, onClose, onReport }: SnackbarProps): JSX.Element {
  const bkgColor = backgroundColor
    ? backgroundColor
    : message.type === "error"
    ? theme.palette.red.main
    : undefined;

  const classes = useSnackbarStyles({ backgroundColor: bkgColor });

  React.useEffect(() => {
    if (message.type === "info") {
      const closingTimeoutId = setTimeout(onClose, SNACKBAR_AUTO_HIDE_DURATION);

      return () => clearTimeout(closingTimeoutId);
    }
  }, [message.type, onClose]);

  if (message.type === "info") {
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
    const { text = "Oops, an error occurred. Would you mind reporting it?", raw, parsed } = message;
    return (
      <div className={classes.root}>
        <Container disableVerticalGutters>
          <div className={classes.wrapper}>
            <p className={classes.message}>{text}</p>
            <Button
              className={classes.reportButton}
              text="Report"
              onClick={() => {
                onReport(raw, parsed);
              }}
            />
            <button className={classes.closeButton} onClick={onClose}>
              {bkgColor ? <CloseIconLight /> : <CloseIconDark />}
            </button>
          </div>
        </Container>
      </div>
    );
  }
}

export default Snackbar;

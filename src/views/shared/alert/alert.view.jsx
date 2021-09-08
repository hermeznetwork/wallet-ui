import React from "react";

import useAlertStyles from "./alert.styles";
import { ReactComponent as InfoIcon } from "../../../images/icons/info.svg";

export const AlertVariant = {
  DARK: "dark",
  LIGHT: "light",
};

function Alert({
  message,
  variant = AlertVariant.DARK,
  showHelpButton,
  helpButtonLink,
  onHelpClick,
}) {
  const classes = useAlertStyles({ variant });
  const Button = helpButtonLink ? "a" : "button";

  return (
    <div className={classes.root}>
      <div className={classes.messageWrapper}>
        <InfoIcon className={classes.icon} />
        <p className={classes.message}>{message}</p>
      </div>
      {showHelpButton && (
        <Button
          className={classes.helpButton}
          {...(helpButtonLink
            ? { href: helpButtonLink, target: "_blank" }
            : { onClick: onHelpClick })}
        >
          More info
        </Button>
      )}
    </div>
  );
}

export default Alert;

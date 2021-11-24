import React from "react";

import useAlertStyles from "src/views/shared/alert/alert.styles";
import { ReactComponent as InfoIcon } from "src/images/icons/info.svg";

export type AlertVariant = "dark" | "light";

interface AlertProps {
  message: string;
  variant?: AlertVariant;
  showHelpButton: boolean;
  helpButtonLink?: string;
  onHelpClick: () => void;
}

function Alert({
  message,
  variant = "dark",
  showHelpButton,
  helpButtonLink,
  onHelpClick,
}: AlertProps): JSX.Element {
  const classes = useAlertStyles({ variant });
  const Component = helpButtonLink ? "a" : "button";

  return (
    <div className={classes.root}>
      <div className={classes.messageWrapper}>
        <InfoIcon className={classes.icon} />
        <p className={classes.message}>{message}</p>
      </div>
      {showHelpButton && (
        <Component
          className={classes.helpButton}
          {...(helpButtonLink
            ? { href: helpButtonLink, target: "_blank" }
            : { onClick: onHelpClick })}
        >
          More info
        </Component>
      )}
    </div>
  );
}

export default Alert;

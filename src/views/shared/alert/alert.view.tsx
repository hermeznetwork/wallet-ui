import React, { ReactElement } from "react";

import useAlertStyles from "src/views/shared/alert/alert.styles";
import { ReactComponent as InfoIcon } from "src/images/icons/info.svg";

export type AlertVariant = "dark" | "light";

interface AlertProps {
  message: string | ReactElement;
  variant?: AlertVariant;
  helpButtonLink?: string;
  onHelpClick?: () => void;
}

function Alert({
  message,
  variant = "dark",
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
      {onHelpClick && (
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

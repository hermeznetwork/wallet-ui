import React from "react";
import clsx from "clsx";

import usePrimaryButtonStyles from "./primary-button.styles";

interface PrimaryButtonProps {
  label: string;
  type?: "button" | "reset" | "submit";
  disabled?: boolean;
  boxed?: boolean;
  inRow?: boolean;
  last?: boolean;
  onClick: () => void;
}

function PrimaryButton({
  label,
  type,
  disabled,
  boxed,
  inRow,
  last,
  onClick,
}: PrimaryButtonProps): JSX.Element {
  const classes = usePrimaryButtonStyles();

  return (
    <button
      type={type || "button"}
      className={clsx({
        [classes.root]: true,
        [classes.boxedButton]: boxed,
        [classes.inRowButton]: inRow,
        [classes.lastButton]: last,
      })}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default PrimaryButton;

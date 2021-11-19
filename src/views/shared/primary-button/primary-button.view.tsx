import React from "react";
import clsx from "clsx";

import usePrimaryButtonStyles from "./primary-button.styles";

interface PrimaryButtonStateProps {
  label: string;
  type?: "button" | "submit";
  disabled?: boolean;
  boxed?: boolean;
  inRow?: boolean;
  last?: boolean;
}

interface PrimaryButtonHandlerProps {
  onClick?: () => void;
}

type PrimaryButtonProps = PrimaryButtonStateProps & PrimaryButtonHandlerProps;

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  type,
  disabled,
  boxed,
  inRow,
  last,
  onClick,
}) => {
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
};

export default PrimaryButton;

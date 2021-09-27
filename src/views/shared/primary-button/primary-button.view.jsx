import React from "react";
import clsx from "clsx";

import usePrimaryButtonStyles from "./primary-button.styles";

function PrimaryButton({ label, type, disabled, onClick, boxed, inRow, last }) {
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

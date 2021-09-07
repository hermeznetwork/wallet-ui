import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import useButtonStyles from "./button.styles";

function Button({ Icon, text, className, disabled, onClick }) {
  const classes = useButtonStyles({ rounded: !text });
  const isClickable = onClick !== undefined;
  const Component = isClickable ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      disabled={disabled}
      className={clsx({
        [classes.root]: true,
        [classes.button]: isClickable,
        [className]: className,
      })}
    >
      {Icon || <></>}
      {text && <p className={clsx({ [classes.textSpacer]: Icon !== undefined })}>{text}</p>}
    </Component>
  );
}

Button.propTypes = {
  Icon: PropTypes.element,
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;

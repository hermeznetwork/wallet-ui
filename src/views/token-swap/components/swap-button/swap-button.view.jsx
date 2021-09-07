import React from "react";
import PropTypes from "prop-types";

import FormButton from "../../../shared/form-button/form-button.view";
import useSwapButtonStyles from "./swap-button.style";

function SwapButton({ selectedQuote }) {
  const classes = useSwapButtonStyles();
  const timeUntilValid = selectedQuote?.validUntil.getTime();

  const [countdown, setCountdown] = React.useState(timeUntilValid - Date.now());

  React.useEffect(() => {
    const timer = setInterval(() => setCountdown(timeUntilValid - Date.now()), 1000);
    return () => clearInterval(timer);
  }, [selectedQuote]);

  const msToTime = (ms) => {
    let s = ms / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;

    return `${mins.toString().padStart(2, "0")}:${secs.toFixed(0).toString().padStart(2, "0")}`;
  };

  return (
    <div className={classes.root}>
      {selectedQuote && (
        <div className={classes.buttonBox}>
          <FormButton
            label={countdown > 0 ? `Swap ${msToTime(countdown)}` : "Time expired"}
            disabled={countdown <= 0}
          />
        </div>
      )}
    </div>
  );
}

SwapButton.propTypes = {
  selectedQuote: PropTypes.object,
};

export default SwapButton;

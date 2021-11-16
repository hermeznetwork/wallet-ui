import React from "react";
import PropTypes from "prop-types";

import { CurrencySymbol } from "../../../utils/currencies";

function FiatAmount({ amount, currency, className }) {
  return (
    <span className={className}>
      {CurrencySymbol[currency].symbol} {!isNaN(amount) && amount !== 0 ? amount.toFixed(2) : "--"}
    </span>
  );
}

FiatAmount.propTypes = {
  amount: PropTypes.number,
  currency: PropTypes.string.isRequired,
};

export default FiatAmount;

import React from "react";
import PropTypes from "prop-types";

import { CurrencySymbol } from "../../../utils/currencies";

function FiatAmount({ amount, currency }) {
  return (
    <span className="fiatAmount">
      {CurrencySymbol[currency].symbol} {!isNaN(amount) ? amount.toFixed(2) : "--"}
    </span>
  );
}

FiatAmount.propTypes = {
  amount: PropTypes.number,
  currency: PropTypes.string.isRequired,
};

export default FiatAmount;

import React from "react";

import { CurrencySymbol, isValidCurrencySymbolKey } from "src/utils/currencies";

type FiatAmountProps = {
  amount: number;
  currency: string;
};

function FiatAmount({
  amount,
  currency,
  className,
}: FiatAmountProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  if (isValidCurrencySymbolKey(currency)) {
    return (
      <span className={className}>
        {CurrencySymbol[currency].symbol} {!isNaN(amount) ? amount.toFixed(2) : "--"}
      </span>
    );
  } else {
    console.error(`Currency symbol not available for the unsuported currency "${currency}"`);
    return <span className={className}>{!isNaN(amount) ? amount.toFixed(2) : "--"}</span>;
  }
}

export default FiatAmount;

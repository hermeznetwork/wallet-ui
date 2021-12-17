import React from "react";

import { CurrencySymbol, formatFiatAmount, isValidCurrencySymbolKey } from "src/utils/currencies";

type FiatAmountProps = {
  currency: string;
  amount?: number;
  className?: string;
};

function FiatAmount({ currency, amount, className }: FiatAmountProps): JSX.Element {
  const formattedAmount = formatFiatAmount(amount);

  if (isValidCurrencySymbolKey(currency)) {
    return (
      <span className={className}>
        {CurrencySymbol[currency].symbol} {formattedAmount}
      </span>
    );
  } else {
    console.error(`Currency symbol not available for the unsupported currency "${currency}"`);
    return <span className={className}>{formattedAmount}</span>;
  }
}

export default FiatAmount;

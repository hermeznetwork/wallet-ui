import React from "react";

import { CurrencySymbol, formatFiatAmount, isValidCurrencySymbolKey } from "src/utils/currencies";

type FiatAmountProps = {
  amount?: number;
  currency: string;
};

function FiatAmount({
  amount,
  currency,
  className,
}: FiatAmountProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  const formattedAmount = formatFiatAmount(amount);

  if (isValidCurrencySymbolKey(currency)) {
    return (
      <span className={className}>
        {CurrencySymbol[currency].symbol} {formattedAmount}
      </span>
    );
  } else {
    console.error(`Currency symbol not available for the unsuported currency "${currency}"`);
    return <span className={className}>{formattedAmount}</span>;
  }
}

export default FiatAmount;

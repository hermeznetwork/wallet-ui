import React from "react";

import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";

interface TransactionAmountProps {
  preferredCurrency: string;
  fiatAmount?: number;
}

function TransactionAmount({ preferredCurrency, fiatAmount }: TransactionAmountProps): JSX.Element {
  return (
    <p>
      <FiatAmount currency={preferredCurrency} amount={fiatAmount} />
    </p>
  );
}

export default TransactionAmount;

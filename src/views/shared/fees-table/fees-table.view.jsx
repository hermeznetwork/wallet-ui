import React from "react";

import useFeesTableStyles from "./fees-table.styles";
import TransactionInfoRow from "../transaction-info-table-row/transaction-info-row.view";
import FiatAmount from "../fiat-amount/fiat-amount.view";
import { getAmountInPreferredCurrency, getFixedTokenAmount } from "../../../utils/currencies";

function FeesTable({
  l2Fee,
  l2FeeInFiat,
  estimatedWithdrawFee,
  token,
  preferredCurrency,
  fiatExchangeRates,
}) {
  const classes = useFeesTableStyles();
  const formattedEstimatedWithdrawFee = getFixedTokenAmount(estimatedWithdrawFee.amount.toString());
  const estimatedWithdrawFeeInFiat = getAmountInPreferredCurrency(
    estimatedWithdrawFee.USD,
    preferredCurrency,
    fiatExchangeRates
  );

  return (
    <div className={classes.feesTable}>
      <TransactionInfoRow
        title={estimatedWithdrawFee ? "Hermez fee" : "Fee"}
        hint={estimatedWithdrawFee && "Step 1"}
        subtitle={<FiatAmount amount={l2FeeInFiat} currency={preferredCurrency} />}
        value={`${l2Fee} ${token.symbol}`}
      />
      {estimatedWithdrawFee && (
        <TransactionInfoRow
          title="Ethereum fee (estimated)"
          hint="Step 2"
          subtitle={<FiatAmount amount={estimatedWithdrawFeeInFiat} currency={preferredCurrency} />}
          value={`${formattedEstimatedWithdrawFee} ETH`}
        />
      )}
    </div>
  );
}

export default FeesTable;

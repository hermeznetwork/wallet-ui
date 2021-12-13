import React from "react";
import { BigNumber } from "@ethersproject/bignumber";

import useFeesTableStyles from "src/views/shared/fees-table/fees-table.styles";
import TransactionInfoTableRow from "src/views/shared/transaction-info-table-row/transaction-info-table-row.view";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from "src/utils/currencies";
// domain
import { FiatExchangeRates, Token } from "src/domain/hermez";
import { EstimatedL1Fee } from "src/domain";

interface FeesTableProps {
  l2Fee: BigNumber;
  estimatedWithdrawFee?: EstimatedL1Fee;
  token: Token;
  preferredCurrency: string;
  fiatExchangeRates: FiatExchangeRates;
}

function FeesTable({
  l2Fee,
  estimatedWithdrawFee,
  token,
  preferredCurrency,
  fiatExchangeRates,
}: FeesTableProps): JSX.Element {
  const classes = useFeesTableStyles();
  const formattedL2Fee = getFixedTokenAmount(l2Fee.toString(), token.decimals);
  const l2FeeInFiat = getTokenAmountInPreferredCurrency(
    formattedL2Fee,
    token.USD,
    preferredCurrency,
    fiatExchangeRates
  );

  return (
    <div className={classes.feesTable}>
      <TransactionInfoTableRow
        title={estimatedWithdrawFee ? "Hermez fee" : "Fee"}
        hint={estimatedWithdrawFee && "Step 1"}
        subtitle={<FiatAmount amount={l2FeeInFiat} currency={preferredCurrency} />}
        value={`${formattedL2Fee} ${token.symbol}`}
      />
      {estimatedWithdrawFee &&
        (() => {
          const formattedEstimatedWithdrawFee = getFixedTokenAmount(
            estimatedWithdrawFee.amount.toString()
          );
          const estimatedWithdrawFeeInFiat = getTokenAmountInPreferredCurrency(
            formattedEstimatedWithdrawFee,
            estimatedWithdrawFee.token.USD,
            preferredCurrency,
            fiatExchangeRates
          );

          return (
            <TransactionInfoTableRow
              title="Ethereum fee (estimated)"
              hint="Step 2"
              subtitle={
                <FiatAmount amount={estimatedWithdrawFeeInFiat} currency={preferredCurrency} />
              }
              value={`${formattedEstimatedWithdrawFee} ETH`}
            />
          );
        })()}
    </div>
  );
}

export default FeesTable;

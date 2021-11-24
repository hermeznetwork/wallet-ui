import React from "react";
import * as ethers from "ethers";

import useFeesTableStyles from "src/views/shared/fees-table/fees-table.styles";
import TransactionInfoTableRow from "src/views/shared/transaction-info-table-row/transaction-info-table-row.view";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
import { MAX_TOKEN_DECIMALS } from "src/constants";
import {
  getAmountInPreferredCurrency,
  getTokenAmountInPreferredCurrency,
  trimZeros,
} from "src/utils/currencies";
// domain
import { FiatExchangeRates, Token } from "src/domain/hermez";
import { EstimatedWithdrawFee } from "src/domain";

interface FeesTableProps {
  l2Fee: number;
  estimatedWithdrawFee?: EstimatedWithdrawFee;
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

  function getL2FeeInFiat() {
    return getTokenAmountInPreferredCurrency(
      l2Fee.toString(),
      token.USD,
      preferredCurrency,
      fiatExchangeRates
    );
  }

  const formattedWithdrawFee =
    estimatedWithdrawFee && Number(ethers.utils.formatEther(estimatedWithdrawFee.amount));

  const estimatedWithdrawFeeInFiat =
    estimatedWithdrawFee &&
    getAmountInPreferredCurrency(estimatedWithdrawFee.USD, preferredCurrency, fiatExchangeRates);

  return (
    <div className={classes.feesTable}>
      <TransactionInfoTableRow
        title={estimatedWithdrawFee ? "Hermez fee" : "Fee"}
        hint={estimatedWithdrawFee && "Step 1"}
        subtitle={<FiatAmount amount={getL2FeeInFiat()} currency={preferredCurrency} />}
        value={`${trimZeros(l2Fee, MAX_TOKEN_DECIMALS)} ${token.symbol}`}
      />
      {formattedWithdrawFee && estimatedWithdrawFeeInFiat && (
        <TransactionInfoTableRow
          title="Ethereum fee (estimated)"
          hint="Step 2"
          subtitle={<FiatAmount amount={estimatedWithdrawFeeInFiat} currency={preferredCurrency} />}
          value={`${formattedWithdrawFee.toFixed(MAX_TOKEN_DECIMALS)} ETH`}
        />
      )}
    </div>
  );
}

export default FeesTable;

import React from "react";
import * as ethers from "ethers";

import useFeesTableStyles from "./fees-table.styles";
import TransactionInfoRow from "../../../shared/transaction-info-table-row/transaction-info-row.view";
import FiatAmount from "../../../shared/fiat-amount/fiat-amount.view";
import { MAX_TOKEN_DECIMALS } from "../../../../constants";
import {
  CurrencySymbol,
  getAmountInPreferredCurrency,
  getTokenAmountInPreferredCurrency,
  trimZeros,
} from "../../../../utils/currencies";

function FeesTable({ l2Fee, estimatedWithdrawFee, token, preferredCurrency, fiatExchangeRates }) {
  const classes = useFeesTableStyles();

  function getL2FeeInFiat() {
    return getTokenAmountInPreferredCurrency(
      l2Fee,
      token.USD,
      preferredCurrency,
      fiatExchangeRates
    );
  }

  function getEstimatedWithdrawFeeInFiat() {
    if (!estimatedWithdrawFee?.USD) {
      return undefined;
    }

    return getAmountInPreferredCurrency(
      estimatedWithdrawFee.USD,
      preferredCurrency,
      fiatExchangeRates
    );
  }

  function getFormattedWithdrawFee() {
    if (!estimatedWithdrawFee) {
      return undefined;
    }

    return Number(ethers.utils.formatEther(estimatedWithdrawFee.amount));
  }

  if (l2Fee && estimatedWithdrawFee) {
    return (
      <div className={classes.feesTable}>
        <TransactionInfoRow
          title="Hermez fee"
          subtitle={<FiatAmount amount={getL2FeeInFiat()} currency={preferredCurrency} />}
          hint="Step 1"
          value={`${trimZeros(l2Fee, MAX_TOKEN_DECIMALS)} ${token.symbol}`}
        />
        <TransactionInfoRow
          title="Ethereum fee (estimated)"
          hint="Step 2"
          subtitle={
            <FiatAmount amount={getEstimatedWithdrawFeeInFiat()} currency={preferredCurrency} />
          }
          value={`${getFormattedWithdrawFee().toFixed(MAX_TOKEN_DECIMALS)} ETH`}
        />
      </div>
    );
  }

  return (
    <div className={classes.feesTable}>
      <TransactionInfoRow
        title={estimatedWithdrawFee ? "Hermez fee" : "Fee"}
        subtitle={`${CurrencySymbol[preferredCurrency].symbol}${getL2FeeInFiat()}`}
        value={`${trimZeros(l2Fee, MAX_TOKEN_DECIMALS)} ${token.symbol}`}
      />
      {estimatedWithdrawFee && (
        <TransactionInfoRow
          title="Ethereum fee (estimated)"
          subtitle={`${CurrencySymbol[preferredCurrency].symbol}${getEstimatedWithdrawFeeInFiat()}`}
          value={`${getFormattedWithdrawFee().toFixed(MAX_TOKEN_DECIMALS)} ETH`}
        />
      )}
    </div>
  );
}

export default FeesTable;

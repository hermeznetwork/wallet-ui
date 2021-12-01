import React from "react";
import { BigNumber } from "@ethersproject/bignumber";

import useTransactionInfoTableStyles from "src/views/shared/transaction-info-table/transaction-info-table.styles";
import TransactionInfoTableRow from "src/views/shared/transaction-info-table-row/transaction-info-table-row.view";
import FeesTable from "src/views/shared/fees-table/fees-table.view";
// domain
import { FiatExchangeRates, Token } from "src/domain/hermez";
import { EstimatedL1Fee } from "src/domain";

interface TransactionInfoTableProps {
  status?: Row;
  from?: Row & { onCopyFromAddress?: () => void };
  to?: Row & { onCopyToAddress?: () => void };
  date?: Row;
  feeData?: {
    fee?: BigNumber;
    token?: Token;
    estimatedWithdrawFee?: EstimatedL1Fee;
    preferredCurrency?: string;
    fiatExchangeRates?: FiatExchangeRates;
  };
}
export interface Row {
  subtitle: string;
  value?: string;
}

function TransactionInfoTable({
  status,
  from,
  to,
  date,
  feeData,
}: TransactionInfoTableProps): JSX.Element {
  const classes = useTransactionInfoTableStyles();

  return (
    <div className={classes.root}>
      {status && (
        <TransactionInfoTableRow title="Status" subtitle={status.subtitle} value={status.value} />
      )}
      {from && (
        <TransactionInfoTableRow
          title="From"
          subtitle={from.subtitle}
          value={from.value}
          onCopySubtitle={from.onCopyFromAddress}
        />
      )}
      {to && (
        <TransactionInfoTableRow
          title="To"
          subtitle={to.subtitle}
          value={to.value}
          onCopySubtitle={to.onCopyToAddress}
        />
      )}
      {date && <TransactionInfoTableRow title="Date" subtitle={date.subtitle} />}
      {feeData &&
        feeData.fee &&
        feeData.token &&
        feeData.preferredCurrency &&
        feeData.fiatExchangeRates && (
          <FeesTable
            l2Fee={feeData.fee}
            estimatedWithdrawFee={feeData.estimatedWithdrawFee}
            token={feeData.token}
            preferredCurrency={feeData.preferredCurrency}
            fiatExchangeRates={feeData.fiatExchangeRates}
          />
        )}
    </div>
  );
}

export default TransactionInfoTable;

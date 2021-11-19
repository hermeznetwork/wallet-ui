import React from "react";

import useTransactionInfoTableStyles from "src/views/shared/transaction-info-table/transaction-info-table.styles";
import TransactionInfoTableRow from "src/views/shared/transaction-info-table-row/transaction-info-table-row.view";
import FeesTable from "src/views/shared/fees-table/fees-table.view";
// domain
import { FiatExchangeRates, Token } from "src/domain/hermez";
import { EstimatedWithdrawFee } from "src/domain";

interface TransactionInfoTableProps {
  status?: StatusRow;
  from?: AddressRow;
  to?: AddressRow;
  date?: DateRow;
  fee?: number;
  token?: Token;
  estimatedWithdrawFee?: EstimatedWithdrawFee;
  preferredCurrency?: string;
  fiatExchangeRates?: FiatExchangeRates;
  showToCopyButton?: boolean;
  showFromCopyButton?: boolean;
  onCopyToAddress?: () => void;
  onCopyFromAddress?: () => void;
}

export interface StatusRow {
  subtitle: string;
  value?: string;
}

export interface AddressRow {
  subtitle: string;
  value?: string;
}

export interface DateRow {
  subtitle: string;
}

function TransactionInfoTable({
  status,
  from,
  to,
  date,
  fee,
  token,
  estimatedWithdrawFee,
  preferredCurrency,
  fiatExchangeRates,
  showToCopyButton,
  showFromCopyButton,
  onCopyToAddress,
  onCopyFromAddress,
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
          showCopyButton={showFromCopyButton}
          onCopySubtitle={onCopyFromAddress}
        />
      )}
      {to && (
        <TransactionInfoTableRow
          title="To"
          subtitle={to.subtitle}
          value={to.value}
          showCopyButton={showToCopyButton}
          onCopySubtitle={onCopyToAddress}
        />
      )}
      {date && <TransactionInfoTableRow title="Date" subtitle={date.subtitle} />}
      {fee && token && preferredCurrency && fiatExchangeRates && (
        <FeesTable
          l2Fee={fee}
          estimatedWithdrawFee={estimatedWithdrawFee}
          token={token}
          preferredCurrency={preferredCurrency}
          fiatExchangeRates={fiatExchangeRates}
        />
      )}
    </div>
  );
}

export default TransactionInfoTable;

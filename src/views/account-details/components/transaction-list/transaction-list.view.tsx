import React from "react";

import TransactionCard from "src/views/account-details/components/transaction-card/transaction-card.view";
import useTransactionListStyles from "src/views/account-details/components/transaction-list/transaction-list.styles";
import {
  getFixedTokenAmount,
  getAmountInPreferredCurrency,
  getTokenAmountInPreferredCurrency,
} from "src/utils/currencies";
import { getTransactionAmount } from "src/utils/transactions";
// domain
import {
  CoordinatorState,
  FiatExchangeRates,
  HistoryTransaction,
  isHistoryTransaction,
  isPendingDeposit,
  isPoolTransaction,
  PendingDeposit,
  PoolTransaction,
} from "src/domain";

interface TransactionListProps {
  accountIndex: string;
  transactions: HistoryTransaction[] | PoolTransaction[] | PendingDeposit[];
  preferredCurrency: string;
  fiatExchangeRates: FiatExchangeRates;
  coordinatorState: CoordinatorState;
  arePending?: boolean;
  onTransactionClick: (transaction: PendingDeposit | HistoryTransaction | PoolTransaction) => void;
}

function TransactionList({
  accountIndex,
  transactions,
  preferredCurrency,
  fiatExchangeRates,
  arePending,
  coordinatorState,
  onTransactionClick,
}: TransactionListProps): JSX.Element {
  const classes = useTransactionListStyles();

  /**
   * Bubbles up the onClick event when a transaction is clicked
   */
  function handleTransactionClick(
    transaction: PendingDeposit | HistoryTransaction | PoolTransaction
  ) {
    onTransactionClick(transaction);
  }

  return (
    <>
      {transactions.map((transaction) => {
        const amount = getTransactionAmount(transaction);
        const fixedTokenAmount = getFixedTokenAmount(amount, transaction.token.decimals);
        const id = isPendingDeposit(transaction) ? transaction.hash : transaction.id;

        return (
          <div key={id} className={classes.transaction}>
            <TransactionCard
              type={transaction.type}
              accountIndex={accountIndex}
              fromAccountIndex={
                isPendingDeposit(transaction)
                  ? transaction.accountIndex
                  : transaction.fromAccountIndex || undefined
              }
              amount={fixedTokenAmount}
              tokenSymbol={transaction.token.symbol}
              fiatAmount={
                isHistoryTransaction(transaction) && transaction.historicUSD
                  ? getAmountInPreferredCurrency(
                      transaction.historicUSD,
                      preferredCurrency,
                      fiatExchangeRates
                    )
                  : getTokenAmountInPreferredCurrency(
                      fixedTokenAmount,
                      transaction.token,
                      preferredCurrency,
                      fiatExchangeRates
                    )
              }
              isPending={arePending}
              timestamp={transaction.timestamp}
              preferredCurrency={preferredCurrency}
              coordinatorState={coordinatorState}
              invalid={isPoolTransaction(transaction) && transaction.errorCode !== null}
              onClick={() => handleTransactionClick(transaction)}
            />
          </div>
        );
      })}
    </>
  );
}

export default TransactionList;

import React from "react";

import TransactionComponent from "src/views/account-details/components/transaction/transaction.view";
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
  PendingDeposit,
  PoolTransaction,
} from "src/domain/hermez";

interface TransactionList {
  accountIndex: string;
  transactions: HistoryTransaction[] | PoolTransaction[] | PendingDeposit[];
  preferredCurrency: string;
  fiatExchangeRates: FiatExchangeRates;
  arePending: boolean;
  coordinatorState: CoordinatorState;
  onTransactionClick: (transaction: HistoryTransaction) => void;
}

function TransactionList({
  accountIndex,
  transactions,
  preferredCurrency,
  fiatExchangeRates,
  arePending,
  coordinatorState,
  onTransactionClick,
}: TransactionList): JSX.Element {
  const classes = useTransactionListStyles();

  /**
   * Bubbles up the onClick event when a transaction is clicked
   */
  function handleTransactionClick(transaction: HistoryTransaction) {
    onTransactionClick(transaction);
  }

  return (
    <>
      {transactions.map((transaction) => {
        const amount = getTransactionAmount(transaction);
        const fixedTokenAmount = getFixedTokenAmount(amount, transaction.token.decimals);

        return (
          <div key={transaction.id} className={classes.transaction}>
            <TransactionComponent
              id={transaction.id}
              type={transaction.type}
              accountIndex={accountIndex}
              fromAccountIndex={transaction.fromAccountIndex}
              amount={fixedTokenAmount}
              tokenSymbol={transaction.token.symbol}
              fiatAmount={
                transaction.historicUSD
                  ? getAmountInPreferredCurrency(
                      transaction.historicUSD,
                      preferredCurrency,
                      fiatExchangeRates
                    )
                  : getTokenAmountInPreferredCurrency(
                      fixedTokenAmount,
                      transaction.token.USD,
                      preferredCurrency,
                      fiatExchangeRates
                    )
              }
              isPending={arePending}
              timestamp={transaction.timestamp}
              preferredCurrency={preferredCurrency}
              coordinatorState={coordinatorState}
              invalid={transaction.errorCode}
              onClick={() => handleTransactionClick(transaction)}
            />
          </div>
        );
      })}
    </>
  );
}

export default TransactionList;

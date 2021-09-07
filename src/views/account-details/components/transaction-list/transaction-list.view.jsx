import React from "react";
import PropTypes from "prop-types";

import Transaction from "../transaction/transaction.view";
import useTransactionListStyles from "./transaction-list.styles";
import {
  getFixedTokenAmount,
  getAmountInPreferredCurrency,
  getTokenAmountInPreferredCurrency,
} from "../../../../utils/currencies";
import { getTransactionAmount } from "../../../../utils/transactions";

function TransactionList({
  accountIndex,
  transactions,
  preferredCurrency,
  fiatExchangeRates,
  arePending,
  coordinatorState,
  onTransactionClick,
}) {
  const classes = useTransactionListStyles();

  /**
   * Bubbles up the onClick event when a transaction is clicked
   * @param {Object} transaction - The transaction clicked
   */
  function handleTransactionClick(transaction) {
    onTransactionClick(transaction);
  }

  return (
    <>
      {transactions.map((transaction) => {
        const amount = getTransactionAmount(transaction);
        const fixedTokenAmount = getFixedTokenAmount(amount, transaction.token.decimals);

        return (
          <div key={transaction.hash || transaction.id} className={classes.transaction}>
            <Transaction
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
              onClick={() => handleTransactionClick(transaction)}
            />
          </div>
        );
      })}
    </>
  );
}

TransactionList.propTypes = {
  transactions: PropTypes.array,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object,
  onTransactionClick: PropTypes.func.isRequired,
};

export default TransactionList;

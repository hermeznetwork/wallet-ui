// ToDo: Remove the disable of TS and the linter below once the component are migrated to TS
/* eslint-disable */
// @ts-nocheck
import React from "react";
import clsx from "clsx";

import AmountInput from "src/views/shared/amount-input/amount-input.view";
import useTransactionAmountInputStyles from "src/views/transactions/components/transaction-amount-input/transaction-amount-input.styles";
import { ReactComponent as SwapIcon } from "src/images/icons/swap.svg";
import { ReactComponent as ErrorIcon } from "src/images/icons/error.svg";
import { getFixedTokenAmount } from "src/utils/currencies";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
// domain
import { Account } from "src/domain/hermez";
import { BigNumber } from "@ethersproject/bignumber";

interface Amount {
  fiat: number;
  tokens: BigNumber;
}

interface TransactionAmountInputProps {
  account: Account;
  preferredCurrency: string;
  value: string;
  amount: Amount;
  showInFiat: boolean;
  isAmountWithFeeMoreThanFunds: boolean;
  isAmountCompressedInvalid: boolean;
  onInputChange: () => void;
  onSendAll: () => void;
  onSwapCurrency: () => void;
}

function TransactionAmountInput({
  account,
  preferredCurrency,
  value,
  amount,
  showInFiat,
  isAmountWithFeeMoreThanFunds,
  isAmountCompressedInvalid,
  onInputChange,
  onSendAll,
  onSwapCurrency,
}: TransactionAmountInputProps): JSX.Element {
  const classes = useTransactionAmountInputStyles();

  function hasErrors() {
    return isAmountWithFeeMoreThanFunds || isAmountCompressedInvalid;
  }

  function getErrorMessage() {
    if (isAmountWithFeeMoreThanFunds) {
      return "You don't have enough funds";
    }
    if (isAmountCompressedInvalid) {
      return "The amount introduced is not supported by Hermez's compression algorithm. It needs to have a maximum of 10 significant digits";
    }
    return "";
  }

  return (
    <div className={classes.root}>
      <div
        className={clsx({
          [classes.selectAmount]: true,
          [classes.selectAmountError]: hasErrors(),
        })}
      >
        <div className={classes.amount}>
          <p className={classes.amountCurrency}>
            {showInFiat ? preferredCurrency : account.token.symbol}
          </p>
          <input
            autoFocus
            className={classes.amountInput}
            value={value}
            placeholder="0.00"
            type="text"
            onChange={onInputChange}
          />
        </div>
        <div className={classes.amountButtons}>
          <button
            type="button"
            className={`${classes.amountButtonsItem} ${classes.amountButton} ${classes.amountMax}`}
            tabIndex={-1}
            onClick={onSendAll}
          >
            Max
          </button>
          <div className={classes.amountButtonsItem}>
            {showInFiat ? (
              <span>
                {getFixedTokenAmount(amount.tokens.toString(), account.token.decimals)}{" "}
                {account.token.symbol}
              </span>
            ) : (
              <FiatAmount amount={amount.fiat} currency={preferredCurrency} />
            )}
          </div>
          <button
            type="button"
            className={`${classes.amountButtonsItem} ${classes.amountButton} ${classes.changeCurrency}`}
            tabIndex={-1}
            onClick={onSwapCurrency}
          >
            <SwapIcon className={classes.changeCurrencyIcon} />
          </button>
        </div>
      </div>
      <p
        className={clsx({
          [classes.errorMessage]: true,
          [classes.selectAmountErrorMessageVisible]: hasErrors(),
        })}
      >
        <ErrorIcon className={classes.errorIcon} />
        {getErrorMessage()}
      </p>
    </div>
  );
}

export default AmountInput(TransactionAmountInput);

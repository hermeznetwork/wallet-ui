import React from "react";
import clsx from "clsx";

import AmountInput from "../../../shared/amount-input/amount-input.view";
import useTransactionAmountInputStyles from "./transaction-amount-input.styles";
import { ReactComponent as SwapIcon } from "../../../../images/icons/swap.svg";
import { ReactComponent as ErrorIcon } from "../../../../images/icons/error.svg";
import { getFixedTokenAmount } from "../../../../utils/currencies";

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
}) {
  const classes = useTransactionAmountInputStyles();
  const inputRef = React.useRef("");

  React.useEffect(() => {
    inputRef.current.focus();
  }, []);

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
            ref={inputRef}
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
            tabIndex="-1"
            onClick={onSendAll}
          >
            Max
          </button>
          <div className={classes.amountButtonsItem}>
            {showInFiat ? (
              <span>
                {getFixedTokenAmount(amount.tokens, account.token.decimals)} {account.token.symbol}
              </span>
            ) : (
              <span>
                {amount.fiat} {preferredCurrency}
              </span>
            )}
          </div>
          <button
            type="button"
            className={`${classes.amountButtonsItem} ${classes.amountButton} ${classes.changeCurrency}`}
            tabIndex="-1"
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

import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import { CurrencySymbol } from "../../../../utils/currencies";
import useTransactionAmountStyles from "./transaction-amount.styles";

function TransactionAmount({
  type,
  fiatAmount,
  preferredCurrency,
  fromAccountIndex,
  accountIndex,
}) {
  const classes = useTransactionAmountStyles();
  const currencySymbol = CurrencySymbol[preferredCurrency].symbol;

  switch (type) {
    case TxType.CreateAccountDeposit:
    case TxType.Deposit: {
      return (
        <p className={`${classes.root} ${classes.depositAmount}`}>
          {currencySymbol} {fiatAmount}
        </p>
      );
    }
    case TxType.Withdraw:
    case TxType.Exit:
    case TxType.ForceExit: {
      return (
        <p className={classes.root}>
          - {currencySymbol} {fiatAmount}
        </p>
      );
    }
    case TxType.Transfer:
    case TxType.TransferToEthAddr: {
      if (fromAccountIndex === accountIndex) {
        return (
          <p className={classes.root}>
            - {currencySymbol} {fiatAmount}
          </p>
        );
      } else {
        return (
          <p className={`${classes.root} ${classes.depositAmount}`}>
            {currencySymbol} {fiatAmount}
          </p>
        );
      }
    }
    default: {
      return "";
    }
  }
}

export default TransactionAmount;

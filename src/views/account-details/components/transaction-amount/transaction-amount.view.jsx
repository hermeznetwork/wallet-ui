import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import { CurrencySymbol } from "../../../../utils/currencies";
import useTransactionAmountStyles from "./transaction-amount.styles";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";

function TransactionAmount({
  type,
  fiatAmount,
  preferredCurrency,
  fromAccountIndex,
  accountIndex,
}) {
  const classes = useTransactionAmountStyles();

  switch (type) {
    case TxType.CreateAccountDeposit:
    case TxType.Deposit: {
      return (
        <p className={classes.root}>
          <FiatAmount
            currency={preferredCurrency}
            amount={fiatAmount}
            className={classes.depositAmount}
          />
        </p>
      );
    }
    case TxType.Withdraw:
    case TxType.Exit:
    case TxType.ForceExit: {
      return (
        <p className={classes.root}>
          <FiatAmount currency={preferredCurrency} amount={-fiatAmount} />
        </p>
      );
    }
    case TxType.Transfer:
    case TxType.TransferToEthAddr: {
      if (fromAccountIndex === accountIndex) {
        return (
          <p className={classes.root}>
            <FiatAmount currency={preferredCurrency} amount={-fiatAmount} />
          </p>
        );
      } else {
        return (
          <p className={classes.root}>
            <FiatAmount
              currency={preferredCurrency}
              amount={fiatAmount}
              className={classes.depositAmount}
            />
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

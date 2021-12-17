import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import useTransactionAmountStyles from "src/views/account-details/components/transaction-amount/transaction-amount.style";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";

interface TransactionAmountProps {
  type: TxType;
  preferredCurrency: string;
  accountIndex: string;
  fiatAmount?: number;
  fromAccountIndex?: string;
}

function TransactionAmount({
  type,
  preferredCurrency,
  accountIndex,
  fiatAmount,
  fromAccountIndex,
}: TransactionAmountProps): JSX.Element {
  const classes = useTransactionAmountStyles();

  function positiveFiat() {
    switch (type) {
      case TxType.CreateAccountDeposit:
      case TxType.Deposit: {
        return classes.depositAmount;
      }
      case TxType.Transfer:
      case TxType.TransferToEthAddr:
      case TxType.TransferToBJJ:
      case TxType.Withdraw:
      case TxType.Exit:
      case TxType.ForceExit: {
        if (fromAccountIndex === accountIndex) {
          return undefined;
        } else {
          return classes.depositAmount;
        }
      }
    }
  }
  return (
    <p>
      <FiatAmount currency={preferredCurrency} amount={fiatAmount} className={positiveFiat()} />
    </p>
  );
}

export default TransactionAmount;

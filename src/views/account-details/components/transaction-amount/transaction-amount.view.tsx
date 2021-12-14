import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";

interface TransactionAmountProps {
  type: string;
  preferredCurrency: string;
  accountIndex: string;
  fiatAmount?: number;
  fromAccountIndex?: string;
}

function TransactionAmount({
  type,
  fiatAmount,
  preferredCurrency,
  fromAccountIndex,
  accountIndex,
}: TransactionAmountProps): JSX.Element {
  const negativeFiatAmount = fiatAmount && -fiatAmount;
  switch (type) {
    case TxType.CreateAccountDeposit:
    case TxType.Deposit: {
      return (
        <p>
          <FiatAmount currency={preferredCurrency} amount={fiatAmount} />
        </p>
      );
    }
    case TxType.Withdraw:
    case TxType.Exit:
    case TxType.ForceExit: {
      return (
        <p>
          <FiatAmount currency={preferredCurrency} amount={negativeFiatAmount} />
        </p>
      );
    }
    case TxType.Transfer:
    case TxType.TransferToEthAddr: {
      if (fromAccountIndex === accountIndex) {
        return (
          <p>
            <FiatAmount currency={preferredCurrency} amount={negativeFiatAmount} />
          </p>
        );
      } else {
        return (
          <p>
            <FiatAmount currency={preferredCurrency} amount={fiatAmount} />
          </p>
        );
      }
    }
    default: {
      return <></>;
    }
  }
}

export default TransactionAmount;

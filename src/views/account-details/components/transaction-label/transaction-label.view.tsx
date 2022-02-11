import React from "react";
import { Enums } from "@hermeznetwork/hermezjs";

import useTransactionLabelStyles from "src/views/account-details/components/transaction-label/transaction-label.styles";

const { TxType } = Enums;

interface TransactionLabelProps {
  type: Enums.TxType;
  accountIndex: string;
  fromAccountIndex?: string;
}
function TransactionLabel({
  type,
  fromAccountIndex,
  accountIndex,
}: TransactionLabelProps): JSX.Element {
  const classes = useTransactionLabelStyles();
  /**
   * Returns the label corresponding to the transaction type
   */
  function getLabel() {
    switch (type) {
      case TxType.CreateAccountDeposit:
      case TxType.Deposit: {
        return "Deposited";
      }
      case TxType.Withdraw:
      case TxType.Exit:
      case TxType.ForceExit: {
        return "Withdrawn";
      }
      case TxType.Transfer:
      case TxType.TransferToBJJ:
      case TxType.TransferToEthAddr: {
        if (fromAccountIndex === accountIndex) {
          return "Sent";
        } else {
          return "Received";
        }
      }
    }
  }

  return <p className={classes.root}>{getLabel()}</p>;
}

export default TransactionLabel;

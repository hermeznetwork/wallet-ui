import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import useTransactionLabelStyles from "src/views/account-details/components/transaction-label/transaction-label.styles";

interface TransactionLabelProps {
  type: string;
  fromAccountIndex: string;
  accountIndex: string;
}
function TransactionLabel({
  type,
  fromAccountIndex,
  accountIndex,
}: TransactionLabelProps): JSX.Element {
  const classes = useTransactionLabelStyles();
  /**
   * Returns the label corresponding to the transaction type
   * @returns {string} - Transaction label
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
      default: {
        return "";
      }
    }
  }

  return <p className={classes.root}>{getLabel()}</p>;
}

export default TransactionLabel;

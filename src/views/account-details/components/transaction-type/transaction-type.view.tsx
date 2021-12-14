import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import depositedIcon from "src/images/icons/deposited.svg";
import receivedIcon from "src/images/icons/received.svg";
import sentIcon from "src/images/icons/sent.svg";
import withdrawnIcon from "src/images/icons/withdrawn.svg";

interface TransactionTypeProps {
  type: string;
  accountIndex: string;
  fromAccountIndex?: string;
}

function TransactionType({
  type,
  accountIndex,
  fromAccountIndex,
}: TransactionTypeProps): JSX.Element {
  /**
   * Returns the icon corresponding to the transaction type
   */
  function getIcon() {
    switch (type) {
      case TxType.CreateAccountDeposit:
      case TxType.Deposit: {
        return depositedIcon;
      }
      case TxType.Transfer:
      case TxType.TransferToBJJ:
      case TxType.TransferToEthAddr: {
        if (fromAccountIndex === accountIndex) {
          return sentIcon;
        } else {
          return receivedIcon;
        }
      }
      case TxType.Withdraw:
      case TxType.Exit:
      case TxType.ForceExit: {
        return withdrawnIcon;
      }
      default: {
        return undefined;
      }
    }
  }

  return <img src={getIcon()} alt="Transaction type" />;
}

export default TransactionType;

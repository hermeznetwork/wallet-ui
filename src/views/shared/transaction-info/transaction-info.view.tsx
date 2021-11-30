import React from "react";
import { TxState, TxType } from "@hermeznetwork/hermezjs/src/enums";
import { getEthereumAddress } from "@hermeznetwork/hermezjs/src/addresses";
import { INTERNAL_ACCOUNT_ETH_ADDR } from "@hermeznetwork/hermezjs/src/constants";
import { BigNumber } from "@ethersproject/bignumber";

import TransactionInfoTable, {
  Row,
} from "src/views/shared/transaction-info-table/transaction-info-table.view";
import {
  getPartiallyHiddenEthereumAddress,
  getPartiallyHiddenHermezAddress,
} from "src/utils/addresses";
import { copyToClipboard } from "src/utils/browser";
// domain
import {
  PendingDeposit,
  HistoryTransaction,
  PoolTransaction,
  FiatExchangeRates,
  isPoolTransaction,
  isHistoryTransaction,
} from "src/domain/hermez";

const TxStatus = {
  Confirmed: "Confirmed",
  Pending: "Pending",
  Invalid: "Invalid",
};

type Transaction = PendingDeposit | HistoryTransaction | PoolTransaction;

interface TransactionInfoProps {
  transaction: Transaction;
  fee?: BigNumber;
  accountIndex?: string;
  preferredCurrency: string;
  fiatExchangeRates?: FiatExchangeRates;
  showStatus: boolean;
  onToCopyClick: () => void;
  onFromCopyClick: () => void;
}

function TransactionInfo({
  transaction,
  fee,
  accountIndex,
  preferredCurrency,
  fiatExchangeRates,
  showStatus,
  onToCopyClick,
  onFromCopyClick,
}: TransactionInfoProps): JSX.Element {
  const feeData = { fee, fiatExchangeRates, preferredCurrency, token: transaction.token };
  const date: Row = {
    subtitle: new Date(transaction.timestamp).toLocaleString(),
  };
  const myHermezAddress: Row = {
    subtitle: "My Hermez address",
    value: getPartiallyHiddenHermezAddress(transaction.fromHezEthereumAddress),
  };

  function getTransactionStatus(): Row | undefined {
    if (!showStatus) {
      return undefined;
    }

    if (isHistoryTransaction(transaction)) {
      return { subtitle: TxStatus.Confirmed };
    } else {
      if (transaction.state === TxState.Forged) {
        return { subtitle: TxStatus.Confirmed };
      }

      if (isPoolTransaction(transaction) && transaction.errorCode !== null) {
        return { subtitle: TxStatus.Invalid };
      }

      return { subtitle: TxStatus.Pending };
    }
  }

  function handleCopyToAddress() {
    const addressOrNull =
      (isPoolTransaction(transaction) || isHistoryTransaction(transaction)) &&
      transaction.toHezEthereumAddress?.toLowerCase() === INTERNAL_ACCOUNT_ETH_ADDR.toLowerCase()
        ? transaction.toBJJ
        : transaction.toHezEthereumAddress;
    if (addressOrNull !== null) {
      copyToClipboard(addressOrNull);
      onToCopyClick();
    }
  }

  function handleCopyFromAddress() {
    copyToClipboard(transaction.fromHezEthereumAddress);
    onFromCopyClick();
  }

  function getTransferRecipientRow(): Row | undefined {
    if (
      (isPoolTransaction(transaction) || isHistoryTransaction(transaction)) &&
      transaction.toBJJ &&
      transaction.toHezEthereumAddress?.toLowerCase() === INTERNAL_ACCOUNT_ETH_ADDR.toLowerCase()
    ) {
      return {
        subtitle: getPartiallyHiddenHermezAddress(transaction.toBJJ),
      };
    } else if (transaction.toHezEthereumAddress) {
      return {
        subtitle: getPartiallyHiddenHermezAddress(transaction.toHezEthereumAddress),
      };
    } else if (
      isPoolTransaction(transaction) &&
      transaction.fromAccountIndex &&
      transaction.fromAccountIndex === transaction.toAccountIndex
    ) {
      return myHermezAddress;
    }
    return undefined;
  }

  switch (transaction.type) {
    case TxType.CreateAccountDeposit:
    case TxType.Deposit: {
      return (
        <TransactionInfoTable
          status={getTransactionStatus()}
          from={{
            subtitle: "My Ethereum address",
            value: getPartiallyHiddenEthereumAddress(
              getEthereumAddress(transaction.fromHezEthereumAddress)
            ),
          }}
          to={myHermezAddress}
          date={date}
        />
      );
    }
    case TxType.Transfer:
    case TxType.TransferToBJJ:
    case TxType.TransferToEthAddr: {
      const status = getTransactionStatus();
      const wasTransferSentByMe = accountIndex === transaction.fromAccountIndex;
      if (wasTransferSentByMe) {
        const from = { ...myHermezAddress, onCopyFromAddress: handleCopyFromAddress };
        const transferRecipientRow = getTransferRecipientRow();
        const to = transferRecipientRow && {
          ...transferRecipientRow,
          onCopyToAddress: handleCopyToAddress,
        };
        return (
          <TransactionInfoTable status={status} from={from} to={to} date={date} feeData={feeData} />
        );
      } else {
        const from = {
          subtitle: getPartiallyHiddenHermezAddress(transaction.fromHezEthereumAddress),
          onCopyFromAddress: handleCopyFromAddress,
        };
        const to = {
          subtitle: "My Hermez address",
          value: transaction.toHezEthereumAddress
            ? getPartiallyHiddenHermezAddress(transaction.toHezEthereumAddress)
            : undefined,
          onCopyToAddress: handleCopyToAddress,
        };
        return (
          <TransactionInfoTable status={status} from={from} to={to} date={date} feeData={feeData} />
        );
      }
    }
    case TxType.Exit: {
      return (
        <TransactionInfoTable
          status={getTransactionStatus()}
          from={myHermezAddress}
          to={{
            subtitle: "My Ethereum address",
            value: getPartiallyHiddenEthereumAddress(
              getEthereumAddress(transaction.fromHezEthereumAddress)
            ),
          }}
          date={date}
          feeData={feeData}
        />
      );
    }
    case TxType.Withdraw:
    case TxType.ForceExit: {
      return (
        <TransactionInfoTable
          status={getTransactionStatus()}
          from={myHermezAddress}
          to={{
            subtitle: "My Ethereum address",
            value: getPartiallyHiddenEthereumAddress(
              getEthereumAddress(transaction.fromHezEthereumAddress)
            ),
          }}
          date={date}
        />
      );
    }
    default: {
      return <></>;
    }
  }
}

export default TransactionInfo;

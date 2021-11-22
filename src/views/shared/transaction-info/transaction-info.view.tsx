import React from "react";
import { TxState, TxType } from "@hermeznetwork/hermezjs/src/enums";
import { getEthereumAddress } from "@hermeznetwork/hermezjs/src/addresses";
import { INTERNAL_ACCOUNT_ETH_ADDR } from "@hermeznetwork/hermezjs/src/constants";

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
  FiatExchangeRates,
  HistoryTransaction,
  PoolTransaction,
  isPoolTransaction,
  isHistoryTransaction,
} from "src/domain/hermez";

const TxStatus = {
  Confirmed: "Confirmed",
  Pending: "Pending",
  Invalid: "Invalid",
};

type Transaction = HistoryTransaction | PoolTransaction;

interface TransactionInfoProps {
  transaction: Transaction;
  fee?: number;
  accountIndex: string;
  preferredCurrency: string;
  fiatExchangeRates?: FiatExchangeRates;
  showStatus: boolean;
  showToCopyButton: boolean;
  showFromCopyButton: boolean;
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
  showToCopyButton,
  showFromCopyButton,
  onToCopyClick,
  onFromCopyClick,
}: TransactionInfoProps): JSX.Element {
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

      if (transaction.errorCode !== null) {
        return { subtitle: TxStatus.Invalid };
      }

      return { subtitle: TxStatus.Pending };
    }
  }

  function handleCopyToAddress() {
    const addressOrNull =
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

  function getTransferAddressToShow(): Row | undefined {
    if (
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
      if (accountIndex === transaction.fromAccountIndex) {
        return (
          <TransactionInfoTable
            status={getTransactionStatus()}
            from={myHermezAddress}
            to={getTransferAddressToShow()}
            date={date}
            fee={fee}
            token={transaction.token}
            preferredCurrency={preferredCurrency}
            fiatExchangeRates={fiatExchangeRates}
            showToCopyButton={showToCopyButton}
            showFromCopyButton={showFromCopyButton}
            onCopyToAddress={handleCopyToAddress}
            onCopyFromAddress={handleCopyFromAddress}
          />
        );
      } else {
        return (
          <TransactionInfoTable
            status={getTransactionStatus()}
            from={{
              subtitle: getPartiallyHiddenHermezAddress(transaction.fromHezEthereumAddress),
            }}
            to={{
              subtitle: "My Hermez address",
              value: transaction.toHezEthereumAddress
                ? getPartiallyHiddenHermezAddress(transaction.toHezEthereumAddress)
                : undefined,
            }}
            date={date}
            fee={fee}
            token={transaction.token}
            preferredCurrency={preferredCurrency}
            fiatExchangeRates={fiatExchangeRates}
          />
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
          fee={fee}
          token={transaction.token}
          preferredCurrency={preferredCurrency}
          fiatExchangeRates={fiatExchangeRates}
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

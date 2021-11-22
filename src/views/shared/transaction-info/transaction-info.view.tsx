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
  txData: Transaction;
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
  txData,
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
    subtitle: new Date(txData.timestamp).toLocaleString(),
  };
  const myHermezAddress: Row = {
    subtitle: "My Hermez address",
    value: getPartiallyHiddenHermezAddress(txData.fromHezEthereumAddress),
  };

  function getTransactionStatus(): Row | undefined {
    if (!showStatus) {
      return undefined;
    }

    if (isHistoryTransaction(txData)) {
      return { subtitle: TxStatus.Confirmed };
    } else {
      if (txData.state === TxState.Forged) {
        return { subtitle: TxStatus.Confirmed };
      }

      if (txData.errorCode) {
        return { subtitle: TxStatus.Invalid };
      }

      return { subtitle: TxStatus.Pending };
    }
  }

  function handleCopyToAddress() {
    const addressOrNull =
      txData.toHezEthereumAddress?.toLowerCase() === INTERNAL_ACCOUNT_ETH_ADDR.toLowerCase()
        ? txData.toBJJ
        : txData.toHezEthereumAddress;
    if (addressOrNull !== null) {
      copyToClipboard(addressOrNull);
      onToCopyClick();
    }
  }

  function handleCopyFromAddress() {
    copyToClipboard(txData.fromHezEthereumAddress);
    onFromCopyClick();
  }

  function getTransferAddressToShow(): Row | undefined {
    if (
      txData.toBJJ &&
      txData.toHezEthereumAddress?.toLowerCase() === INTERNAL_ACCOUNT_ETH_ADDR.toLowerCase()
    ) {
      return {
        subtitle: getPartiallyHiddenHermezAddress(txData.toBJJ),
      };
    } else if (txData.toHezEthereumAddress) {
      return {
        subtitle: getPartiallyHiddenHermezAddress(txData.toHezEthereumAddress),
      };
    } else if (
      isPoolTransaction(txData) &&
      txData.fromAccountIndex &&
      txData.fromAccountIndex === txData.toAccountIndex
    ) {
      return myHermezAddress;
    }
    return undefined;
  }

  const fee = isPoolTransaction(txData) ? txData.fee : undefined;
  const token = isPoolTransaction(txData) ? txData.token : undefined;

  switch (txData.type) {
    case TxType.CreateAccountDeposit:
    case TxType.Deposit: {
      return (
        <TransactionInfoTable
          status={getTransactionStatus()}
          from={{
            subtitle: "My Ethereum address",
            value: getPartiallyHiddenEthereumAddress(
              getEthereumAddress(txData.fromHezEthereumAddress)
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
      if (accountIndex === txData.fromAccountIndex) {
        return (
          <TransactionInfoTable
            status={getTransactionStatus()}
            from={myHermezAddress}
            to={getTransferAddressToShow()}
            date={date}
            fee={fee}
            token={token}
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
              subtitle: getPartiallyHiddenHermezAddress(txData.fromHezEthereumAddress),
            }}
            to={{
              subtitle: "My Hermez address",
              value: txData.toHezEthereumAddress
                ? getPartiallyHiddenHermezAddress(txData.toHezEthereumAddress)
                : undefined,
            }}
            date={date}
            fee={fee}
            token={token}
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
              getEthereumAddress(txData.fromHezEthereumAddress)
            ),
          }}
          date={date}
          fee={fee}
          token={token}
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
              getEthereumAddress(txData.fromHezEthereumAddress)
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

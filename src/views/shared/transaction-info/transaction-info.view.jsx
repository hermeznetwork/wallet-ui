import React from "react";
import { TxState, TxType } from "@hermeznetwork/hermezjs/src/enums";
import { getEthereumAddress } from "@hermeznetwork/hermezjs/src/addresses";
import { INTERNAL_ACCOUNT_ETH_ADDR } from "@hermeznetwork/hermezjs/src/constants";

import TransactionInfoTable from "../transaction-info-table/transaction-info-table.view";
import {
  getPartiallyHiddenEthereumAddress,
  getPartiallyHiddenHermezAddress,
} from "../../../utils/addresses";
import { copyToClipboard } from "../../../utils/browser";

const TxStatus = {
  Confirmed: "Confirmed",
  Pending: "Pending",
};

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
}) {
  const date = txData.timestamp && {
    subtitle: new Date(txData.timestamp).toLocaleString(),
  };

  function getTransactionStatus() {
    if (!showStatus) {
      return undefined;
    }

    if (!txData.state && txData.batchNum) {
      return { subtitle: TxStatus.Confirmed };
    }

    if (txData.state === TxState.Forged) {
      return { subtitle: TxStatus.Confirmed };
    }

    return { subtitle: TxStatus.Pending };
  }

  function handleCopyToAddress() {
    copyToClipboard(
      txData.toHezEthereumAddress.toLowerCase() === INTERNAL_ACCOUNT_ETH_ADDR.toLowerCase()
        ? txData.toBjj || txData.toBJJ
        : txData.toHezEthereumAddress
    );
    onToCopyClick();
  }

  function handleCopyFromAddress() {
    copyToClipboard(txData.fromHezEthereumAddress);
    onFromCopyClick();
  }

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
          to={{
            subtitle: "My Hermez address",
            value: getPartiallyHiddenHermezAddress(txData.fromHezEthereumAddress),
          }}
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
            from={{
              subtitle: "My Hermez address",
              value: getPartiallyHiddenHermezAddress(txData.fromHezEthereumAddress),
            }}
            to={{
              subtitle:
                txData.toHezEthereumAddress?.toLowerCase() ===
                INTERNAL_ACCOUNT_ETH_ADDR.toLowerCase()
                  ? getPartiallyHiddenHermezAddress(txData.toBjj || txData.toBJJ)
                  : getPartiallyHiddenHermezAddress(txData.toHezEthereumAddress),
            }}
            date={date}
            fee={txData.fee}
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
              value: getPartiallyHiddenHermezAddress(txData.toHezEthereumAddress),
            }}
            date={date}
            fee={txData.fee}
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
          from={{
            subtitle: "My Hermez address",
            value: getPartiallyHiddenHermezAddress(txData.fromHezEthereumAddress),
          }}
          to={{
            subtitle: "My Ethereum address",
            value: getPartiallyHiddenEthereumAddress(
              getEthereumAddress(txData.fromHezEthereumAddress)
            ),
          }}
          date={date}
          fee={txData.fee}
          estimatedWithdrawFee={txData.estimatedWithdrawFee}
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
          from={{
            subtitle: "My Hermez address",
            value: getPartiallyHiddenHermezAddress(txData.fromHezEthereumAddress),
          }}
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

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
  Invalid: "Invalid",
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
  const myHermezAddress = {
    subtitle: "My Hermez address",
    value: getPartiallyHiddenHermezAddress(txData.fromHezEthereumAddress),
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

    if (txData.errorCode) {
      return { subtitle: TxStatus.Invalid };
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

  function getTransferAddressToShow() {
    if (
      txData.toBJJ &&
      txData.toHezEthereumAddress.toLowerCase() === INTERNAL_ACCOUNT_ETH_ADDR.toLowerCase()
    ) {
      return {
        subtitle: getPartiallyHiddenHermezAddress(txData.toBJJ),
      };
    } else if (txData.toHezEthereumAddress) {
      return {
        subtitle: getPartiallyHiddenHermezAddress(txData.toHezEthereumAddress),
      };
    } else if (txData.fromAccountIndex && txData.fromAccountIndex === txData.toAccountIndex) {
      return myHermezAddress;
    }
    return null;
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
          from={myHermezAddress}
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

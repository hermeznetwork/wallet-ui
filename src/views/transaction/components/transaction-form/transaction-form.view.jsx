import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { getAccounts, getCreateAccountAuthorization } from "@hermeznetwork/hermezjs/src/api";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { isHermezBjjAddress } from "@hermeznetwork/hermezjs/src/addresses";
import { getProvider } from "@hermeznetwork/hermezjs/src/providers";
import { BigNumber, ethers } from "ethers";

import useTransactionFormStyles from "./transaction-form.styles";
import {
  getTokenAmountInPreferredCurrency,
  getFixedTokenAmount,
  CurrencySymbol,
} from "../../../../utils/currencies";
import { MAX_FEE_USD, ETHER_TOKEN_ID } from "../../../../constants";
import { ReactComponent as ErrorIcon } from "../../../../images/icons/error.svg";
import { ReactComponent as CloseIcon } from "../../../../images/icons/close.svg";
import { ReactComponent as QRScannerIcon } from "../../../../images/icons/qr-scanner.svg";
import Container from "../../../shared/container/container.view";
import QRScanner from "../../../shared/qr-scanner/qr-scanner.view";
import PrimaryButton from "../../../shared/primary-button/primary-button.view";
import Spinner from "../../../shared/spinner/spinner.view";
import * as addresses from "../../../../utils/addresses";
import * as browser from "../../../../utils/browser";
import Fee from "../fee/fee.view";
import Alert from "../../../shared/alert/alert.view";
import TransactionAmountInput from "../transaction-amount-input/transaction-amount-input.view";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";

function TransactionForm({
  transactionType,
  account,
  receiverAddress,
  preferredCurrency,
  fiatExchangeRates,
  accountBalanceTask,
  feesTask,
  tokensPriceTask,
  estimatedWithdrawFeeTask,
  estimatedDepositFeeTask,
  onLoadAccountBalance,
  onLoadFees,
  onLoadEstimatedWithdrawFee,
  onLoadEstimatedDepositFee,
  onSubmit,
  onGoToChooseAccountStep,
}) {
  const classes = useTransactionFormStyles();
  const [isVideoDeviceAvailable, setisVideoDeviceAvailable] = React.useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = React.useState(false);
  const [amount, setAmount] = useState(BigNumber.from(0));
  const [isAmountValid, setIsAmountValid] = useState(undefined);
  const [areFundsExceededDueToFee, setAreFundsExceededDueToFee] = useState(false);
  const [showInFiat, setShowInFiat] = useState(false);
  const [receiver, setReceiver] = useState("");
  const [isReceiverValid, setIsReceiverValid] = React.useState(undefined);
  const [doesReceiverExist, setDoesReceiverExist] = React.useState(undefined);
  const [doesUserHaveEnoughEthForWithdraw, setDoesUserHaveEnoughEthForWithdraw] =
    React.useState(undefined);
  const [gasPrice, setGasPrice] = React.useState(BigNumber.from(0));
  const [depositFee, setDepositFee] = React.useState(undefined);

  React.useEffect(() => {
    if (transactionType === TxType.Deposit) {
      onLoadEstimatedDepositFee();
    }
  }, []);

  React.useEffect(() => {
    if (estimatedDepositFeeTask.status === "successful") {
      setGasPrice(estimatedDepositFeeTask.data.gasPrice);
      setDepositFee(estimatedDepositFeeTask.data);
    }
  }, [estimatedDepositFeeTask]);

  React.useEffect(() => {
    onLoadFees();
    if (transactionType === TxType.Exit) {
      onLoadAccountBalance();
      onLoadEstimatedWithdrawFee(account.token, amount);
    }
  }, [transactionType, onLoadFees]);

  React.useEffect(() => {
    if (receiverAddress) {
      handleReceiverInputChange(receiverAddress);
    }
  }, [receiverAddress]);

  React.useEffect(() => {
    if (
      accountBalanceTask.status === "successful" &&
      estimatedWithdrawFeeTask.status === "successful"
    ) {
      const formattedEstimatedWithdrawFee = ethers.utils.formatUnits(
        estimatedWithdrawFeeTask.data.amount
      );

      setDoesUserHaveEnoughEthForWithdraw(accountBalanceTask.data >= formattedEstimatedWithdrawFee);
    }
  }, [accountBalanceTask, estimatedWithdrawFeeTask]);

  React.useEffect(() => {
    browser
      .isAnyVideoDeviceAvailable()
      .then(setisVideoDeviceAvailable)
      .catch(() => setisVideoDeviceAvailable(false));
  }, []);

  /**
   * Converts the account balance to fiat in the preferred currency
   * @returns {Number} - Accont balance in the preferred currency
   */
  function getAmountInFiat(amount) {
    return getTokenAmountInPreferredCurrency(
      Number(amount) / Math.pow(10, account.token.decimals),
      account.token.USD,
      preferredCurrency,
      fiatExchangeRates
    );
  }

  /**
   * Calculates the fee for the transaction.
   * It takes the appropriate recomended fee in USD from the coordinator
   * and converts it to token value.
   * @param {Object} fees - The recommended Fee object feturned by the Coordinator
   * @param {Boolean} iExistingAccount - Whether it's a existingAccount transfer
   * @returns {Number} - Transaction fee
   */
  function getFee(fees, isExistingAccount) {
    if (account.token.USD === 0) {
      return 0;
    }

    const feeApi =
      isExistingAccount || transactionType === TxType.Exit
        ? fees.existingAccount
        : isHermezBjjAddress(receiver)
        ? fees.createAccountInternal
        : fees.createAccount;
    // Limits the fee, in case a crazy fee is returned
    const fee = feeApi > MAX_FEE_USD ? MAX_FEE_USD : feeApi;
    return fee / account.token.USD;
  }

  /**
   * Checks whether the continue button should be disabled or not
   * @returns {boolean} - Whether the continue button should be disabled or not
   */
  function isContinueDisabled() {
    if (transactionType === TxType.Exit && doesUserHaveEnoughEthForWithdraw === false) {
      return false;
    } else if (transactionType !== TxType.Transfer && isAmountValid) {
      return false;
    } else if (isAmountValid && isReceiverValid && doesReceiverExist === undefined) {
      return false;
    } else {
      return true;
    }
  }

  function getReceiverInputValue() {
    return isReceiverValid ? addresses.getPartiallyHiddenHermezAddress(receiver) : receiver;
  }

  function handleAmountChange(data) {
    setShowInFiat(data.showInFiat);

    if (data.isUntouched) return;

    setAmount(data.amount.tokens);
    setIsAmountValid(!data.isInvalid);
    setAreFundsExceededDueToFee(data.areFundsExceededDueToFee);
  }

  /**
   * Checks if the receiver is a valid Hermez address. Change error state based on that.
   * Check if the continue button should be disabled
   * @param {Event|string} eventOrAddress - Change event of the receiver input or the pasted address
   * @returns {void}
   */
  function handleReceiverInputChange(eventOrAddress) {
    const newReceiverUntrimmed =
      typeof eventOrAddress === "string" ? eventOrAddress : event.target.value;
    const newReceiver = newReceiverUntrimmed.trim();

    if (newReceiver === "") {
      return handleDeleteClick();
    }

    if (addresses.isValidEthereumAddress(newReceiver)) {
      setReceiver(`hez:${newReceiver}`);
      setIsReceiverValid(true);
    } else if (addresses.isValidHermezAddress(newReceiver) || isHermezBjjAddress(newReceiver)) {
      setReceiver(newReceiver);
      setIsReceiverValid(true);
    } else {
      setReceiver(newReceiver);
      setIsReceiverValid(false);
    }
  }

  /**
   * Sets the receiver to the content read from the clipboard
   * @returns {void}
   */
  function handlePasteClick() {
    browser.readFromClipboard().then(handleReceiverInputChange);
  }

  /**
   * Sets the local state variable isQRScannerOpen to true when the user requests to open
   * the QR Scanner
   * @returns {void}
   */
  function handleOpenQRScanner() {
    setIsQRScannerOpen(true);
  }

  /**
   * Sets the local state variable isQRScannerOpen to false when the user requests to
   * close the QR Scanner
   * @returns {void}
   */
  function handleCloseQRScanner() {
    setIsQRScannerOpen(false);
  }

  /**
   * Sets the receiver local state variable with the scanned Hermez or Ethereum Address
   * @param {string} address - Scanned Hermez or Ethereum Address
   * @returns {void}
   */
  function handleReceiverScanningSuccess(address) {
    setIsQRScannerOpen(false);
    handleReceiverInputChange(address);
  }

  /**
   * Resets the receiver input when the delete button is clicked
   * @returns {void}
   */
  function handleDeleteClick() {
    setReceiver("");
    setIsReceiverValid(undefined);
    setDoesReceiverExist(undefined);
  }

  /**
   * Based on the type of transaction, prepares the necessary values (amount, receiver and
   * fee).
   * Communicate to TransactionLayout to display TransactionOverview.
   * @returns {void}
   */
  function handleContinueButton(fees) {
    switch (transactionType) {
      case TxType.Transfer: {
        const accountChecks = [
          getAccounts(receiver, [account.token.id]),
          ...(!isHermezBjjAddress(receiver)
            ? [getCreateAccountAuthorization(receiver).catch(() => ({}))]
            : []),
        ];
        return Promise.all(accountChecks).then((res) => {
          const receiverAccount = res[0]?.accounts[0];

          if (!receiverAccount && !res[1] && !isHermezBjjAddress(receiver)) {
            setDoesReceiverExist(false);
          } else {
            const transactionFee = getFee(fees, receiverAccount);

            onSubmit({
              amount: amount,
              from: { accountIndex: account.accountIndex },
              to:
                (isHermezBjjAddress(receiver) && { bjj: receiver }) ||
                receiverAccount ||
                (addresses.isValidHermezAddress(receiver) && { hezEthereumAddress: receiver }),
              fee: transactionFee,
            });
          }
        });
      }
      default: {
        const transactionFee = getFee(fees, true);
        return onSubmit({
          amount: amount,
          from: {},
          to: {},
          fee: transactionFee,
        });
      }
    }
  }

  return (
    <div className={classes.root}>
      <Container disableTopGutter>
        <section className={classes.sectionWrapper}>
          {feesTask.status === "successful" ? (
            <>
              <button className={classes.token} onClick={onGoToChooseAccountStep}>
                <p className={classes.tokenName}>{account.token.name}</p>
                {showInFiat ? (
                  <p>
                    <FiatAmount
                      currency={preferredCurrency}
                      amount={getAmountInFiat(account.balance)}
                    />
                  </p>
                ) : (
                  <p className={classes.tokenSymbolAmount}>
                    <span>{account.token.symbol}</span>{" "}
                    <span>{getFixedTokenAmount(account.balance, account.token.decimals)}</span>
                  </p>
                )}
              </button>
              {areFundsExceededDueToFee && transactionType === TxType.Deposit && (
                <Alert
                  message={`You don’t have enough ETH to cover deposit transaction fee (you need at least ${
                    depositFee && depositFee.amount
                  } ETH) ${
                    depositFee
                      ? ` ~ ${getTokenAmountInPreferredCurrency(
                          depositFee.amount,
                          depositFee.USD,
                          preferredCurrency,
                          fiatExchangeRates
                        )} ${CurrencySymbol[preferredCurrency].symbol}`
                      : ""
                  }`}
                />
              )}
              {transactionType === TxType.Exit &&
                doesUserHaveEnoughEthForWithdraw === false &&
                estimatedWithdrawFeeTask.status === "successful" && (
                  <Alert
                    message={`You don’t have enough ETH to cover withdrawal transaction fee (you need at least ${ethers.utils.formatUnits(
                      estimatedWithdrawFeeTask.data.amount
                    )} ETH)`}
                  />
                )}
              <form
                className={classes.form}
                onSubmit={(event) => {
                  event.preventDefault();
                  handleContinueButton(feesTask.data);
                }}
              >
                <TransactionAmountInput
                  transactionType={transactionType}
                  account={account}
                  fiatExchangeRates={fiatExchangeRates}
                  preferredCurrency={preferredCurrency}
                  fee={getFee(feesTask.data)}
                  onChange={handleAmountChange}
                  gasPrice={gasPrice}
                />
                {transactionType === TxType.Transfer && (
                  <div className={classes.receiverWrapper}>
                    <div className={classes.receiverInputWrapper}>
                      <input
                        disabled={isReceiverValid}
                        className={classes.receiver}
                        value={getReceiverInputValue()}
                        onChange={handleReceiverInputChange}
                        type="text"
                        placeholder="To hez:0x2387 ･･･ 5682"
                      />
                      <div className={classes.receiverButtons}>
                        {
                          // Pasting is not supported in firefox
                          receiver.length === 0 && !browser.isFirefox() && (
                            <button
                              type="button"
                              className={classes.receiverButton}
                              tabIndex="-1"
                              onClick={handlePasteClick}
                            >
                              Paste
                            </button>
                          )
                        }
                        {receiver.length > 0 && (
                          <button
                            type="button"
                            className={classes.receiverButton}
                            tabIndex="-1"
                            onClick={handleDeleteClick}
                          >
                            <CloseIcon className={classes.receiverDeleteButtonIcon} />
                          </button>
                        )}
                        {receiver.length === 0 && isVideoDeviceAvailable && (
                          <button
                            type="button"
                            className={classes.receiverButton}
                            tabIndex="-1"
                            onClick={handleOpenQRScanner}
                          >
                            <QRScannerIcon className={classes.receiverButtonIcon} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p
                      className={clsx({
                        [classes.errorMessage]: true,
                        [classes.receiverErrorMessageVisible]:
                          isReceiverValid === false || doesReceiverExist === false,
                      })}
                    >
                      <ErrorIcon className={classes.errorIcon} />
                      {isReceiverValid === false
                        ? "Please, enter a valid Hermez or Ethereum Address"
                        : doesReceiverExist === false
                        ? "Please, enter an existing address. Receiver needs to have signed in to Hermez Wallet at least once."
                        : ""}
                    </p>
                  </div>
                )}
                <PrimaryButton type="submit" label="Continue" disabled={isContinueDisabled()} />
              </form>
              <Fee
                transactionType={transactionType}
                amount={amount}
                fee={getFee(feesTask.data)}
                estimatedWithdrawFee={estimatedWithdrawFeeTask.data}
                token={account.token}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRates}
                showInFiat={showInFiat}
                tokensPriceTask={tokensPriceTask}
                depositFee={depositFee}
              />
            </>
          ) : (
            <Spinner />
          )}
        </section>
        {isVideoDeviceAvailable && isQRScannerOpen && (
          <QRScanner
            hideMyCode
            onSuccess={handleReceiverScanningSuccess}
            onClose={handleCloseQRScanner}
          />
        )}
      </Container>
    </div>
  );
}

TransactionForm.propTypes = {
  transactionType: PropTypes.string.isRequired,
  account: PropTypes.object.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired,
  feesTask: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default TransactionForm;

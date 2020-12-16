import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { getAccounts } from 'hermezjs/src/api'
import { getTokenAmountBigInt, getTokenAmountString } from 'hermezjs/src/utils'

import useTransactionFormStyles from './transaction-form.styles'
import { CurrencySymbol, getTokenAmountInPreferredCurrency, getFixedTokenAmount } from '../../../../utils/currencies'
import { ReactComponent as SwapIcon } from '../../../../images/icons/swap.svg'
import { ReactComponent as ErrorIcon } from '../../../../images/icons/error.svg'
import { ReactComponent as CloseIcon } from '../../../../images/icons/close.svg'
import { ReactComponent as QRScannerIcon } from '../../../../images/icons/qr-scanner.svg'
import { TransactionType } from '../../transaction.view'
import Container from '../../../shared/container/container.view'
import { isAnyVideoDeviceAvailable, readFromClipboard } from '../../../../utils/browser'
import QRScanner from '../../../shared/qr-scanner/qr-scanner.view'
import FormButton from '../../../shared/form-button/form-button.view'

function TransactionForm ({
  transactionType,
  account,
  receiverAddress,
  preferredCurrency,
  fiatExchangeRates,
  feesTask,
  onLoadFees,
  onSubmit
}) {
  const classes = useTransactionFormStyles()
  const [isVideoDeviceAvailable, setisVideoDeviceAvailable] = React.useState(false)
  const [isQRScannerOpen, setIsQRScannerOpen] = React.useState(false)
  const [showInFiat, setShowInFiat] = useState(false)
  const [amount, setAmount] = useState(undefined)
  const [receiver, setReceiver] = useState('')
  const [isAmountLessThanFunds, setIsAmountLessThanFunds] = React.useState(undefined)
  const [isAmountPositive, setIsAmountPositive] = React.useState(undefined)
  const [isReceiverValid, setIsReceiverValid] = React.useState(undefined)
  const amountInput = React.useRef()

  React.useEffect(() => {
    onLoadFees()
  }, [onLoadFees])

  React.useEffect(() => {
    if (amountInput.current) {
      amountInput.current.focus()
    }
  }, [amountInput])

  React.useEffect(() => {
    if (receiverAddress) {
      setReceiver(receiverAddress)
      setIsReceiverValid(true)
    }
  }, [receiverAddress])

  React.useEffect(() => {
    isAnyVideoDeviceAvailable()
      .then(setisVideoDeviceAvailable)
      .catch(() => setisVideoDeviceAvailable(false))
  }, [])

  /**
   * Converts the account balance to a number
   * @returns {number} - Account balance in number
   */
  function getAccountBalance () {
    return getTokenAmountString(account.balance, account.token.decimals)
  }

  /**
   * Returns the conversion rate from the selected token to the selected preferred
   * currency
   *
   * @returns {number} - Conversion rate from the selected token to fiat
   */
  function getAccountFiatRate () {
    return preferredCurrency === CurrencySymbol.USD.code
      ? account.token.USD
      : account.token.USD * fiatExchangeRates[preferredCurrency]
  }

  /**
   * Coonverts the account balance to fiat in the preferred currency
   * @returns {number} - Accont balance in the preferred currency
   */
  function getBalanceinFiat () {
    return getTokenAmountInPreferredCurrency(
      Number(account.balance) / Math.pow(10, account.token.decimals),
      account.token.USD,
      preferredCurrency,
      fiatExchangeRates
    )
  }

  /**
   * Calculates the fee for the transaction.
   * It takes the appropriate recomended fee in USD from the coordinator
   * and converts it to token value.
   * @returns {number} - Transaction fee
   */
  function getFee (fees) {
    return fees.existingAccount / account.token.USD
  }

  /**
   * Checks whether a Hermez address has a valid format
   * @param {string} address - Hermez address e.g. hez:0x9294cD558F2Db6ca403191Ae3502cD0c2251E995
   * @returns {boolean} - Result of the test
   */
  function isValidHermezAddress (address) {
    return /^hez:0x[a-fA-F0-9]{40}$/.test(address)
  }

  /**
   * Checks whether the continue button should be disabled or not
   * @returns {boolean} - Whether the continue button should be disabled or not
   */
  function isContinueDisabled () {
    const isAmountValid = isAmountLessThanFunds && isAmountPositive

    if (transactionType !== TransactionType.Transfer && isAmountValid) {
      return false
    } else if (isAmountValid && isReceiverValid) {
      return false
    } else {
      return true
    }
  }

  /**
   * When the amount changes, check if the Continue button should be enabled or not.
   * Checks if the user has the selected amount in their balance
   * and the receiver is a registered Hermez account.
   * Checks if the continue button should be disabled.
   * @param {Event} event - Change event of the transaction amount input
   * @returns {void}
   */
  function handleAmountInputChange (event) {
    const newAmount = Number(event.target.value)
    const newAmountInToken = (showInFiat) ? (newAmount / getAccountFiatRate()) : newAmount

    setIsAmountLessThanFunds(newAmountInToken <= getAccountBalance())
    setIsAmountPositive(event.target.value === '' ? undefined : newAmountInToken > 0)
    setAmount(event.target.value)
  }

  /**
   * Sets the amount to the full balance in the account, whether in the preferred fiat
   * currency or the token value.
   * Checks if the continue button should be disabled.
   * @returns {void}
   */
  function handleSendAllButtonClick () {
    const inputAmount = showInFiat ? getBalanceinFiat() : getAccountBalance()

    setIsAmountLessThanFunds(true)
    setIsAmountPositive(true)
    setAmount(inputAmount)
  }

  /**
   * Change between fiat and the token value.
   * @returns {void}
   */
  function handleChangeCurrencyButtonClick () {
    if (showInFiat) {
      setAmount(amount / getAccountFiatRate())
    } else {
      setAmount(amount * getAccountFiatRate())
    }
    setShowInFiat(!showInFiat)
  }

  /**
   * Checks if the receiver is a valid Hermez address. Change error state based on that.
   * Check if the continue button should be disabled
   * @param {Event} event - Change event of the receiver input
   * @returns {void}
   */
  function handleReceiverInputChange (event) {
    const newReceiver = event.target.value.trim()

    setIsReceiverValid(newReceiver === '' ? undefined : isValidHermezAddress(newReceiver))
    setReceiver(newReceiver)
  }

  /**
   * Sets the receiver to the content read from the clipboard
   * @returns {void}
   */
  function handlePasteClick () {
    readFromClipboard().then((pastedContent) => {
      setIsReceiverValid(isValidHermezAddress(pastedContent))
      setReceiver(pastedContent)
    })
  }

  /**
   * Sets the local state variable isQRScannerOpen to true when the user requests to open
   * the QR Scanner
   * @returns {void}
   */
  function handleOpenQRScanner () {
    setIsQRScannerOpen(true)
  }

  /**
   * Sets the local state variable isQRScannerOpen to false when the user requests to
   * close the QR Scanner
   * @returns {void}
   */
  function handleCloseQRScanner () {
    setIsQRScannerOpen(false)
  }

  /**
   * Sets the receiver local state variable with the scanned Hermez Ethereum Address
   * @param {string} hermezEthereumAddress - Scanned Hermez Ethereum Address
   * @returns {void}
   */
  function handleReceiverScanningSuccess (hermezEthereumAddress) {
    setIsQRScannerOpen(false)
    setReceiver(hermezEthereumAddress)
  }

  /**
   * Resets the receiver input when the delete button is clicked
   * @returns {void}
   */
  function handleDeleteClick () {
    setReceiver('')
    setIsReceiverValid(undefined)
  }

  /**
   * Based on the type of transaction, prepares the necessary values (amount, receiver and
   * fee).
   * Communicate to TransactionLayout to display TransactionOverview.
   * @returns {void}
   */
  function handleContinueButton (fees) {
    const selectedAmount = (showInFiat) ? (amount / getAccountFiatRate()) : amount
    const transactionAmount = getTokenAmountBigInt(selectedAmount.toString(), account.token.decimals).toString()
    const transactionFee =
      transactionType === TransactionType.Deposit || transactionType === TransactionType.ForceExit
        ? undefined
        : getTokenAmountBigInt(getFee(fees).toFixed(account.token.decimals), account.token.decimals).toString()

    switch (transactionType) {
      case TransactionType.Transfer: {
        return getAccounts(receiver, [account.tokenId])
          .then((res) => {
            const receiverAccount = res.accounts[0]

            if (receiverAccount) {
              onSubmit({
                amount: transactionAmount,
                to: receiverAccount,
                fee: transactionFee
              })
            } else {
              setIsReceiverValid(false)
            }
          })
          .catch(() => setIsReceiverValid(false))
      }
      default: {
        return onSubmit({
          amount: transactionAmount,
          to: {},
          fee: transactionFee
        })
      }
    }
  }

  /**
   * Renders the receiver input field if it's a transfer.
   * @returns {JSX.Element} The receiver input field
   */
  function renderReceiver () {
    if (transactionType === TransactionType.Transfer) {
      return (
        <div className={classes.receiverWrapper}>
          <div className={clsx({
            [classes.receiverInputWrapper]: true,
            [classes.receiverError]: isReceiverValid === false
          })}
          >
            <input
              className={classes.receiver}
              value={receiver}
              onChange={handleReceiverInputChange}
              type='text'
              placeholder='To hez:0x2387 ･･･ 5682'
            />
            <div className={classes.receiverButtons}>
              {
                // Pasting is not supported in firefox
                !receiver.length && !(navigator.userAgent.match(/firefox/i)) && (
                  <button
                    type='button'
                    className={classes.receiverButton}
                    onClick={handlePasteClick}
                  >
                    Paste
                  </button>
                )
              }
              {
                receiver.length > 0 && (
                  <button
                    type='button'
                    className={classes.receiverButton}
                    onClick={handleDeleteClick}
                  >
                    <CloseIcon className={classes.receiverDeleteButtonIcon} />
                  </button>
                )
              }
              {!receiver.length && (
                <button
                  type='button'
                  className={classes.receiverButton}
                  onClick={handleOpenQRScanner}
                  disabled={!isVideoDeviceAvailable}
                >
                  <QRScannerIcon className={classes.receiverButtonIcon} />
                </button>
              )}
            </div>
          </div>

          <p className={clsx({
            [classes.errorMessage]: true,
            [classes.receiverErrorMessageVisible]: isReceiverValid === false
          })}
          >
            <ErrorIcon className={classes.errorIcon} />
            Please enter a valid address.
          </p>
        </div>
      )
    }
  }

  /**
   * Renders the fee selector if it' s a Layer 2 transaction.
   * @returns {JSX.Element} The fee selector component
   */
  function renderFeeSelector (fees) {
    if (transactionType !== TransactionType.Deposit && transactionType !== TransactionType.ForceExit) {
      return (
        <div className={classes.feeWrapper}>
          <p className={classes.fee}>
            Fee {Number(getFee(fees)).toFixed(6)} {account.token.symbol}
          </p>
        </div>
      )
    }
  }

  return (
    <div className={classes.root}>
      <Container disableTopGutter>
        <section className={classes.sectionWrapper}>
          <div className={classes.token}>
            <p className={classes.tokenName}>{account.token.name}</p>
            {
              showInFiat
                ? <p><span>{preferredCurrency}</span> <span>{getBalanceinFiat().toFixed(2)}</span></p>
                : <p><span>{account.token.symbol}</span> <span>{getFixedTokenAmount(account.balance, account.token.decimals)}</span></p>
            }
          </div>
          <form onSubmit={(event) => {
            event.preventDefault()
            if (feesTask.status === 'successful') {
              handleContinueButton(feesTask.data)
            }
          }}
          >
            <div className={clsx({
              [classes.selectAmount]: true,
              [classes.selectAmountError]: isAmountPositive === false || isAmountLessThanFunds === false
            })}
            >
              <div className={classes.amount}>
                <p className={classes.amountCurrency}>{(showInFiat) ? preferredCurrency : account.token.symbol}</p>
                <input
                  ref={amountInput}
                  className={classes.amountInput}
                  value={amount || ''}
                  placeholder='0.00'
                  type='number'
                  onChange={handleAmountInputChange}
                />
              </div>
              <div className={classes.amountButtons}>
                <button
                  type='button'
                  className={`${classes.amountButton} ${classes.sendAll}`}
                  onClick={handleSendAllButtonClick}
                >
                  Send All
                </button>
                <button
                  type='button'
                  className={`${classes.amountButton} ${classes.changeCurrency}`}
                  onClick={handleChangeCurrencyButtonClick}
                >
                  <SwapIcon className={classes.changeCurrencyIcon} />
                  <p>{(showInFiat) ? account.token.symbol : preferredCurrency}</p>
                </button>
              </div>
            </div>
            <p className={clsx({
              [classes.errorMessage]: true,
              [classes.selectAmountErrorMessageVisible]: isAmountPositive === false || isAmountLessThanFunds === false
            })}
            >
              <ErrorIcon className={classes.errorIcon} />
              {
                isAmountPositive === false
                  ? 'The amount should be positive'
                  : isAmountLessThanFunds === false
                    ? "You don't have enough funds"
                    : ''
              }
            </p>
            {renderReceiver()}
            <FormButton
              type='submit'
              label='Continue'
              disabled={isContinueDisabled()}
            />
          </form>
          {feesTask.status === 'successful' && renderFeeSelector(feesTask.data)}
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
  )
}

TransactionForm.propTypes = {
  transactionType: PropTypes.string.isRequired,
  account: PropTypes.object.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired,
  feesTask: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
}

export default TransactionForm

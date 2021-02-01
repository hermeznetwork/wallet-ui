import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { getAccounts } from '@hermeznetwork/hermezjs/src/api'
import { getTokenAmountBigInt } from '@hermeznetwork/hermezjs/src/utils'

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
import Spinner from '../../../shared/spinner/spinner.view'

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
  const [amount, setAmount] = useState()
  const [receiver, setReceiver] = useState('')
  const [isAmountLessThanFunds, setIsAmountLessThanFunds] = React.useState(undefined)
  const [isAmountPositive, setIsAmountPositive] = React.useState(undefined)
  const [isReceiverValid, setIsReceiverValid] = React.useState(undefined)
  const amountInput = React.useRef(undefined)

  React.useEffect(() => {
    onLoadFees()
  }, [onLoadFees])

  React.useEffect(() => {
    if (feesTask.status === 'successful' && amountInput.current) {
      amountInput.current.focus()
    }
  }, [feesTask])

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
    return getFixedTokenAmount(account.balance, account.token.decimals)
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
  function getAmountInFiat (amount) {
    return getTokenAmountInPreferredCurrency(
      Number(amount) / Math.pow(10, account.token.decimals),
      account.token.USD,
      preferredCurrency,
      fiatExchangeRates
    )
  }

  /**
   * Calculates the fee for the transaction.
   * It takes the appropriate recomended fee in USD from the coordinator
   * and converts it to token value.
   * @param {Object} fees - The recommended Fee object feturned by the Coordinator
   * @param {Boolean} createAccount - Whether it's a createAccount transfer
   * @returns {number} - Transaction fee
   */
  function getFee (fees, createAccount) {
    if (account.token.USD === 0) {
      return 0
    }

    const fee = createAccount ? fees.createAccount : fees.existingAccount

    return fee / account.token.USD
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

  function getAmountInputValue () {
    if (amount === undefined) {
      return ''
    }
    if (showInFiat) {
      return amount.toFixed(2)
    } else {
      return amount
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
    if (event.target.value === '') {
      setIsAmountPositive(undefined)
      setIsAmountLessThanFunds(undefined)
      setAmount(undefined)
    } else {
      const newAmount = Number(event.target.value)
      const newAmountInToken = showInFiat ? (newAmount / getAccountFiatRate()) : newAmount

      setIsAmountLessThanFunds(newAmountInToken <= getAccountBalance())
      setIsAmountPositive(newAmountInToken > 0)
      setAmount(newAmount)
    }
  }

  /**
   * Sets the amount to the full balance in the account, whether in the preferred fiat
   * currency or the token value.
   * Checks if the continue button should be disabled.
   * @returns {void}
   */
  function handleSendAllButtonClick () {
    if (showInFiat) {
      const maxAmount = getAmountInFiat(account.balance)
      const fee = getAmountInFiat(getFee(feesTask.data))
      const newAmount = maxAmount - fee

      setAmount(newAmount)
    } else {
      const maxAmount = getAccountBalance()
      const fee = getFixedTokenAmount(getFee(feesTask.data), account.token.decimals)
      const newAmount = Number(maxAmount) - Number(fee)

      setAmount(newAmount)
    }

    setIsAmountLessThanFunds(true)
    setIsAmountPositive(true)
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
    const selectedAmount = showInFiat ? (amount / getAccountFiatRate()) : amount
    const transactionAmount = getTokenAmountBigInt(selectedAmount.toString(), account.token.decimals).toString()

    switch (transactionType) {
      case TransactionType.Transfer: {
        return getAccounts(receiver, [account.token.id])
          .then((res) => {
            const receiverAccount = res.accounts[0]
            const transactionFee = getTokenAmountBigInt(getFee(fees, !receiverAccount).toFixed(account.token.decimals), account.token.decimals).toString()

            onSubmit({
              amount: transactionAmount,
              to: receiverAccount || { hezEthereumAddress: receiver },
              fee: transactionFee
            })
          })
      }
      default: {
        const transactionFee = getTokenAmountBigInt(getFee(fees).toFixed(account.token.decimals), account.token.decimals).toString()
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

  return (
    <div className={classes.root}>
      <Container disableTopGutter>
        <section className={classes.sectionWrapper}>
          {(() => {
            switch (feesTask.status) {
              case 'successful': {
                return (
                  <>
                    <div className={classes.token}>
                      <p className={classes.tokenName}>{account.token.name}</p>
                      {
                        showInFiat
                          ? <p><span>{preferredCurrency}</span> <span>{getAmountInFiat(account.balance).toFixed(2)}</span></p>
                          : <p><span>{account.token.symbol}</span> <span>{getFixedTokenAmount(account.balance, account.token.decimals)}</span></p>
                      }
                    </div>
                    <form
                      className={classes.form}
                      onSubmit={(event) => {
                        event.preventDefault()
                        handleContinueButton(feesTask.data)
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
                            value={getAmountInputValue()}
                            placeholder='0.00'
                            type='number'
                            onChange={handleAmountInputChange}
                          />
                        </div>
                        <div className={classes.amountButtons}>
                          <button
                            type='button'
                            className={classes.amountButton}
                            onClick={handleSendAllButtonClick}
                          >
                            Max
                          </button>
                          <div className={classes.amountButton}>
                            <p>
                              <span>{showInFiat ? ((amount || 0) / getAccountFiatRate()) : ((amount || 0) * getAccountFiatRate()).toFixed(2)}</span> <span>{(showInFiat) ? account.token.symbol : preferredCurrency}</span>
                            </p>
                          </div>
                          <button
                            type='button'
                            className={`${classes.amountButton} ${classes.changeCurrency}`}
                            onClick={handleChangeCurrencyButtonClick}
                          >
                            <SwapIcon className={classes.changeCurrencyIcon} />
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
                    {
                      transactionType !== TransactionType.Deposit && transactionType !== TransactionType.ForceExit && (
                        <div className={classes.feeWrapper}>
                          <p className={classes.fee}>
                            Fee {getFixedTokenAmount(getFee(feesTask.data), account.token.decimals)}
                          </p>
                        </div>
                      )
                    }
                  </>
                )
              }
              default: {
                return <Spinner />
              }
            }
          })()}
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

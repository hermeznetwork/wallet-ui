import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { getAccounts, getCreateAccountAuthorization } from '@hermeznetwork/hermezjs/src/api'
import { getTokenAmountBigInt, getTokenAmountString } from '@hermeznetwork/hermezjs/src/utils'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'
import { HermezCompressedAmount } from '@hermeznetwork/hermezjs/src/hermez-compressed-amount'

import useTransactionFormStyles from './transaction-form.styles'
import { CurrencySymbol, getTokenAmountInPreferredCurrency, getFixedTokenAmount } from '../../../../utils/currencies'
import { ReactComponent as SwapIcon } from '../../../../images/icons/swap.svg'
import { ReactComponent as ErrorIcon } from '../../../../images/icons/error.svg'
import { ReactComponent as CloseIcon } from '../../../../images/icons/close.svg'
import { ReactComponent as QRScannerIcon } from '../../../../images/icons/qr-scanner.svg'
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
  const [amountFiat, setAmountFiat] = useState()
  const [receiver, setReceiver] = useState('')
  const [isAmountLessThanFunds, setIsAmountLessThanFunds] = React.useState(undefined)
  const [isAmountPositive, setIsAmountPositive] = React.useState(undefined)
  const [isAmountCompressedValid, setIsAmountCompressedValid] = React.useState(undefined)
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
   * Converts the account balance to fiat in the preferred currency
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
   * @param {Boolean} iExistingAccount - Whether it's a existingAccount transfer
   * @returns {number} - Transaction fee
   */
  function getFee (fees, isExistingAccount) {
    if (account.token.USD === 0) {
      return 0
    }

    const fee = isExistingAccount ? fees.existingAccount : fees.createAccount

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

    if (transactionType !== TxType.Transfer && isAmountValid) {
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
    return showInFiat ? Number(amountFiat.toFixed(2)) : Number(getTokenAmountString(amount, account.token.decimals))
  }

  /**
   * Checks whether the selected amount is supported by the compression
   * used in the Hermez network
   * @param {Number} amount - Selector amount
   * @returns {Boolean} Whether it is valid
   */
  function getIsAmountCompressedValid (amount) {
    try {
      const compressedAmount = HermezCompressedAmount.compressAmount(amount)
      const decompressedAmount = HermezCompressedAmount.decompressAmount(compressedAmount)
      return amount.toString() === decompressedAmount.toString()
    } catch (e) {
      return false
    }
  }

  /**
   * Makes the appropriate checks that the amount is valid
   * @param {ethers.BigNumber} newAmount - The new amount as a BigNumber
   */
  function setAmountChecks (newAmount) {
    // Convert from ethers.BigNumber to native BigInt
    const newAmountBigInt = BigInt(newAmount.toString())
    setIsAmountPositive(newAmountBigInt >= 0)
    setIsAmountCompressedValid(getIsAmountCompressedValid(newAmountBigInt))
    setIsAmountLessThanFunds(newAmountBigInt <= BigInt(account.balance.toString()))
  }

  /**
   * Resets the local state
   */
  function resetAmounts () {
    setIsAmountPositive(undefined)
    setIsAmountLessThanFunds(undefined)
    setIsAmountCompressedValid(undefined)
    setAmount(undefined)
    setAmountFiat(undefined)
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
      resetAmounts()
    } else if (showInFiat) {
      const newAmountInFiat = Number(Number(event.target.value).toFixed(2))
      // Makes sure the converted amount from fiat to tokens is a valid amount in Hermez
      const newAmountConversion = Number((newAmountInFiat / getAccountFiatRate()).toFixed(10))
      const newAmountInToken = getTokenAmountBigInt(newAmountConversion.toString(), account.token.decimals)

      setAmountChecks(newAmountInToken)
      setAmount(newAmountInToken)
      setAmountFiat(newAmountInFiat)
    } else {
      const newAmountInToken = getTokenAmountBigInt(event.target.value, account.token.decimals).toString()
      const newAmountInFiat = getAmountInFiat(newAmountInToken)

      setAmountChecks(newAmountInToken)
      setAmount(newAmountInToken)
      setAmountFiat(newAmountInFiat)
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
      const newAmountInFiat = maxAmount - fee
      // Makes sure the converted amount from fiat to tokens is a valid amount in Hermez
      const newAmountConversion = Number((newAmountInFiat / getAccountFiatRate()).toFixed(10))
      const newAmountInToken = getTokenAmountBigInt(newAmountConversion.toString(), account.token.decimals)

      setAmountChecks(newAmountInToken)
      setAmount(newAmountInToken)
      setAmountFiat(newAmountInFiat)
    } else {
      const maxAmount = getAccountBalance()
      const fee = getFixedTokenAmount(getFee(feesTask.data), account.token.decimals)
      const newAmountInToken = getTokenAmountBigInt((Number(maxAmount) - Number(fee)).toString(), account.token.decimals)
      const newAmountInFiat = getAmountInFiat(newAmountInToken)

      setAmountChecks(newAmountInToken)
      setAmount(newAmountInToken)
      setAmountFiat(newAmountInFiat)
    }
  }

  /**
   * Change between fiat and the token value.
   * @returns {void}
   */
  function handleChangeCurrencyButtonClick () {
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
    if (amount === BigInt(0)) {
      setIsAmountPositive(false)
      return
    }

    switch (transactionType) {
      case TxType.Transfer: {
        const accountChecks = [
          getAccounts(receiver, [account.token.id]),
          getCreateAccountAuthorization(receiver)
        ]
        return Promise.all(accountChecks)
          .then((res) => {
            const receiverAccount = res[0].accounts[0]
            const transactionFee = getTokenAmountBigInt(getFee(fees, receiverAccount).toFixed(account.token.decimals), account.token.decimals).toString()

            onSubmit({
              amount: amount,
              to: receiverAccount || { hezEthereumAddress: receiver },
              fee: transactionFee
            })
          })
          .catch(() => {
            setIsReceiverValid(false)
          })
      }
      default: {
        const transactionFee = getTokenAmountBigInt(getFee(fees).toFixed(account.token.decimals), account.token.decimals).toString()
        return onSubmit({
          amount: amount,
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
    if (transactionType === TxType.Transfer) {
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
            Please enter a valid address (e.g. hez:0x380ed8Bd696c78395Fb1961BDa42739D2f5242a1). Receiver needs to have signed in to Hermez Wallet at least once.
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
                          : <p className={classes.tokenSymbolAmount}><span>{account.token.symbol}</span> <span>{getFixedTokenAmount(account.balance, account.token.decimals)}</span></p>
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
                            onFocus={(e) => { e.target.placeholder = '' }}
                            onBlur={(e) => { e.target.placeholder = '0.00' }}
                          />
                        </div>
                        <div className={classes.amountButtons}>
                          <button
                            type='button'
                            className={`${classes.amountButtonsItem} ${classes.amountButton} ${classes.amountMax}`}
                            onClick={handleSendAllButtonClick}
                          >
                            Max
                          </button>
                          <div className={classes.amountButtonsItem}>
                            <p>
                              <span>{showInFiat ? (getFixedTokenAmount(amount || 0, account.token.decimals)) : (amountFiat || 0).toFixed(2)} </span>
                              <span>{(showInFiat) ? account.token.symbol : preferredCurrency}</span>
                            </p>
                          </div>
                          <button
                            type='button'
                            className={`${classes.amountButtonsItem} ${classes.amountButton} ${classes.changeCurrency}`}
                            onClick={handleChangeCurrencyButtonClick}
                          >
                            <SwapIcon className={classes.changeCurrencyIcon} />
                          </button>
                        </div>
                      </div>
                      <p className={clsx({
                        [classes.errorMessage]: true,
                        [classes.selectAmountErrorMessageVisible]: isAmountPositive === false || isAmountLessThanFunds === false || isAmountCompressedValid === false
                      })}
                      >
                        <ErrorIcon className={classes.errorIcon} />
                        {
                          isAmountPositive === false
                            ? 'The amount should be positive'
                            : isAmountLessThanFunds === false
                              ? 'You don\'t have enough funds'
                              : isAmountCompressedValid === false
                                ? 'The amount introduced is not supported by Hermez\'s compression algorithm. It needs to have a maximum of 10 significant digits'
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
                      transactionType !== TxType.Deposit && transactionType !== TxType.ForceExit && (
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

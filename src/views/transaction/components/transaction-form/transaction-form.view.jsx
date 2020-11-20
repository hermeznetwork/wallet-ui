import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { getAccounts } from 'hermezjs/src/api'
import { getTokenAmountBigInt, getTokenAmountString } from 'hermezjs/src/utils'

import useTransactionFormStyles from './transaction-form.styles'
import { CurrencySymbol, getTokenAmountInPreferredCurrency, getFixedTokenAmount } from '../../../../utils/currencies'
import swapIcon from '../../../../images/icons/swap.svg'
import errorIcon from '../../../../images/icons/error.svg'
import closeIcon from '../../../../images/icons/close.svg'
import { TransactionType } from '../../transaction.view'
import Container from '../../../shared/container/container.view'
import { readFromClipboard } from '../../../../utils/browser'

function TransactionForm ({
  transactionType,
  account,
  preferredCurrency,
  fiatExchangeRates,
  feesTask,
  onLoadFees,
  onSubmit
}) {
  const classes = useTransactionFormStyles()
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
   * Checks whether continue button should be disabled or not
   * @returns {boolean} - Whether continue button should be disabled or not
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
        : getTokenAmountBigInt(getFee(fees).toString()).toString()

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

            <button
              type='button'
              className={clsx({
                [classes.receiverPaste]: true,
                [classes.receiverPasteVisible]: receiver.length === 0 && !(navigator.userAgent.match(/firefox/i))
              })}
              onClick={handlePasteClick}
            >
              Paste
            </button>
            <button
              type='button'
              className={clsx({
                [classes.receiverDelete]: true,
                [classes.receiverDeleteVisible]: receiver.length > 0
              })}
              onClick={handleDeleteClick}
            >
              <img
                className={classes.receiverDeleteIcon}
                src={closeIcon}
                alt='Close Icon'
              />
            </button>
          </div>

          <p className={clsx({
            [classes.errorMessage]: true,
            [classes.receiverErrorMessageVisible]: isReceiverValid === false
          })}
          >
            <img
              className={classes.errorIcon}
              src={errorIcon}
              alt='Error Icon'
            />
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
                  <img
                    className={classes.changeCurrencyIcon}
                    src={swapIcon}
                    alt='Swap Icon'
                  />
                  <p>{(showInFiat) ? account.token.symbol : preferredCurrency}</p>
                </button>
              </div>
            </div>
            <p className={clsx({
              [classes.errorMessage]: true,
              [classes.selectAmountErrorMessageVisible]: isAmountPositive === false || isAmountLessThanFunds === false
            })}
            >
              <img
                className={classes.errorIcon}
                src={errorIcon}
                alt='Error Icon'
              />
              {
                isAmountPositive === false
                  ? 'The amount should be positive'
                  : isAmountLessThanFunds === false
                    ? "You don't have enough funds"
                    : ''
              }
            </p>
            {renderReceiver()}
            <button
              type='submit'
              className={classes.continue}
              disabled={isContinueDisabled()}
            >
              Continue
            </button>
          </form>
          {feesTask.status === 'successful' && renderFeeSelector(feesTask.data)}
        </section>
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

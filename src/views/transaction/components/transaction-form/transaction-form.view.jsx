import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import useTransactionFormStyles from './transaction-form.styles'
import { getAccounts } from '../../../../apis/rollup'
import { CurrencySymbol, getTokenAmountInPreferredCurrency } from '../../../../utils/currencies'
import swapIcon from '../../../../images/icons/swap.svg'
import errorIcon from '../../../../images/icons/error.svg'
import closeIcon from '../../../../images/icons/close.svg'

function TransactionForm ({
  type,
  account,
  preferredCurrency,
  fiatExchangeRates,
  fees,
  onSubmit
}) {
  const classes = useTransactionFormStyles()
  const [showInFiat, setShowInFiat] = useState(false)
  const [amount, setAmount] = useState(0)
  const [receiver, setReceiver] = useState('')
  const [isAmountInvalid, setIsAmountInvalid] = React.useState()
  const [isReceiverInvalid, setIsReceiverInvalid] = React.useState()

  function getAccountBalance () {
    return Number(account.balance)
  }

  /**
   * Returns the conversion rate from the selected token to the selected preffered currency.
   *
   * @returns {Number} Conversion rate from the selected token to fiat
   */
  function getAccountFiatRate () {
    const USDRate = account.balanceUSD / getAccountBalance()
    return preferredCurrency === CurrencySymbol.USD.code
      ? USDRate
      : USDRate * fiatExchangeRates[preferredCurrency]
  }

  function getBalanceinFiat () {
    return getTokenAmountInPreferredCurrency(
      preferredCurrency,
      account.balanceUSD,
      fiatExchangeRates
    )
  }

  /**
   * Calculate the fee for the transaction.
   * It takes the appropriate recomended fee in USD from the coordinator
   * and converts it to token value.
   */
  function getFee () {
    return fees.existingAccount / account.balanceUSD
  }

  /**
   * Checks whether a Hermez address has a valid format
   *
   * @param {string} address - Hermez address e.g. hez:0x9294cD558F2Db6ca403191Ae3502cD0c2251E995
   */
  function isValidHermezAddress (address) {
    return /^hez:0x[a-fA-F0-9]{40}$/.test(address)
  }

  /**
   * Checks whether continue button should be disabled or not
   *
   * @returns {Boolean} Whether continue button should be disabled or not
   */
  function isContinueDisabled () {
    const amountValid = isAmountInvalid === false && amount > 0
    const receiverValid = isReceiverInvalid === false
    if (type === 'deposit' && amountValid) {
      return false
    } else if (amountValid && receiverValid) {
      return false
    } else {
      return true
    }
  }

  /**
   * When the amount changes, check if the Continue button should be enabled or not.
   * Checks if the user has the selected amount in their balance
   * and the receiver is a registered Hermez account.
   * Check if the continue button should be disabled.
   *
   * @param {Event} event
   */
  function handleAmountInputChange (event) {
    const newAmount = Number(event.target.value)
    const newAmountInToken = (showInFiat) ? (newAmount / getAccountFiatRate()) : newAmount
    if (newAmountInToken >= 0 && newAmountInToken <= getAccountBalance()) {
      setIsAmountInvalid(false)
    } else {
      setIsAmountInvalid(true)
    }

    event.target.value = newAmount
    setAmount(newAmount)
  }

  /**
   * Sets the amount to the full balance in the account, whether in the preferred fiat currency or the token value.
   * Check if the continue button should be disabled.
   */
  function handleSendAllButtonClick () {
    const inputAmount = showInFiat ? getBalanceinFiat() : getAccountBalance()
    setIsAmountInvalid(false)
    setAmount(inputAmount)
  }

  /**
   * Change between fiat and the token value.
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
   *
   * @param {Event} event
   */
  function handleReceiverInputChange (event) {
    const newReceiver = event.target.value.trim()
    if (!isValidHermezAddress(newReceiver)) {
      setIsReceiverInvalid(true)
    } else {
      setIsReceiverInvalid(false)
    }

    event.target.value = newReceiver
    setReceiver(newReceiver)
  }

  function handlePasteClick () {
    navigator.clipboard.readText().then((pastedContent) => {
      if (!isValidHermezAddress(pastedContent)) {
        setIsReceiverInvalid(true)
      } else {
        setIsReceiverInvalid(false)
      }
      setReceiver(pastedContent)
    })
  }

  function handleDeleteClick () {
    setReceiver('')
  }

  /**
   * Based on the type of transaction, prepares the necessary values (amount, receiver and fee).
   * Communicate to TransactionLayout to display TransactionOverview.
   */
  async function handleContinueButton () {
    const selectedAmount = (showInFiat) ? (amount / getAccountFiatRate()) : amount

    if (type !== 'deposit') {
      try {
        const accountsData = await getAccounts(receiver)
        if (accountsData.accounts.length > 0) {
          onSubmit({
            amount: selectedAmount,
            to: receiver,
            fee: getFee()
          })
        } else {
          throw new Error()
        }
      } catch (error) {
        console.log(error)
        setIsReceiverInvalid(true)
      }
    } else {
      onSubmit({
        amount: selectedAmount
      })
    }
  }

  /**
   * Renders the receiver input field if it's a transfer.
   *
   * @returns {ReactElement} The receiver input field
   */
  function renderReceiver () {
    if (type !== 'deposit') {
      return (
        <div className={classes.receiverWrapper}>
          <div className={classes.receiverInputWrapper}>
            <input
              className={clsx({
                [classes.receiver]: true,
                [classes.receiverError]: isReceiverInvalid
              })}
              value={receiver}
              onChange={handleReceiverInputChange}
              type='text'
              placeholder='To hez:0x2387 ･･･ 5682'
            />

            <button
              className={clsx({
                [classes.receiverPaste]: true,
                [classes.receiverPasteVisible]: receiver.length === 0 && !(navigator.userAgent.match(/firefox/i))
              })}
              onClick={handlePasteClick}
            >
              Paste
            </button>
            <button
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
            [classes.receiverErrorMessageVisible]: isReceiverInvalid
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
   * Renders the fee selector if its a Layer 2 transaction.
   *
   * @returns {ReactElement} The fee selector component
   */
  function renderFeeSelector () {
    if (type !== 'deposit') {
      return (
        <div className={classes.feeWrapper}>
          <p className={classes.fee}>
            Fee {Number(getFee()).toFixed(6)} {account.tokenSymbol}
          </p>
        </div>
      )
    }
  }

  return (
    <section className={classes.transaction}>
      <div className={classes.token}>
        <p className={classes.tokenName}>{account.tokenName}</p>
        {
          (showInFiat)
            ? <p><span>{preferredCurrency}</span> <span>{getBalanceinFiat().toFixed(2)}</span></p>
            : <p><span>{account.tokenSymbol}</span> <span>{getAccountBalance().toFixed(2)}</span></p>
        }
      </div>

      <div className={clsx({
        [classes.selectAmount]: true,
        [classes.selectAmountError]: isAmountInvalid
      })}
      >
        <div className={classes.amount}>
          <p className={classes.amountCurrency}>{(showInFiat) ? preferredCurrency : account.tokenSymbol}</p>
          <input
            className={classes.amountInput}
            type='number'
            value={amount}
            onChange={handleAmountInputChange}
          />
        </div>
        <div className={classes.amountButtons}>
          <button className={`${classes.amountButton} ${classes.sendAll}`} onClick={handleSendAllButtonClick}>Send All</button>
          <button className={`${classes.amountButton} ${classes.changeCurrency}`} onClick={handleChangeCurrencyButtonClick}>
            <img
              className={classes.changeCurrencyIcon}
              src={swapIcon}
              alt='Swap Icon'
            />
            <p>{(showInFiat) ? account.tokenSymbol : preferredCurrency}</p>
          </button>
        </div>
      </div>
      <p className={clsx({
        [classes.errorMessage]: true,
        [classes.selectAmountErrorMessageVisible]: isAmountInvalid
      })}
      >
        <img
          className={classes.errorIcon}
          src={errorIcon}
          alt='Error Icon'
        />
        You don't have enough funds
      </p>

      {renderReceiver()}

      <button
        className={classes.continue}
        onClick={handleContinueButton}
        disabled={isContinueDisabled()}
      >
        Continue
      </button>

      {renderFeeSelector()}
    </section>
  )
}

TransactionForm.propTypes = {
  type: PropTypes.string.isRequired,
  account: PropTypes.object.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired,
  fees: PropTypes.shape({
    existingAccount: PropTypes.number.isRequired,
    createAccount: PropTypes.number.isRequired,
    createAccountInternal: PropTypes.number.isRequired
  }),
  onSubmit: PropTypes.func.isRequired
}

export default TransactionForm

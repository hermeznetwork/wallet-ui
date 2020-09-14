import React, { useState } from 'react'
import PropTypes from 'prop-types'

import useTransactionStyles from './transaction.styles'
import { CurrencySymbol } from '../../../utils/currencies'
import swapIcon from '../../../images/icons/swap.svg'
import errorIcon from '../../../images/icons/error.svg'

function Transaction ({
  type,
  account,
  preferredCurrency,
  fiatExchangeRates
}) {
  const classes = useTransactionStyles()
  const [showInFiat, setShowInFiat] = useState(false)
  const [amount, setAmount] = useState(0)
  const [isContinueDisabled, setIsContinueDisabled] = useState(true)

  /**
   * Returns the conversion rate from the selected token to the selected preffered currency.
   *
   * @returns {Number} Conversion rate from the selected token to fiat
   */
  function getAccountFiatRate () {
    return preferredCurrency === CurrencySymbol.USD.code
      ? account.token.USD
      : account.token.USD * fiatExchangeRates[preferredCurrency]
  }

  /**
   * Whether to show the receiver input field if its a transfer.
   *
   * @returns {ReactElement} The receiver input field
   */
  function showReceiver () {
    if (type !== 'deposit') {
      return (
        <input />
      )
    }
  }

  /**
   * Whether to show the fee selector if its a Layer 2 transaction.
   *
   * @returns {ReactElement} The fee selector component
   */
  function showFeeSelector () {
    if (type !== 'deposit') {
      return (
        <div className={classes.feeWrapper} onClick={handleSelectFee}>
          <p className={classes.fee}>
            Fee 0.01%
          </p>
          <img
            className={classes.feeIcon}
            src='/assets/icons/angle-down.svg'
            alt='Select Fee Icon'
          />
        </div>
      )
    }
  }

  /**
   * When the amount changes, check if the Continue button should be enabled or not.
   *
   * @param {Event}
   */
  function handleAmountInputChange (event) {
    const newAmount = Number(event.target.value)
    if (newAmount > 0) {
      setIsContinueDisabled(false)
    } else {
      setIsContinueDisabled(true)
    }
    setAmount(newAmount)
  }

  /**
   * Sets the amount to the full balance in the account, whether in the preferred fiat currency or the token value.
   */
  function handleSendAllButtonClick () {
    const inputAmount = showInFiat ? account.balance * getAccountFiatRate() : account.balance
    if (inputAmount > 0) {
      setIsContinueDisabled(false)
    } else {
      setIsContinueDisabled(true)
    }
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
   * Checks if the user has the selected amount in their balance.
   * Based on the type of transaction, prepares the necessary values (amount, receiver and fee).
   * Communicate to TransactionLayout to display TransactionOverview.
   */
  function handleContinueButton () {
    const selectedAmount = (showInFiat) ? (amount / getAccountFiatRate()) : amount
    if (selectedAmount > account.balance) {
      document.querySelector(`.${classes.selectAmount}`).classList.add(classes.selectAmountError)
      document.querySelector(`.${classes.selectAmountErrorMessage}`).classList.add(classes.selectAmountErrorMessageVisible)
    } else {
      document.querySelector(`.${classes.selectAmount}`).classList.remove(classes.selectAmountError)
      document.querySelector(`.${classes.selectAmountErrorMessage}`).classList.remove(classes.selectAmountErrorMessageVisible)
    }

    if (type !== 'deposit') {
      // Check receiver address
    }
  }

  /**
   * Display the Select Fee dropdown.
   */
  function handleSelectFee () {

  }

  return (
    <section className={classes.transaction}>
      <div className={classes.token}>
        <p className={classes.tokenName}>{account.token.name}</p>
        {
          (showInFiat)
            ? <p><span>{preferredCurrency}</span> <span>{(account.balance * getAccountFiatRate()).toFixed(2)}</span></p>
            : <p><span>{account.token.symbol}</span> <span>{account.balance.toFixed(2)}</span></p>
        }
      </div>

      <div className={classes.selectAmount}>
        <div className={classes.amount}>
          <p className={classes.amountCurrency}>{(showInFiat) ? preferredCurrency : account.token.symbol}</p>
          <input
            className={classes.amountInput}
            type='number' value={amount}
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
            <p>{(showInFiat) ? account.token.symbol : preferredCurrency}</p>
          </button>
        </div>
      </div>
      <p className={classes.selectAmountErrorMessage}>
        <img
          className={classes.errorIcon}
          src={errorIcon}
          alt='Error Icon'
        />
        You don't have enough funds
      </p>

      {showReceiver()}

      <button
        className={classes.continue}
        onClick={handleContinueButton}
        disabled={isContinueDisabled}
      >
        Continue
      </button>

      {showFeeSelector()}
    </section>
  )
}

Transaction.propTypes = {
  type: PropTypes.string.isRequired,
  account: PropTypes.shape({
    balance: PropTypes.number.isRequired,
    token: PropTypes.shape({
      tokenId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
      decimals: PropTypes.number.isRequired,
      ethAddr: PropTypes.string.isRequired,
      ethBlockNum: PropTypes.number.isRequired,
      USD: PropTypes.number.isRequired
    })
  }),
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired
}

export default Transaction

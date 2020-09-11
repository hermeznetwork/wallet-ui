import React, { useState } from 'react'
import PropTypes from 'prop-types'

import useTransactionStyles from './transaction.styles'
import { CurrencySymbol } from '../../../utils/currencies'

function Transaction ({
  type,
  token,
  preferredCurrency,
  fiatExchangeRates
}) {
  const classes = useTransactionStyles()
  const [showInFiat, setShowInFiat] = useState(false)
  const [amount, setAmount] = useState(0)
  const [isContinueDisabled, setIsContinueDisabled] = useState(true)

  function getAccountFiatRate () {
    return preferredCurrency === CurrencySymbol.USD.code
      ? token.USD
      : token.USD * fiatExchangeRates[preferredCurrency]
  }

  function showReceiver () {
    if (type !== 'deposit') {
      return (
        <input />
      )
    }
  }

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

  function handleAmountInputChange (event) {
    setAmount(Number(event.target.value))
    event.target.value = amount.toString()
    if (amount > 0) {
      setIsContinueDisabled(false)
    } else {
      setIsContinueDisabled(true)
    }
  }

  function handleSendAllButtonClick () {
    const inputAmount = showInFiat ? getAccountFiatRate() : token.balance
    setAmount(inputAmount)
  }

  function handleChangeCurrencyButtonClick () {
    if (showInFiat) {
      setAmount(amount / getAccountFiatRate())
    } else {
      setAmount(amount * getAccountFiatRate())
    }
    setShowInFiat(!showInFiat)
  }

  function handleContinueButton () {
    const selectedAmount = (showInFiat) ? (amount / getAccountFiatRate()) : amount
    if (selectedAmount > token.balance) {
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

  function handleSelectFee () {

  }

  return (
    <section className={classes.transaction}>
      <div className={classes.token}>
        <p className={classes.tokenName}>{token.name}</p>
        {
          (showInFiat)
            ? <p><span>{preferredCurrency}</span> <span>{(token.balance * getAccountFiatRate()).toFixed(2)}</span></p>
            : <p><span>{token.symbol}</span> <span>{token.balance.toFixed(2)}</span></p>
        }
      </div>

      <div className={classes.selectAmount}>
        <div className={classes.amount}>
          <p className={classes.amountCurrency}>{(showInFiat) ? preferredCurrency : token.symbol}</p>
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
              src='/assets/icons/swap.svg'
              alt='Swap Icon'
            />
            <p>{(showInFiat) ? token.symbol : preferredCurrency}</p>
          </button>
        </div>
      </div>
      <p className={classes.selectAmountErrorMessage}>
        <img
          className={classes.errorIcon}
          src='/assets/icons/error.svg'
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
  token: PropTypes.shape({
    balance: PropTypes.number.isRequired,
    tokenId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    decimals: PropTypes.number.isRequired,
    ethAddr: PropTypes.string.isRequired,
    ethBlockNum: PropTypes.number.isRequired,
    USD: PropTypes.number.isRequired
  }),
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired
}

export default Transaction

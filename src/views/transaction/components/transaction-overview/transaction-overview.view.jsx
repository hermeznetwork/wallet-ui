import React from 'react'
import PropTypes from 'prop-types'

import useTransactionOverviewStyles from './transaction-overview.styles'
import { CurrencySymbol } from '../../../../utils/currencies'

function TransactionOverview ({
  type,
  from,
  to,
  amount,
  fee,
  token,
  preferredCurrency,
  fiatExchangeRates
}) {
  const classes = useTransactionOverviewStyles()

  function getAccountBalance () {
    return Number(token.balance)
  }

  /**
   * Returns the conversion rate from the selected token to the selected preffered currency.
   *
   * @returns {Number} Conversion rate from the selected token to fiat
   */
  function getAccountFiatRate () {
    const USDRate = token.balanceUSD / getAccountBalance()
    return preferredCurrency === CurrencySymbol.USD.code
      ? USDRate
      : USDRate * fiatExchangeRates[preferredCurrency]
  }

  /**
   * Depending on the transaction type, show the appropriate button text
   *
   * @returns {string}
   */
  function getTitle () {
    switch (type) {
      case 'deposit':
        return 'Deposit'
      case 'transfer':
        return 'Send'
      case 'withdraw':
        return 'Withdraw'
      default:
        return ''
    }
  }

  /**
   * Prepares the transaction and sends it
   */
  function handleClickTxButton () {

  }

  /**
   * If the transaction has a receiver, display that information.
   */
  function renderTo () {
    if (to) {
      return (
        <div className={classes.row}>
          <p className={classes.rowName}>To</p>
          <div className={classes.rowValues}>
            <p className={classes.valueTop}>{to}</p>
          </div>
        </div>
      )
    } else {
      return <></>
    }
  }

  /**
   * If it's a Layer 2 transaction, show the fee.
   */
  function renderFee () {
    if (fee) {
      return (
        <div className={classes.row}>
          <p className={classes.rowName}>Fee</p>
          <div className={classes.rowValues}>
            <p className={classes.valueTop}>{CurrencySymbol[preferredCurrency].symbol} {fee * getAccountFiatRate()}</p>
            <p className={classes.valueBottom}>{fee} {token.tokenSymbol}</p>
          </div>
        </div>
      )
    } else {
      return <></>
    }
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.amountWrapper}>
        <p className={classes.amountFiat}>{CurrencySymbol[preferredCurrency].symbol} {amount * getAccountFiatRate()}</p>
        <p className={classes.amountToken}>{amount}</p>
      </div>
      <div className={classes.txTable}>
        <div className={classes.row}>
          <p className={classes.rowName}>From</p>
          <div className={classes.rowValues}>
            <p className={classes.valueTop}>My Hermez Address</p>
            <p className={classes.valueBottom}>{from}</p>
          </div>
        </div>
        {renderTo()}
        {renderFee()}
      </div>
      <button className={classes.txButton} onClick={handleClickTxButton}>{getTitle()}</button>
    </div>
  )
}

TransactionOverview.propTypes = {
  type: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string,
  amount: PropTypes.number.isRequired,
  fee: PropTypes.number,
  token: PropTypes.object.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired
}

export default TransactionOverview

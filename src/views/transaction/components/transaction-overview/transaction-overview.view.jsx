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

  /**
   * Returns the conversion rate from the selected token to the selected preffered currency.
   *
   * @returns {Number} Conversion rate from the selected token to fiat
   */
  function getAccountFiatRate () {
    return preferredCurrency === CurrencySymbol.USD.code
      ? token.USD
      : token.USD * fiatExchangeRates[preferredCurrency]
  }

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

  function renderFee () {
    if (fee) {
      return (
        <div className={classes.row}>
          <p className={classes.rowName}>Fee</p>
          <div className={classes.rowValues}>
            <p className={classes.valueTop}>{preferredCurrency} {fee * getAccountFiatRate()}</p>
            <p className={classes.valueTop}>{fee} {token.symbol}</p>
          </div>
        </div>
      )
    } else {
      return <></>
    }
  }

  return (
    <div className={classes.wrapper}>
      {amount}
      <div className={classes.row}>
        <p className={classes.rowName}>From</p>
        <div className={classes.rowValues}>
          <p className={classes.valueTop}>My Hermez Address</p>
          <p className={classes.valueBottom}>{from}</p>
        </div>
      </div>
      {renderTo()}
      {renderFee()}
      <button>{getTitle()}</button>
    </div>
  )
}

TransactionOverview.propTypes = {
  type: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string,
  amount: PropTypes.number.isRequired,
  fee: PropTypes.number,
  token: PropTypes.shape({
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

export default TransactionOverview

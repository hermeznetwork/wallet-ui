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

  function getAccountFiatRate () {
    console.log(CurrencySymbol, fiatExchangeRates)
    return preferredCurrency === CurrencySymbol.USD
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

  function handleAmountInputChange (event) {
    setAmount(event.target.value)
  }

  function handleChangeCurrencyButtonClick () {
    setShowInFiat(!showInFiat)
  }

  return (
    <section className={classes.transaction}>
      <div className={classes.token}>
        <p className={classes.tokenName}>{token.name}</p>
        {
          (showInFiat)

            ? <p><span>{preferredCurrency}</span> <span>{getAccountFiatRate()}</span></p>
            : <p><span>{token.symbol}</span> <span>{token.balance.toFixed(2)}</span></p>
        }
      </div>

      <div className={classes.selectAmount}>
        <div className={classes.amount}>
          <p className={classes.amountCurrency}>{(showInFiat) ? preferredCurrency : token.symbol}</p>
          <input className={classes.amountInput} type='text' value={amount} onChange={handleAmountInputChange} />
        </div>
        <div className={classes.amountButtons}>
          <button className={classes.sendAll}>Send All</button>
          <button className={classes.changeCurrency} onClick={handleChangeCurrencyButtonClick}>
            <img
              className={classes.changeCurrencyIcon}
              src='/assets/icons/swap.svg'
              alt='Swap Icon'
            />
            <p>{(showInFiat) ? preferredCurrency : token.symbol}</p>
          </button>
        </div>
      </div>

      {showReceiver()}
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

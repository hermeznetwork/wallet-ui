import React from 'react'
import PropTypes from 'prop-types'

import useTransactionOverviewStyles from './transaction-overview.styles'
import { getPartiallyHiddenHermezAddress } from '../../../../utils/addresses'
import { CurrencySymbol, getFixedTokenAmount, getTokenAmountInPreferredCurrency, getTokenAmountBigInt } from '../../../../utils/currencies'
import { floorFix2Float, float2Fix } from '../../../../utils/float16'
import { generateL2Transaction } from '../../../../utils/tx-utils'
import { send } from '../../../../utils/tx'

function TransactionOverview ({
  metaMaskWallet,
  type,
  to,
  amount,
  fee,
  account,
  preferredCurrency,
  fiatExchangeRates
}) {
  const classes = useTransactionOverviewStyles()

  /**
   * Uses helper function to convert amount to Fiat in the preferred currency
   *
   * @returns {Number}
   */
  function getAmountinFiat (value) {
    return getTokenAmountInPreferredCurrency(
      value,
      account.token.USD,
      preferredCurrency,
      fiatExchangeRates
    )
  }

  function getAmountInBigInt () {
    return getTokenAmountBigInt(amount, account.token.decimals)
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
  async function handleClickTxButton () {
    const { transaction, encodedTransaction } = await generateL2Transaction({
      from: account.accountIndex,
      to: to.accountIndex,
      amount: float2Fix(floorFix2Float(getAmountInBigInt())),
      fee,
      nonce: account.nonce
    }, account.token)
    metaMaskWallet.signTransaction(transaction, encodedTransaction)
    console.log(transaction)

    switch (type) {
      case 'deposit':
        return 'Deposit'
      case 'transfer':
        send(transaction)
          .then((res) => {
            console.log(res)
          })
          .catch((error) => {
            console.log(error)
          })
        break
      case 'withdraw':
        return 'Withdraw'
      default:
        return ''
    }
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
            <p className={classes.valueTop}>{getPartiallyHiddenHermezAddress(to.hezEthereumAddress)}</p>
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
            <p className={classes.valueTop}>{CurrencySymbol[preferredCurrency].symbol} {getAmountinFiat(fee)}</p>
            <p className={classes.valueBottom}>{fee} {account.token.symbol}</p>
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
        <p className={classes.amountFiat}>{CurrencySymbol[preferredCurrency].symbol} {getAmountinFiat(amount)}</p>
        <p className={classes.amountToken}>{getFixedTokenAmount(getAmountInBigInt())} {account.token.symbol}</p>
      </div>
      <div className={classes.txTable}>
        <div className={classes.row}>
          <p className={classes.rowName}>From</p>
          <div className={classes.rowValues}>
            <p className={classes.valueTop}>My Hermez Address</p>
            <p className={classes.valueBottom}>{getPartiallyHiddenHermezAddress(account.hezEthereumAddress)}</p>
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
  metaMaskWallet: PropTypes.shape({
    signTransaction: PropTypes.func.isRequired
  }),
  type: PropTypes.string.isRequired,
  to: PropTypes.object.isRequired,
  amount: PropTypes.string.isRequired,
  fee: PropTypes.number,
  account: PropTypes.object.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired
}

export default TransactionOverview

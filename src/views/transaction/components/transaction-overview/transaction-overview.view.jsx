import React from 'react'
import PropTypes from 'prop-types'
import { ethers } from 'ethers'
import { useTheme } from 'react-jss'

import useTransactionOverviewStyles from './transaction-overview.styles'
import { getPartiallyHiddenHermezAddress } from '../../../../utils/addresses'
import { CurrencySymbol, getTokenAmountInPreferredCurrency, getFixedTokenAmount } from '../../../../utils/currencies'
import TransactionInfo from '../../../shared/transaction-info/transaction-info.view'
import Container from '../../../shared/container/container.view'
import { TransactionType } from '../../transaction.view'
import FiatAmount from '../../../shared/fiat-amount/fiat-amount.view'
import TokenBalance from '../../../shared/token-balance/token-balance.view'
import Spinner from '../../../shared/spinner/spinner.view'
import FormButton from '../../../shared/form-button/form-button.view'

function TransactionOverview ({
  wallet,
  isTransactionBeingSigned,
  transactionType,
  to,
  amount,
  fee,
  exit,
  instantWithdrawal,
  completeDelayedWithdrawal,
  account,
  preferredCurrency,
  fiatExchangeRates,
  onDeposit,
  onForceExit,
  onWithdraw,
  onExit,
  onTransfer
}) {
  const theme = useTheme()
  const classes = useTransactionOverviewStyles()

  /**
   * Converts the transaction amount to fiat in the preferred currency
   *
   * @returns {number} - Token amount in the user's preferred currency
   */
  function getAmountInFiat (value) {
    const token = account.token
    const fixedAccountBalance = getFixedTokenAmount(
      value,
      token.decimals
    )

    return getTokenAmountInPreferredCurrency(
      fixedAccountBalance,
      token.USD,
      preferredCurrency,
      fiatExchangeRates
    )
  }

  /**
   * Converts the transaction type to a readable button label
   *
   * @returns {string} - Button label
   */
  function getButtonLabel () {
    switch (transactionType) {
      case TransactionType.Deposit:
        return 'Deposit'
      case TransactionType.Transfer:
        return 'Send'
      case TransactionType.Exit:
        return 'Withdraw'
      case TransactionType.Withdraw:
        return 'Withdraw'
      case TransactionType.ForceExit:
        return 'Force Withdrawal'
      default:
        return ''
    }
  }

  /**
   * Bubbles up an event to send the transaction accordingly
   * @returns {void}
   */
  async function handleFormSubmit () {
    const bigIntAmount = ethers.BigNumber.from(amount)

    switch (transactionType) {
      case TransactionType.Deposit: {
        return onDeposit(bigIntAmount, account)
      }
      case TransactionType.ForceExit: {
        return onForceExit(bigIntAmount, account)
      }
      case TransactionType.Withdraw: {
        return onWithdraw(amount, account, exit, completeDelayedWithdrawal, instantWithdrawal)
      }
      case TransactionType.Exit: {
        return onExit(amount, account, fee)
      }
      default: {
        return onTransfer(amount, account, to, fee)
      }
    }
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} addHeaderPadding disableTopGutter>
        <section className={classes.section}>
          <div className={classes.fiatAmount}>
            <FiatAmount
              amount={getAmountInFiat(amount)}
              currency={preferredCurrency}
            />
          </div>
          <TokenBalance
            amount={getFixedTokenAmount(amount, account.token.decimals)}
            symbol={account.token.symbol}
          />
        </section>
      </Container>
      <Container>
        <section className={classes.section}>
          <TransactionInfo
            from={getPartiallyHiddenHermezAddress(wallet.hermezEthereumAddress)}
            to={Object.keys(to).length !== 0 ? getPartiallyHiddenHermezAddress(to.hezEthereumAddress) : undefined}
            fee={fee ? {
              fiat: `${CurrencySymbol[preferredCurrency].symbol} ${getAmountInFiat(fee).toFixed(6)}`,
              tokens: `${getFixedTokenAmount(fee, account.token.decimals)} ${account.token.symbol}`
            } : undefined}
          />
          {
            isTransactionBeingSigned
              ? (
                <div className={classes.signingSpinnerWrapper}>
                  <Spinner />
                  <p className={classes.signingText}>
                    Sign in with MetaMask to confirm transaction
                  </p>
                </div>
              )
              : (
                <FormButton
                  label={getButtonLabel()}
                  onClick={handleFormSubmit}
                />
              )
          }
        </section>
      </Container>
    </div>
  )
}

TransactionOverview.propTypes = {
  wallet: PropTypes.object,
  transactionType: PropTypes.string.isRequired,
  to: PropTypes.object.isRequired,
  amount: PropTypes.string.isRequired,
  fee: PropTypes.string,
  exit: PropTypes.object,
  instantWithdrawal: PropTypes.bool,
  completeDelayedWithdrawal: PropTypes.bool,
  account: PropTypes.object.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired
}

export default TransactionOverview

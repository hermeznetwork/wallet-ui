import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from 'react-jss'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'
import { getFeeIndex, getFeeValue } from '@hermeznetwork/hermezjs/src/tx-utils'
import { getTokenAmountBigInt, getTokenAmountString } from '@hermeznetwork/hermezjs/src/utils'

import useTransactionOverviewStyles from './transaction-overview.styles'
import { CurrencySymbol, getTokenAmountInPreferredCurrency, getFixedTokenAmount, getAmountInPreferredCurrency } from '../../../../utils/currencies'
import TransactionInfo from '../../../shared/transaction-info/transaction-info.view'
import Container from '../../../shared/container/container.view'
import FiatAmount from '../../../shared/fiat-amount/fiat-amount.view'
import TokenBalance from '../../../shared/token-balance/token-balance.view'
import Spinner from '../../../shared/spinner/spinner.view'
import FormButton from '../../../shared/form-button/form-button.view'
import { MAX_TOKEN_DECIMALS } from '../../../../constants'
import { ReactComponent as InfoIcon } from '../../../../images/icons/info.svg'

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
  estimatedWithdrawFeeTask,
  preferredCurrency,
  fiatExchangeRates,
  onLoadEstimatedWithdrawFee,
  onDeposit,
  onForceExit,
  onWithdraw,
  onExit,
  onTransfer
}) {
  const theme = useTheme()
  const classes = useTransactionOverviewStyles()
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false)

  React.useEffect(() => {
    if (transactionType === TxType.Exit) {
      onLoadEstimatedWithdrawFee(account.token, amount)
    }
  }, [transactionType, account, amount])

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

  function getEstimatedWithdrawFee () {
    return estimatedWithdrawFeeTask.status === 'successful'
      ? getAmountInPreferredCurrency(estimatedWithdrawFeeTask.data, preferredCurrency, fiatExchangeRates).toFixed(2)
      : '--'
  }

  /**
   * Converts the transaction type to a readable button label
   *
   * @returns {string} - Button label
   */
  function getButtonLabel () {
    switch (transactionType) {
      case TxType.Deposit:
        return 'Deposit'
      case TxType.Transfer:
        return 'Send'
      case TxType.Exit:
        return 'Initiate withdraw'
      case TxType.Withdraw:
        return 'Withdraw'
      case TxType.ForceExit:
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
    // We only need to disable the button on L2 txs, as L1 txs are going to display an
    // spinner which will prevent the user from submitting the form twice
    switch (transactionType) {
      case TxType.Deposit: {
        return onDeposit(amount, account)
      }
      case TxType.ForceExit: {
        return onForceExit(amount, account)
      }
      case TxType.Withdraw: {
        return onWithdraw(amount, account, exit, completeDelayedWithdrawal, instantWithdrawal)
      }
      case TxType.Exit: {
        setIsButtonDisabled(true)
        return onExit(amount, account, fee)
      }
      default: {
        setIsButtonDisabled(true)
        return onTransfer(amount, account, to, fee)
      }
    }
  }

  /**
   * Calculates the actual fee that will be paid for a specific transaction
   * taking into account the type of transaction, the amount and minimum fee
   * @param {Number} minimumFee - The minimum fee that needs to be payed to the coordinator in token value
   * @returns {Number} The real fee that will be paid for this transaction
   */
  function getRealFee (minimumFee) {
    const decimals = account.token.decimals
    const minimumFeeBigInt = getTokenAmountBigInt(minimumFee.toFixed(decimals), decimals).toString()
    const feeIndex = getFeeIndex(minimumFeeBigInt, amount)
    const fee = getFeeValue(feeIndex, amount)
    return Number(getTokenAmountString(fee, decimals))
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} addHeaderPadding disableTopGutter>
        <section className={classes.section}>
          <div className={classes.highlightedAmount}>
            <TokenBalance
              amount={getFixedTokenAmount(amount, account.token.decimals)}
              symbol={account.token.symbol}
            />
          </div>
          <FiatAmount
            amount={getAmountInFiat(amount)}
            currency={preferredCurrency}
          />
        </section>
      </Container>
      <Container>
        <section className={classes.section}>
          <TransactionInfo
            txData={{
              type: transactionType,
              fromHezEthereumAddress: wallet.hermezEthereumAddress,
              toHezEthereumAddress: to.hezEthereumAddress || to.hezBjjAddress,
              fee: fee
                ? {
                    fiat: `${CurrencySymbol[preferredCurrency].symbol} ${(Number(getRealFee(fee)) * account.token.USD).toFixed(2)}`,
                    tokens: `${Number(getRealFee(fee)).toFixed(MAX_TOKEN_DECIMALS)} ${account.token.symbol}`
                  }
                : undefined
            }}
          />
          {
            isTransactionBeingSigned
              ? (
                <div className={classes.signingSpinnerWrapper}>
                  <Spinner />
                  <p className={classes.signingText}>
                    Sign in your connected wallet to confirm transaction
                  </p>
                </div>
                )
              : (
                <FormButton
                  label={getButtonLabel()}
                  onClick={handleFormSubmit}
                  disabled={isButtonDisabled}
                />
                )
          }
          {
            transactionType === TxType.Exit && (
              <div className={classes.exitInfoWrapper}>
                <div className={classes.exitHelperTextWrapper}>
                  <InfoIcon className={classes.exitHelperIcon} />
                  <p className={classes.exitHelperText}>
                    This step is not reversible. Once initiated, the withdrawal process must be completed.
                  </p>
                </div>
                <p className={classes.exitEstimatedFeeHelperText}>
                  The estimated gas fee for step 2 of the withdrawal process is {CurrencySymbol[preferredCurrency].symbol} {getEstimatedWithdrawFee()}
                </p>
              </div>
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
  fee: PropTypes.number,
  exit: PropTypes.object,
  instantWithdrawal: PropTypes.bool,
  completeDelayedWithdrawal: PropTypes.bool,
  account: PropTypes.object.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired
}

export default TransactionOverview

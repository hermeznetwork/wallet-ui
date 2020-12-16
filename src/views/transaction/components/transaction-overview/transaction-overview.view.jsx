import React from 'react'
import PropTypes from 'prop-types'
import { ethers } from 'ethers'
import { useTheme } from 'react-jss'
import hermezjs from 'hermezjs'

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
  onGoToFinishTransactionStep,
  onAddPendingWithdraw,
  onAddPendingDelayedWithdraw,
  onRemovePendingDelayedWithdraw
}) {
  const theme = useTheme()
  const classes = useTransactionOverviewStyles()
  const [isUserSigningTransaction, setIsUserSigningTransaction] = React.useState(false)

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
   * Converts the transaction amount from a number to a BigNumber
   * @returns {BigNumber} - Transaction amount in BigNumber
   */
  function getAmountInBigInt () {
    return ethers.BigNumber.from(amount)
  }

  /**
   * Converts the token amount to a fixed amount
   * @param {string} value - Token amount
   * @returns {string} - Fixed token amount
   */
  function getTokenAmount (value) {
    return getFixedTokenAmount(value, account.token.decimals)
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
   * Prepares the transaction and sends it
   * @returns {void}
   */
  async function handleClickTxButton () {
    // TODO: Remove once we have hermez-node. This is how we test the withdraw flow.
    // onAddPendingWithdraw(wallet.hermezEthereumAddress, account.accountIndex + exit.merkleProof.Root)
    // return
    switch (transactionType) {
      case TransactionType.Deposit: {
        setIsUserSigningTransaction(true)

        return hermezjs.Tx.deposit(
          getAmountInBigInt(),
          wallet.hermezEthereumAddress,
          account.token,
          wallet.publicKeyCompressedHex
        )
          .then(() => onGoToFinishTransactionStep(transactionType))
          .catch((error) => {
            setIsUserSigningTransaction(false)
            console.log(error)
          })
      }
      case TransactionType.ForceExit: {
        setIsUserSigningTransaction(true)

        return hermezjs.Tx.forceExit(
          getAmountInBigInt(),
          account.accountIndex || 'hez:TKN:256',
          account.token
        )
          .then(() => onGoToFinishTransactionStep(transactionType))
          .catch((error) => {
            setIsUserSigningTransaction(false)
            console.log(error)
          })
      }
      case TransactionType.Withdraw: {
        setIsUserSigningTransaction(true)

        // Differentiate between a withdraw on the Hermez SC and the DelayedWithdrawal SC
        if (!completeDelayedWithdrawal) {
          // TODO: Change once hermez-node is ready and we have a testnet. First line is the proper one, second one needs to be modified manually in each test
          // withdraw(getAmountInBigInt(), account.accountIndex || 'hez:TKN:256', account.token, wallet.publicKeyCompressedHex, exit.merkleProof.Root, exit.merkleProof.Siblings, instantWithdrawal)
          return hermezjs.Tx.withdraw(
            ethers.BigNumber.from(340000000000000000000n),
            'hez:TKN:256',
            {
              id: 1,
              ethereumAddress: '0xf4e77E5Da47AC3125140c470c71cBca77B5c638c'
            },
            wallet.publicKeyCompressedHex,
            ethers.BigNumber.from('4'),
            [],
            instantWithdrawal
          ).then(() => {
            if (instantWithdrawal) {
              onAddPendingWithdraw(wallet.hermezEthereumAddress, account.accountIndex + exit.merkleProof.Root)
            } else {
              onAddPendingDelayedWithdraw({
                id: account.accountIndex + exit.merkleProof.Root,
                instant: false,
                date: Date.now()
              })
            }
            onGoToFinishTransactionStep(transactionType)
          }).catch((error) => {
            setIsUserSigningTransaction(false)
            console.log(error)
          })
        } else {
          // Change once hermez-node is ready
          // return hermezjs.Tx.delayedWithdraw(wallet.hermezEthereumAddress, account.token)
          return hermezjs.Tx.delayedWithdraw(wallet.hermezEthereumAddress, { id: 1, ethereumAddress: '0xf4e77E5Da47AC3125140c470c71cBca77B5c638c' })
            .then(() => {
              onRemovePendingDelayedWithdraw(account.accountIndex + exit.merkleProof.Root)
              onGoToFinishTransactionStep(transactionType)
            })
            .catch((error) => {
              setIsUserSigningTransaction(false)
              console.log(error)
            })
        }
      }
      default: {
        const { transaction, encodedTransaction } = await hermezjs.TxUtils.generateL2Transaction(
          {
            from: account.accountIndex,
            to: transactionType === TransactionType.Transfer ? to.accountIndex : null,
            amount: getAmountInBigInt(),
            fee,
            nonce: account.nonce
          },
          wallet.publicKeyCompressedHex,
          account.token
        )

        wallet.signTransaction(transaction, encodedTransaction)

        return hermezjs.Tx.sendL2Transaction(transaction, wallet.publicKeyCompressedHex)
          .then(() => onGoToFinishTransactionStep(transactionType))
          .catch((error) => console.log(error))
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
            amount={getTokenAmount(amount)}
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
              tokens: `${getTokenAmount(fee)} ${account.token.symbol}`
            } : undefined}
          />
          {
            isUserSigningTransaction
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
                  onClick={handleClickTxButton}
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
  fiatExchangeRates: PropTypes.object.isRequired,
  onGoToFinishTransactionStep: PropTypes.func.isRequired,
  onAddPendingWithdraw: PropTypes.func.isRequired
}

export default TransactionOverview

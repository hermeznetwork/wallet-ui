import React from 'react'
import PropTypes from 'prop-types'
import ethers from 'ethers'
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

function TransactionOverview ({
  metaMaskWallet,
  type,
  to,
  amount,
  fee,
  exit,
  account,
  preferredCurrency,
  fiatExchangeRates,
  onGoToFinishTransactionStep,
  onAddPendingWithdraw
}) {
  const theme = useTheme()
  const classes = useTransactionOverviewStyles()

  /**
   * Uses helper function to convert amount to Fiat in the preferred currency
   *
   * @returns {Number}
   */
  function getAmountInFiat (value) {
    const stringValue = typeof value === 'number' ? value.toString() : value
    const bigNumberValue = hermezjs.Utils.getTokenAmountBigInt(stringValue).toString()
    const token = account.token
    const fixedAccountBalance = getFixedTokenAmount(
      bigNumberValue,
      token.decimals
    )

    return getTokenAmountInPreferredCurrency(
      fixedAccountBalance,
      token.USD,
      preferredCurrency,
      fiatExchangeRates
    )
  }

  function getAmountInBigInt () {
    return hermezjs.Utils.getTokenAmountBigInt(amount, account.token.decimals)
  }

  function getTokenAmount (value) {
    const stringValue = typeof value === 'number' ? value.toString() : value
    const bigNumberValue = hermezjs.Utils.getTokenAmountBigInt(stringValue).toString()

    return getFixedTokenAmount(bigNumberValue, account.token.decimals)
  }

  /**
   * Depending on the transaction type, show the appropriate button text
   *
   * @returns {string}
   */
  function getButtonLabel () {
    switch (type) {
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
   * Prepares an L2 transfer object, signs it and send it
   */
  async function sendTransfer () {
    const { transaction, encodedTransaction } = await hermezjs.TxUtils.generateL2Transaction({
      from: account.accountIndex,
      to: type === TransactionType.Transfer ? to.accountIndex : null,
      amount: hermezjs.Float16.float2Fix(hermezjs.Float16.floorFix2Float(getAmountInBigInt())),
      fee,
      nonce: account.nonce
    }, metaMaskWallet.publicKeyCompressedHex, account.token)
    metaMaskWallet.signTransaction(transaction, encodedTransaction)

    return hermezjs.Tx.send(transaction, metaMaskWallet.publicKeyCompressedHex)
  }

  /**
   * Prepares the transaction and sends it
   */
  async function handleClickTxButton () {
    if (type === TransactionType.Deposit) {
      hermezjs.Tx.deposit(getAmountInBigInt(), metaMaskWallet.hermezEthereumAddress, account.token, metaMaskWallet.publicKeyCompressedHex)
        .then((res) => onGoToFinishTransactionStep(type))
        .catch((error) => console.log(error))
    } else if (type === TransactionType.ForceExit) {
      hermezjs.Tx.forceExit(getAmountInBigInt(), account.accountIndex || 'hez:TKN:256', account.token)
        .then((res) => onGoToFinishTransactionStep(type))
        .catch((error) => console.log(error))
    } else if (type === TransactionType.Withdraw) {
      // Todo: Change once hermez-node is ready and we have a testnet. First line is the proper one, second one needs to be modified manually in each test
      // withdraw(getAmountInBigInt(), account.accountIndex || 'hez:TKN:256', account.token, metaMaskWallet.publicKeyCompressedHex, exit.merkleProof.Root, exit.merkleProof.Siblings)
      hermezjs.Tx.withdraw(ethers.BigNumber.from(300000000000000000000n), 'hez:TKN:256', { id: 1, ethereumAddress: '0xf784709d2317D872237C4bC22f867d1BAe2913AB' }, metaMaskWallet.publicKeyCompressedHex, ethers.BigNumber.from('4'), [])
        .then((res) => {
          onAddPendingWithdraw(account.accountIndex + exit.merkleProof.Root)
          onGoToFinishTransactionStep(type)
        })
        .catch((error) => console.log(error))
    } else {
      sendTransfer()
        .then((res) => onGoToFinishTransactionStep(type))
        .catch((error) => console.log(error))
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.amountsSection}>
        <Container backgroundColor={theme.palette.primary.main}>
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
      </div>
      <div className={classes.transactionInfoSection}>
        <Container>
          <section className={classes.section}>
            <TransactionInfo
              from={getPartiallyHiddenHermezAddress(metaMaskWallet.hermezEthereumAddress)}
              to={Object.keys(to).length !== 0 ? getPartiallyHiddenHermezAddress(to.hezEthereumAddress) : undefined}
              fee={fee ? {
                fiat: `${CurrencySymbol[preferredCurrency].symbol} ${getAmountInFiat(fee).toFixed(2)}`,
                tokens: `${getTokenAmount(fee)} ${account.token.symbol}`
              } : undefined}
            />
            <button className={classes.txButton} onClick={handleClickTxButton}>
              {getButtonLabel()}
            </button>
          </section>
        </Container>
      </div>
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
  exit: PropTypes.object,
  account: PropTypes.object.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired,
  onGoToFinishTransactionStep: PropTypes.func.isRequired,
  onAddPendingWithdraw: PropTypes.func.isRequired
}

export default TransactionOverview

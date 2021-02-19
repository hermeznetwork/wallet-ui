import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { push } from 'connected-react-router'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'

import * as transactionThunks from '../../store/transaction/transaction.thunks'
import * as transactionActions from '../../store/transaction/transaction.actions'
import * as globalThunks from '../../store/global/global.thunks'
import useTransactionStyles from './transaction.styles'
import TransactionForm from './components/transaction-form/transaction-form.view'
import TransactionOverview from './components/transaction-overview/transaction-overview.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { STEP_NAME } from '../../store/transaction/transaction.reducer'
import AccountSelector from './components/account-selector/account-selector.view'
import TransactionConfirmation from './components/transaction-confirmation/transaction-confirmation.view'
import { changeHeader } from '../../store/global/global.actions'
import Spinner from '../shared/spinner/spinner.view'

export const WithdrawRedirectionRoute = {
  Home: 'home',
  AccountDetails: 'account-details'
}

function Transaction ({
  currentStep,
  steps,
  wallet,
  preferredCurrency,
  fiatExchangeRatesTask,
  transactionType,
  pendingDeposits,
  onChangeHeader,
  onCheckPendingDeposits,
  onLoadMetaMaskAccount,
  onLoadHermezAccount,
  onLoadExit,
  onLoadFees,
  onLoadAccounts,
  onGoToChooseAccountStep,
  onGoToBuildTransactionStep,
  onGoToTransactionOverviewStep,
  onFinishTransaction,
  onDeposit,
  onForceExit,
  onWithdraw,
  onExit,
  onTransfer,
  onCleanup
}) {
  const classes = useTransactionStyles()
  const { search } = useLocation()
  const urlSearchParams = new URLSearchParams(search)
  const accountIndex = urlSearchParams.get('accountIndex')
  const tokenId = urlSearchParams.get('tokenId')
  const batchNum = urlSearchParams.get('batchNum')
  const receiver = urlSearchParams.get('receiver')
  const instantWithdrawal = urlSearchParams.get('instantWithdrawal') === 'true'
  const completeDelayedWithdrawal = urlSearchParams.get('completeDelayedWithdrawal') === 'true'
  const redirectTo = urlSearchParams.get('redirectTo')

  React.useEffect(() => {
    onChangeHeader(currentStep, transactionType, accountIndex, redirectTo)
  }, [currentStep, transactionType, accountIndex, redirectTo, onChangeHeader])

  React.useEffect(() => {
    onCheckPendingDeposits()
  }, [onCheckPendingDeposits])

  React.useEffect(() => {
    if (accountIndex && tokenId) {
      onLoadMetaMaskAccount(Number(tokenId))
    } else if (accountIndex && !tokenId) {
      if (batchNum) {
        onLoadExit(accountIndex, Number(batchNum))
      } else {
        onLoadHermezAccount(accountIndex)
      }
    } else {
      onGoToChooseAccountStep()
    }
  }, [tokenId, batchNum, accountIndex, onLoadExit, onLoadMetaMaskAccount, onLoadHermezAccount, onGoToChooseAccountStep])

  React.useEffect(() => onCleanup, [onCleanup])

  return (
    <div className={classes.root}>
      {(() => {
        switch (currentStep) {
          case STEP_NAME.LOAD_INITIAL_DATA: {
            return (
              <div className={classes.spinnerWrapper}>
                <Spinner />
              </div>
            )
          }
          case STEP_NAME.CHOOSE_ACCOUNT: {
            const stepData = steps[STEP_NAME.CHOOSE_ACCOUNT]

            return (
              <AccountSelector
                transactionType={transactionType}
                accountsTask={stepData.accountsTask}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRatesTask.data || {}}
                pendingDeposits={pendingDeposits[wallet.hermezEthereumAddress]}
                onLoadAccounts={onLoadAccounts}
                onAccountClick={(account) => onGoToBuildTransactionStep(account, receiver)}
              />
            )
          }
          case STEP_NAME.BUILD_TRANSACTION: {
            const stepData = steps[STEP_NAME.BUILD_TRANSACTION]

            return (
              <TransactionForm
                account={stepData.account}
                transactionType={transactionType}
                receiverAddress={stepData.receiver}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRatesTask.data || {}}
                feesTask={stepData.feesTask}
                onLoadFees={onLoadFees}
                onSubmit={onGoToTransactionOverviewStep}
              />
            )
          }
          case STEP_NAME.REVIEW_TRANSACTION: {
            const stepData = steps[STEP_NAME.REVIEW_TRANSACTION]
            const buildTransactionStepData = steps[STEP_NAME.BUILD_TRANSACTION]

            return (
              <TransactionOverview
                wallet={wallet}
                isTransactionBeingSigned={stepData.isTransactionBeingSigned}
                transactionType={transactionType}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRatesTask.data || {}}
                account={buildTransactionStepData.account}
                to={stepData.transaction.to}
                amount={stepData.transaction.amount}
                fee={stepData.transaction.fee}
                exit={stepData.transaction.exit}
                instantWithdrawal={instantWithdrawal}
                completeDelayedWithdrawal={completeDelayedWithdrawal}
                onDeposit={onDeposit}
                onForceExit={onForceExit}
                onWithdraw={onWithdraw}
                onExit={onExit}
                onTransfer={onTransfer}
              />
            )
          }
          case STEP_NAME.FINISH_TRANSACTION: {
            return (
              <TransactionConfirmation
                transactionType={transactionType}
                onFinishTransaction={() => onFinishTransaction(transactionType, accountIndex, redirectTo)}
              />
            )
          }
          default: {
            return <></>
          }
        }
      })()}
    </div>
  )
}

Transaction.propTypes = {
  wallet: PropTypes.object,
  metaMaskTokensTask: PropTypes.object,
  accountsTask: PropTypes.object,
  tokensTask: PropTypes.object,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRatesTask: PropTypes.object.isRequired,
  transactionType: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  currentStep: state.transaction.currentStep,
  steps: state.transaction.steps,
  wallet: state.global.wallet,
  metaMaskTokensTask: state.transaction.metaMaskTokensTask,
  accountsTask: state.transaction.accountsTask,
  tokensTask: state.transaction.tokensTask,
  pendingDeposits: state.global.pendingDeposits,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency
})

const getTransactionOverviewHeaderTitle = (transactionType) => {
  switch (transactionType) {
    case TxType.Deposit:
      return 'Deposit'
    case TxType.Transfer:
      return 'Send'
    case TxType.Exit:
    case TxType.Withdraw:
      return 'Withdraw'
    case TxType.ForceExit:
      return 'Force Withdrawal'
    default:
      return undefined
  }
}

const getHeaderCloseAction = (accountIndex) => {
  return accountIndex
    ? push(`/accounts/${accountIndex}`)
    : push('/')
}

const getHeader = (currentStep, transactionType, accountIndex, redirectTo) => {
  switch (currentStep) {
    case STEP_NAME.CHOOSE_ACCOUNT: {
      return {
        type: 'page',
        data: {
          title: transactionType === TxType.Deposit ? 'Deposit' : 'Token',
          closeAction: getHeaderCloseAction(accountIndex)
        }
      }
    }
    case STEP_NAME.BUILD_TRANSACTION: {
      return {
        type: 'page',
        data: {
          title: getTransactionOverviewHeaderTitle(transactionType),
          goBackAction: accountIndex
            ? push(`/accounts/${accountIndex}`)
            : transactionActions.changeCurrentStep(STEP_NAME.CHOOSE_ACCOUNT),
          closeAction: getHeaderCloseAction(accountIndex)
        }
      }
    }
    case STEP_NAME.REVIEW_TRANSACTION: {
      if (transactionType === TxType.Withdraw) {
        const action = redirectTo === WithdrawRedirectionRoute.Home
          ? push('/')
          : push(`/accounts/${accountIndex}`)

        return {
          type: 'page',
          data: {
            title: getTransactionOverviewHeaderTitle(transactionType),
            goBackAction: action,
            closeAction: action
          }
        }
      } else {
        return {
          type: 'page',
          data: {
            title: getTransactionOverviewHeaderTitle(transactionType),
            goBackAction: transactionActions.changeCurrentStep(STEP_NAME.BUILD_TRANSACTION),
            closeAction: getHeaderCloseAction(accountIndex)
          }
        }
      }
    }
    default: {
      return { type: undefined }
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: (currentStep, transactionType, accountIndex, redirectTo) =>
    dispatch(changeHeader(getHeader(currentStep, transactionType, accountIndex, redirectTo))),
  onCheckPendingDeposits: () => dispatch(globalThunks.checkPendingDeposits()),
  onLoadMetaMaskAccount: (tokenId) =>
    dispatch(transactionThunks.fetchMetaMaskAccount(tokenId)),
  onLoadHermezAccount: (accountIndex) =>
    dispatch(transactionThunks.fetchHermezAccount(accountIndex)),
  onLoadExit: (accountIndex, batchNum) =>
    dispatch(transactionThunks.fetchExit(accountIndex, batchNum)),
  onLoadFees: () =>
    dispatch(transactionThunks.fetchFees()),
  onLoadAccounts: (transactionType, fromItem) =>
    dispatch(transactionThunks.fetchAccounts(transactionType, fromItem)),
  onGoToChooseAccountStep: () =>
    dispatch(transactionActions.goToChooseAccountStep()),
  onGoToBuildTransactionStep: (account, receiver) =>
    dispatch(transactionActions.goToBuildTransactionStep(account, receiver)),
  onGoToTransactionOverviewStep: (transaction) =>
    dispatch(transactionActions.goToReviewTransactionStep(transaction)),
  onFinishTransaction: (transactionType, accountIndex, redirectTo) => {
    if (transactionType === TxType.Withdraw) {
      if (redirectTo === WithdrawRedirectionRoute.Home) {
        dispatch(push('/'))
      } else {
        dispatch(push(`/accounts/${accountIndex}`))
      }
    } else {
      dispatch(accountIndex ? push(`/accounts/${accountIndex}`) : push('/'))
    }
  },
  onDeposit: (amount, account) =>
    dispatch(transactionThunks.deposit(amount, account)),
  onForceExit: (amount, account) =>
    dispatch(transactionThunks.forceExit(amount, account)),
  onWithdraw: (amount, account, exit, completeDelayedWithdrawal, instantWithdrawal) =>
    dispatch(transactionThunks.withdraw(amount, account, exit, completeDelayedWithdrawal, instantWithdrawal)),
  onExit: (amount, account, fee) =>
    dispatch(transactionThunks.exit(amount, account, fee)),
  onTransfer: (amount, from, to, fee) =>
    dispatch(transactionThunks.transfer(amount, from, to, fee)),
  onCleanup: () =>
    dispatch(transactionActions.resetState())
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Transaction))

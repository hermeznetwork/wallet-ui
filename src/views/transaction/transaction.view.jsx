import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { push } from 'connected-react-router'

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
import { ACCOUNT_INDEX_SEPARATOR } from '../../constants'
import Spinner from '../shared/spinner/spinner.view'

export const TransactionType = {
  Deposit: 'deposit',
  Transfer: 'transfer',
  Withdraw: 'withdraw',
  Exit: 'exit',
  ForceExit: 'forceExit'
}

function Transaction ({
  currentStep,
  steps,
  metaMaskWalletTask,
  preferredCurrency,
  fiatExchangeRatesTask,
  transactionType,
  onChangeHeader,
  onLoadAccount,
  onLoadExit,
  onLoadFees,
  onLoadAccounts,
  onGoToChooseAccountStep,
  onGoToBuildTransactionStep,
  onGoToTransactionOverviewStep,
  onGoToFinishTransactionStep,
  onFinishTransaction,
  onAddPendingWithdraw,
  onCleanup
}) {
  const classes = useTransactionStyles()
  const { search } = useLocation()
  const urlSearchParams = new URLSearchParams(search)
  const accountIndex = urlSearchParams.get('accountIndex')
  const batchNum = Number(urlSearchParams.get('batchNum'))

  React.useEffect(() => {
    onChangeHeader(currentStep, transactionType, accountIndex)
  }, [currentStep, transactionType, accountIndex, onChangeHeader])

  React.useEffect(() => {
    if (accountIndex) {
      const [, , tokenId] = accountIndex.split(ACCOUNT_INDEX_SEPARATOR)

      if (batchNum) {
        onLoadExit(tokenId, batchNum, accountIndex)
      } else {
        onLoadAccount(tokenId)
      }
    } else {
      onGoToChooseAccountStep()
    }
  }, [batchNum, accountIndex, onLoadExit, onLoadAccount, onGoToChooseAccountStep])

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
                fiatExchangeRates={fiatExchangeRatesTask.status === 'successful' ? fiatExchangeRatesTask.data : {}}
                onLoadAccounts={onLoadAccounts}
                onAccountClick={onGoToBuildTransactionStep}
              />
            )
          }
          case STEP_NAME.BUILD_TRANSACTION: {
            const stepData = steps[STEP_NAME.BUILD_TRANSACTION]

            return (
              <TransactionForm
                account={stepData.account}
                transactionType={transactionType}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRatesTask.status === 'successful' ? fiatExchangeRatesTask.data : {}}
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
                metaMaskWallet={metaMaskWalletTask.status === 'successful' ? metaMaskWalletTask.data : {}}
                transactionType={transactionType}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRatesTask.status === 'successful' ? fiatExchangeRatesTask.data : {}}
                account={buildTransactionStepData.account}
                to={stepData.transaction.to}
                amount={stepData.transaction.amount}
                fee={stepData.transaction.fee}
                exit={stepData.transaction.exit}
                onGoToFinishTransactionStep={onGoToFinishTransactionStep}
                onAddPendingWithdraw={onAddPendingWithdraw}
              />
            )
          }
          case STEP_NAME.FINISH_TRANSACTION: {
            return (
              <TransactionConfirmation
                transactionType={transactionType}
                onFinishTransaction={() => onFinishTransaction(accountIndex)}
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
  metaMaskWalletTask: PropTypes.object,
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
  metaMaskWalletTask: state.global.metaMaskWalletTask,
  metaMaskTokensTask: state.transaction.metaMaskTokensTask,
  accountsTask: state.transaction.accountsTask,
  tokensTask: state.transaction.tokensTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.settings.preferredCurrency
})

const getTransactionOverviewHeaderTitle = (transactionType) => {
  switch (transactionType) {
    case TransactionType.Deposit:
      return 'Deposit'
    case TransactionType.Transfer:
      return 'Send'
    case TransactionType.Exit:
    case TransactionType.Withdraw:
      return 'Withdraw'
    case TransactionType.ForceExit:
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

const getHeader = (currentStep, transactionType, accountIndex) => {
  switch (currentStep) {
    case STEP_NAME.CHOOSE_ACCOUNT: {
      return {
        type: 'page',
        data: {
          title: 'Token',
          closeAction: getHeaderCloseAction(accountIndex)
        }
      }
    }
    case STEP_NAME.BUILD_TRANSACTION: {
      return {
        type: 'page',
        data: {
          title: 'Amount',
          goBackAction: accountIndex
            ? push(`/accounts/${accountIndex}`)
            : transactionActions.changeCurrentStep(STEP_NAME.CHOOSE_ACCOUNT),
          closeAction: getHeaderCloseAction(accountIndex)
        }
      }
    }
    case STEP_NAME.REVIEW_TRANSACTION: {
      return {
        type: 'page',
        data: {
          title: getTransactionOverviewHeaderTitle(transactionType),
          goBackAction: transactionActions.changeCurrentStep(STEP_NAME.BUILD_TRANSACTION),
          closeAction: getHeaderCloseAction(accountIndex)
        }
      }
    }
    default: {
      return { type: undefined }
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: (currentStep, transactionType, tokenId) =>
    dispatch(changeHeader(getHeader(currentStep, transactionType, tokenId))),
  onLoadAccount: () =>
    dispatch(transactionThunks.fetchAccount()),
  onLoadExit: (tokenId, batchNum, accountIndex) =>
    dispatch(transactionThunks.fetchExit(tokenId, batchNum, accountIndex)),
  onLoadFees: () =>
    dispatch(transactionThunks.fetchFees()),
  onLoadAccounts: (transactionType, fromItem) =>
    dispatch(transactionThunks.fetchAccounts(transactionType, fromItem)),
  onGoToChooseAccountStep: () =>
    dispatch(transactionActions.goToChooseAccountStep()),
  onGoToBuildTransactionStep: (account) =>
    dispatch(transactionActions.goToBuildTransactionStep(account)),
  onGoToTransactionOverviewStep: (transaction) =>
    dispatch(transactionActions.goToReviewTransactionStep(transaction)),
  onGoToFinishTransactionStep: (type) =>
    dispatch(transactionActions.goToFinishTransactionStep()),
  onAddPendingWithdraw: (hermezAddress, pendingWithdraw) =>
    dispatch(globalThunks.addPendingWithdraw(hermezAddress, pendingWithdraw)),
  onFinishTransaction: (accountIndex) =>
    dispatch(accountIndex ? push(`/accounts/${accountIndex}`) : push('/')),
  onCleanup: () =>
    dispatch(transactionActions.resetState())
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Transaction))

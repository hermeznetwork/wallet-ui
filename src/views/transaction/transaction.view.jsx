import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
// import { push } from 'connected-react-router'

import * as transactionThunks from '../../store/transaction/transaction.thunks'
import * as transactionActions from '../../store/transaction/transaction.actions'
import useTransactionStyles from './transaction.styles'
import TransactionForm from './components/transaction-form/transaction-form.view'
import TransactionOverview from './components/transaction-overview/transaction-overview.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import Container from '../shared/container/container.view'
import { STEP_NAME } from '../../store/transaction/transaction.reducer'
import AccountSelector from './components/account-selector/account-selector.view'
import TransactionConfirmation from './components/transaction-confirmation/transaction-confirmation.view'
import { push } from 'connected-react-router'
import { changeHeader } from '../../store/global/global.actions'
import { useTheme } from 'react-jss'

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
  metaMaskTokensTask,
  accountsTask,
  tokensTask,
  feesTask,
  exitTask,
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
  onCleanup
}) {
  const theme = useTheme()
  const classes = useTransactionStyles()
  const { search } = useLocation()
  const urlSearchParams = new URLSearchParams(search)
  const tokenId = Number(urlSearchParams.get('tokenId'))
  const batchNum = Number(urlSearchParams.get('batchNum'))
  const accountIndex = urlSearchParams.get('accountIndex')

  React.useEffect(() => {
    if (tokenId && batchNum && accountIndex) {
      onLoadExit(tokenId, batchNum, accountIndex)
    } else if (tokenId && !batchNum && !accountIndex) {
      onLoadAccount(tokenId)
    } else {
      onGoToChooseAccountStep()
    }
  }, [tokenId, batchNum, accountIndex, onLoadExit, onLoadAccount, onGoToChooseAccountStep])

  React.useEffect(() => {
    onChangeHeader(currentStep, transactionType, tokenId, theme)
  }, [currentStep, transactionType, tokenId, theme, onChangeHeader])

  React.useEffect(() => onCleanup, [onCleanup])

  return (
    <section className={classes.wrapper}>
      <Container disableVerticalGutters>
        {(() => {
          switch (currentStep) {
            case STEP_NAME.LOAD_INITIAL_DATA: {
              return <p>Loading</p>
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
                  type={transactionType}
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
                  type={transactionType}
                  preferredCurrency={preferredCurrency}
                  fiatExchangeRates={fiatExchangeRatesTask.status === 'successful' ? fiatExchangeRatesTask.data : {}}
                  account={buildTransactionStepData.account}
                  to={stepData.transaction.to}
                  amount={stepData.transaction.amount}
                  fee={stepData.transaction.fee}
                  exit={stepData.transaction.exit}
                  onGoToFinishTransactionStep={onGoToFinishTransactionStep}
                />
              )
            }
            case STEP_NAME.FINISH_TRANSACTION: {
              return (
                <TransactionConfirmation
                  transactionType={transactionType}
                  onFinishTransaction={() => onFinishTransaction(tokenId)}
                />
              )
            }
            default: {
              return <></>
            }
          }
        })()}
      </Container>
    </section>
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
      return 'Withdraw'
    case TransactionType.Withdraw:
      return 'Withdraw'
    case TransactionType.ForceExit:
      return 'Force Withdrawal'
    default:
      return undefined
  }
}

const getHeader = (currentStep, transactionType, tokenId, theme) => {
  switch (currentStep) {
    case STEP_NAME.CHOOSE_ACCOUNT: {
      return {
        type: 'page',
        data: {
          title: 'Token',
          backgroundColor: theme.palette.white,
          closeAction: push('/')
        }
      }
    }
    case STEP_NAME.BUILD_TRANSACTION: {
      return {
        type: 'page',
        data: {
          title: 'Amount',
          backgroundColor: theme.palette.white,
          goBackAction: tokenId
            ? push('/')
            : transactionActions.changeCurrentStep(STEP_NAME.CHOOSE_ACCOUNT),
          closeAction: push('/')
        }
      }
    }
    case STEP_NAME.REVIEW_TRANSACTION: {
      return {
        type: 'page',
        data: {
          title: getTransactionOverviewHeaderTitle(transactionType),
          backgroundColor: theme.palette.primary.main,
          goBackAction: transactionActions.changeCurrentStep(STEP_NAME.BUILD_TRANSACTION),
          closeAction: push('/')
        }
      }
    }
    default: {
      return { type: undefined }
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: (currentStep, transactionType, tokenId, theme) =>
    dispatch(changeHeader(getHeader(currentStep, transactionType, tokenId, theme))),
  onLoadAccount: () =>
    dispatch(transactionThunks.fetchAccount()),
  onLoadExit: (batchNum, accountIndex) =>
    dispatch(transactionThunks.fetchExit(batchNum, accountIndex)),
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
  onFinishTransaction: () =>
    dispatch(push('/')),
  onCleanup: () =>
    dispatch(transactionActions.resetState())
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Transaction))

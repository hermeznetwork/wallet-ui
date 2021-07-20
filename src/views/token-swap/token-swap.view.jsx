import { push } from 'connected-react-router'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useTokenSwapStyles from './token-swap.styles'
import * as globalActions from '../../store/global/global.actions'
import * as tokenSwapActions from '../../store/token-swap/token-swap.actions'
import * as tokenSwapThunks from '../../store/token-swap/token-swap.thunks'
import Container from '../shared/container/container.view'
import { STEP_NAME } from '../../store/token-swap/token-swap.reducer'
import Quotes from './components/quotes/quotes.view'
import SwapForm from './components/swap-form/swap-form.view'
import OfferSidenav from './components/offer-sidenav/offer-sidenav.view'

function TokenSwap ({
  currentStep,
  steps,
  onChangeHeader,
  onCleanup,
  onGoToQuotes,
  onOpenOfferInfo,
  preferredCurrency,
  onLoadAccounts,
  accountsTask,
  fiatExchangeRatesTask
}) {
  const classes = useTokenSwapStyles()
  const [isOfferSidenavOpen, setIsOfferSidenavOpen] = React.useState()

  React.useEffect(() => {
    onChangeHeader(currentStep)
  }, [currentStep])

  React.useEffect(() => onCleanup, [onCleanup])

  React.useEffect(() => {
    console.log(accountsTask)
    if (accountsTask.status === 'pending') {
      onLoadAccounts(undefined)
    }
  }, [accountsTask])

  function handleOpenOfferSidenav () {
    setIsOfferSidenavOpen(true)
  }

  function handleCloseOfferSidenav () {
    setIsOfferSidenavOpen(false)
  }
  console.log(accountsTask)
  return (
    <div className={classes.root}>
      <Container addHeaderPadding disableTopGutter>
        {(() => {
          switch (currentStep) {
            case STEP_NAME.SWAP: {
              return (
                <SwapForm
                  onGoToQuotes={onGoToQuotes}
                  onOpenOfferSidenav={handleOpenOfferSidenav}
                  accounts={accountsTask.data.accounts}
                  preferredCurrency={preferredCurrency}
                  fiatExchangeRates={fiatExchangeRatesTask}
                />
              )
            }
            case STEP_NAME.QUOTES: {
              return <Quotes onOpenOfferSidenav={handleOpenOfferSidenav} />
            }
          }
        })()}
      </Container>
      {isOfferSidenavOpen && <OfferSidenav onClose={handleCloseOfferSidenav} />}
    </div>
  )
}

const getHeader = currentStep => {
  switch (currentStep) {
    case STEP_NAME.SWAP: {
      return {
        type: 'page',
        data: {
          title: 'Swap',
          closeAction: push('/')
        }
      }
    }
    case STEP_NAME.QUOTES: {
      return {
        type: 'page',
        data: {
          title: 'Quotes',
          goBackAction: tokenSwapActions.goToSwap()
        }
      }
    }
  }
}

TokenSwap.propTypes = {
  totalAccountsBalanceTask: PropTypes.object,
  accountsTask: PropTypes.object,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRatesTask: PropTypes.object,
  poolTransactionsTask: PropTypes.object.isRequired,
  exitsTask: PropTypes.object.isRequired,
  pendingWithdraws: PropTypes.object.isRequired,
  pendingDelayedWithdraws: PropTypes.object.isRequired,
  onLoadTotalBalance: PropTypes.func.isRequired,
  onLoadAccounts: PropTypes.func.isRequired,
  onLoadPoolTransactions: PropTypes.func.isRequired,
  onLoadExits: PropTypes.func.isRequired,
  onAddPendingDelayedWithdraw: PropTypes.func.isRequired,
  onRemovePendingDelayedWithdraw: PropTypes.func.isRequired,
  onNavigateToAccountDetails: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  currentStep: state.tokenSwap.currentStep,
  steps: state.tokenSwap.steps,
  wallet: state.global.wallet,
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  pendingDepositsCheckTask: state.global.pendingDepositsCheckTask,
  totalBalanceTask: state.tokenSwap.totalBalanceTask,
  accountsTask: state.tokenSwap.accountsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency,
  poolTransactionsTask: state.home.poolTransactionsTask,
  exitsTask: state.home.exitsTask,
  pendingWithdraws: state.global.pendingWithdraws,
  pendingDelayedWithdraws: state.global.pendingDelayedWithdraws,
  pendingDeposits: state.global.pendingDeposits,
  coordinatorStateTask: state.global.coordinatorStateTask,
  rewards: state.global.rewards
})

const mapDispatchToProps = dispatch => ({
  onChangeHeader: currentStep =>
    dispatch(globalActions.changeHeader(getHeader(currentStep))),
  onGoToQuotes: () => dispatch(tokenSwapActions.goToQuotes()),
  onCleanup: () => dispatch(tokenSwapActions.resetState()),
  onLoadAccounts: fromItem => dispatch(tokenSwapThunks.fetchAccounts(fromItem))
})

export default connect(mapStateToProps, mapDispatchToProps)(TokenSwap)

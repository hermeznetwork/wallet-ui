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
  accountsTask: PropTypes.object,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRatesTask: PropTypes.object,
  currentStep: PropTypes.string,
  steps: PropTypes.object,
  onChangeHeader: PropTypes.func,
  onCleanup: PropTypes.func,
  onGoToQuotes: PropTypes.func,
  onOpenOfferInfo: PropTypes.func,
  onLoadAccounts: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  currentStep: state.tokenSwap.currentStep,
  steps: state.tokenSwap.steps,
  accountsTask: state.tokenSwap.accountsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency
})

const mapDispatchToProps = dispatch => ({
  onChangeHeader: currentStep =>
    dispatch(globalActions.changeHeader(getHeader(currentStep))),
  onGoToQuotes: () => dispatch(tokenSwapActions.goToQuotes()),
  onCleanup: () => dispatch(tokenSwapActions.resetState()),
  onLoadAccounts: fromItem => dispatch(tokenSwapThunks.fetchAccounts(fromItem))
})

export default connect(mapStateToProps, mapDispatchToProps)(TokenSwap)

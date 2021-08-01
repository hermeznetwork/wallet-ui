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
import QuoteSelector from './components/quote-selector/quote-selector.view'
import SwapForm from './components/swap-form/swap-form.view'
import QuoteSidenav from './components/quote-sidenav/quote-sidenav.view'
import { AmountBoxPosition } from './components/amount-box/amount-box.view'

function TokenSwap ({
  currentStep,
  steps,
  quoteSidenav,
  onChangeHeader,
  onCleanup,
  onGoToQuotes,
  onOpenOfferInfo,
  preferredCurrency,
  onLoadAccounts,
  accountsTask,
  quotesTask,
  fiatExchangeRatesTask,
  onOpenQuoteSidenav,
  onCloseQuoteSidenav
}) {
  const classes = useTokenSwapStyles()
  const [selectedTokens, setSelectedTokens] = React.useState({})
  const [bestQuote] = React.useState(quotesTask.data[0])
  const [selectedQuote, setSelectedQuote] = React.useState(quotesTask.data[0])

  React.useEffect(() => {
    onChangeHeader(currentStep)
  }, [currentStep])

  React.useEffect(() => onCleanup, [onCleanup])

  function handleSelectedTokensChange (selectedTokens) {
    setSelectedTokens(selectedTokens)
  }

  function handleQuoteSelect (quote) {
    setSelectedQuote(quote)
  }

  return (
    <div className={classes.root}>
      <Container addHeaderPadding disableTopGutter>
        {(() => {
          switch (currentStep) {
            case STEP_NAME.SWAP: {
              return (
                <SwapForm
                  accounts={accountsTask}
                  preferredCurrency={preferredCurrency}
                  fiatExchangeRates={fiatExchangeRatesTask}
                  selectedTokens={selectedTokens}
                  onGoToQuotes={onGoToQuotes}
                  onOpenQuoteSidenav={() => onOpenQuoteSidenav(selectedQuote)}
                  onLoadAccounts={onLoadAccounts}
                  onSelectedTokensChange={handleSelectedTokensChange}
                />
              )
            }
            case STEP_NAME.QUOTES: {
              return (
                <QuoteSelector
                  quotes={quotesTask.data}
                  bestQuote={bestQuote}
                  selectedQuote={selectedQuote}
                  toToken={selectedTokens[AmountBoxPosition.TO]}
                  onQuoteSelect={handleQuoteSelect}
                  onOpenQuoteSidenav={onOpenQuoteSidenav}
                />
              )
            }
          }
        })()}
      </Container>
      {quoteSidenav.status === 'open' && (
        <QuoteSidenav
          onClose={onCloseQuoteSidenav}
          quote={quoteSidenav.data}
        />
      )}
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
  quotesTask: state.tokenSwap.quotesTask,
  quoteSidenav: state.tokenSwap.quoteSidenav,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency
})

const mapDispatchToProps = dispatch => ({
  onChangeHeader: currentStep =>
    dispatch(globalActions.changeHeader(getHeader(currentStep))),
  onGoToQuotes: () => dispatch(tokenSwapActions.goToQuotes()),
  onCleanup: () => dispatch(tokenSwapActions.resetState()),
  onLoadAccounts: fromItem => dispatch(tokenSwapThunks.fetchAccounts(fromItem)),
  onOpenQuoteSidenav: (quote) => dispatch(tokenSwapActions.openQuoteSidenav(quote)),
  onCloseQuoteSidenav: () => dispatch(tokenSwapActions.closeQuoteSidenav())
})

export default connect(mapStateToProps, mapDispatchToProps)(TokenSwap)

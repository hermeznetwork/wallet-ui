import { push } from 'connected-react-router'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BigNumber } from 'ethers'

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
  quoteSidenav,
  preferredCurrency,
  accountsTask,
  quotesTask,
  fiatExchangeRatesTask,
  onLoadAccounts,
  onLoadQuotes,
  onChangeHeader,
  onCleanup,
  onGoToQuotes,
  onOpenQuoteSidenav,
  onCloseQuoteSidenav
}) {
  const classes = useTokenSwapStyles()
  const [amountFrom, setAmountFrom] = React.useState(BigNumber.from(0))
  const [amountTo, setAmountTo] = React.useState(BigNumber.from(0))
  const [selectedTokens, setSelectedTokens] = React.useState({})
  const [bestQuote, setBestQuote] = React.useState()
  const [selectedQuote, setSelectedQuote] = React.useState(undefined)

  React.useEffect(() => {
    if (quotesTask.status === 'successful') {
      const bestQuote = quotesTask.data.reduce((quote, bestQuote) => {
        if (!bestQuote) {
          return quote
        }

        return BigNumber(quote.amountToToken).gt(BigNumber(bestQuote).amountToToken)
          ? quote
          : bestQuote
      })

      setBestQuote(bestQuote)
      setSelectedQuote(bestQuote)
    }
  }, [quotesTask])

  React.useEffect(() => {
    onChangeHeader(currentStep)
  }, [currentStep])

  React.useEffect(() => onCleanup, [onCleanup])

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
                  quotes={quotesTask}
                  preferredCurrency={preferredCurrency}
                  fiatExchangeRates={fiatExchangeRatesTask}
                  amountFrom={amountFrom}
                  amountTo={amountTo}
                  selectedTokens={selectedTokens}
                  selectedQuote={selectedQuote}
                  bestQuote={bestQuote}
                  onAmountFromChange={setAmountFrom}
                  onAmountToChange={setAmountTo}
                  onSelectedTokensChange={setSelectedTokens}
                  onLoadQuotes={onLoadQuotes}
                  onLoadAccounts={onLoadAccounts}
                  onGoToQuotes={onGoToQuotes}
                  onOpenQuoteSidenav={() => onOpenQuoteSidenav(selectedQuote)}
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
  quotesTask: PropTypes.object,
  preferredCurrency: PropTypes.string,
  fiatExchangeRatesTask: PropTypes.object,
  currentStep: PropTypes.string,
  selectedLpId: PropTypes.string,
  onChangeHeader: PropTypes.func,
  onCleanup: PropTypes.func,
  onGoToQuotes: PropTypes.func,
  onOpenOfferInfo: PropTypes.func,
  onLoadAccounts: PropTypes.func,
  onLoadQuotes: PropTypes.func,
  onLoadingQuotes: PropTypes.func
}

const mapStateToProps = state => ({
  currentStep: state.tokenSwap.currentStep,
  accountsTask: state.tokenSwap.accountsTask,
  quotesTask: state.tokenSwap.quotesTask,
  quoteSidenav: state.tokenSwap.quoteSidenav,
  selectedLpId: state.tokenSwap.selectedLpId,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency
})

const mapDispatchToProps = dispatch => ({
  onChangeHeader: currentStep =>
    dispatch(globalActions.changeHeader(getHeader(currentStep))),
  onGoToQuotes: () => dispatch(tokenSwapActions.goToQuotes()),
  onCleanup: () => dispatch(tokenSwapActions.resetState()),
  onLoadAccounts: fromItem => dispatch(tokenSwapThunks.fetchAccounts(fromItem)),
  onLoadQuotes: request => dispatch(tokenSwapThunks.getQuotes(request)),
  onOpenQuoteSidenav: (quote) => dispatch(tokenSwapActions.openQuoteSidenav(quote)),
  onCloseQuoteSidenav: () => dispatch(tokenSwapActions.closeQuoteSidenav())
})

export default connect(mapStateToProps, mapDispatchToProps)(TokenSwap)

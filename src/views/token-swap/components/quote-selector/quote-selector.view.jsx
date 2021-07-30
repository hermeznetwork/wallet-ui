import React from 'react'
import QuoteList from '../quote-list/quote-list.view'
import useQuoteSelectorStyles from './quote-selector.styles'

function QuoteSelector ({ quotes, toToken, selectedQuote, onOpenOfferSidenav, onQuoteSelect }) {
  const classes = useQuoteSelectorStyles()

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <p>Liquidity provider</p>
        <p>You get (ETH)</p>
        <p>Reward</p>
      </div>
      <QuoteList
        quotes={quotes}
        toToken={toToken}
        selectedQuote={selectedQuote}
        onQuoteSelect={onQuoteSelect}
      />
    </div>
  )
}

export default QuoteSelector

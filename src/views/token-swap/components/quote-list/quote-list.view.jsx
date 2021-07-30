import React from 'react'

import Quote from '../quote/quote.view'
import useQuoteListStyles from './quote-list.styles'

function QuoteList ({ toToken, quotes, selectedQuote, onQuoteSelect }) {
  const classes = useQuoteListStyles()

  return (
    <div className={classes.root}>
      {quotes.map((quote) => (
        <div
          key={quote.lpId}
          className={classes.quote}
        >
          <Quote
            id={quote.lpId}
            info={quote.lpInfo}
            toToken={toToken}
            amountToToken={quote.amountToToken}
            selectedQuote={selectedQuote}
            onSelect={() => onQuoteSelect(quote)}
          />
        </div>
      ))}
    </div>
  )
}

export default QuoteList

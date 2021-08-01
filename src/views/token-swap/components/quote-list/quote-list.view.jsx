import React from 'react'
import { BigNumber } from 'ethers'

import Quote from '../quote/quote.view'
import useQuoteListStyles from './quote-list.styles'

function QuoteList ({
  toToken,
  quotes,
  bestQuote,
  selectedQuote,
  onQuoteSelect,
  onShowMoreQuoteInfo
}) {
  const classes = useQuoteListStyles()

  function getBestQuoteAmountDiff (quote) {
    return BigNumber.from(quote.amountToToken).sub(BigNumber.from(bestQuote.amountToToken))
  }

  return (
    <div className={classes.root}>
      {quotes.map((quote) => (
        <div
          key={quote.lpId}
          className={classes.quote}
        >
          <Quote
            info={quote.lpInfo}
            toToken={toToken}
            amountToToken={quote.amountToToken}
            amountToTokenDiff={getBestQuoteAmountDiff(quote)}
            isTheBest={quote.lpId === bestQuote.lpId}
            isSelected={quote.lpId === selectedQuote.lpId}
            onSelect={() => onQuoteSelect(quote)}
            onShowMoreInfo={() => onShowMoreQuoteInfo(quote)}
          />
        </div>
      ))}
    </div>
  )
}

export default QuoteList

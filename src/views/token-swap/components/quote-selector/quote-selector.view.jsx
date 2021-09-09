import React from "react";
import QuoteList from "../quote-list/quote-list.view";
import useQuoteSelectorStyles from "./quote-selector.styles";

function QuoteSelector({
  quotes,
  toToken,
  bestQuote,
  selectedQuote,
  onQuoteSelect,
  onOpenQuoteSidenav,
}) {
  const classes = useQuoteSelectorStyles();

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <p className={classes.nameHeader}>Liquidity provider</p>
        <p className={classes.toTokensHeader}>You get (ETH)</p>
        <p className={classes.rewardHeader}>Reward</p>
      </div>
      <QuoteList
        quotes={quotes}
        toToken={toToken}
        bestQuote={bestQuote}
        selectedQuote={selectedQuote}
        onQuoteSelect={onQuoteSelect}
        onShowMoreQuoteInfo={onOpenQuoteSidenav}
      />
    </div>
  );
}

export default QuoteSelector;

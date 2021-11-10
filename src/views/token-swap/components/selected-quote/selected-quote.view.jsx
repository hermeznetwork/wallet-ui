import React from "react";
import PropTypes from "prop-types";

import useSelectedQuoteStyles from "./selected-quote.style";
import Spinner from "../../../shared/spinner/spinner.view";
import {
  getTokenAmountInPreferredCurrency,
  getFixedTokenAmount,
  CurrencySymbol,
} from "../../../../utils/currencies";
import { MAX_TOKEN_DECIMALS } from "../../../../constants";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";

function SelectedQuote({
  selectedTokens,
  selectedQuote,
  isLoading,
  bestQuote,
  fiatExchangeRates,
  preferredCurrency,
  onGoToQuotes,
  onOpenQuoteSidenav,
}) {
  const classes = useSelectedQuoteStyles();

  function getRewardAmountInTokens() {
    return getFixedTokenAmount(
      selectedQuote.lpInfo.rewards[0].amount,
      selectedTokens.to.token.decimals
    );
  }

  function getRewardAmountInFiat() {
    return getTokenAmountInPreferredCurrency(
      getRewardAmountInTokens(),
      selectedTokens.from.token.USD,
      preferredCurrency,
      fiatExchangeRates
    );
  }

  function isBestQuote() {
    return selectedQuote.lpId === bestQuote.lpId;
  }

  return (
    <div className={classes.root}>
      {isLoading ? (
        <div className={classes.loading}>
          <p className={classes.loadingText}>Searching for the best offers</p>
          <Spinner />
        </div>
      ) : (
        selectedQuote && (
          <div className={classes.offerBox}>
            <div className={classes.row}>
              <div className={classes.quote}>
                <p className={classes.quoteText}>
                  {isBestQuote() ? "Best quote" : "Quote"} from {selectedQuote.lpInfo.name}
                </p>
                <p className={classes.quoteRate}>
                  1 {selectedTokens.from?.token.symbol}
                  &nbsp;=&nbsp;
                  {selectedQuote.rate.toFixed(MAX_TOKEN_DECIMALS)} {selectedTokens.to.token.symbol}
                </p>
              </div>
              <button className={classes.quotes} onClick={onGoToQuotes}>
                All quotes
              </button>
            </div>
            <p className={classes.reward}>
              This swap is rewarded with {getRewardAmountInTokens()}{" "}
              {selectedQuote.lpInfo.rewards[0].token}&nbsp; (
              <FiatAmount amount={getRewardAmountInFiat()} currency={preferredCurrency} />)
              <button className={classes.moreInfo} onClick={onOpenQuoteSidenav}>
                More info
              </button>
            </p>
          </div>
        )
      )}
    </div>
  );
}

SelectedQuote.propTypes = {
  quotes: PropTypes.object,
  fiatExchangeRates: PropTypes.object,
  preferredCurrency: PropTypes.string,
  selectedTokens: PropTypes.object,
  selectedLpId: PropTypes.string,
  isLoading: PropTypes.bool,
  onGoToQuotes: PropTypes.func,
  onOpenQuoteSidenav: PropTypes.func,
};

export default SelectedQuote;

import React from 'react'
import PropTypes from 'prop-types'

import useSelectedQuoteStyles from './selected-quote.style'
import Spinner from '../../../shared/spinner/spinner.view'
import {
  getTokenAmountInPreferredCurrency,
  getFixedTokenAmount
  , CurrencySymbol
} from '../../../../utils/currencies'
import { MAX_TOKEN_DECIMALS } from '../../../../constants'

function SelectedQuote ({
  quotes,
  fiatExchangeRates,
  preferredCurrency,
  selectedTokens,
  selectedLpId,
  onGoToQuotes,
  onOpenOfferSidenav
}) {
  const classes = useSelectedQuoteStyles()
  const isBestQuote = selectedLpId === 'best'
  const isLoading = quotes.status === 'loading'
  const isSuccessful = quotes.status === 'successful'

  const [quote, setQuote] = React.useState({ rate: 0 })
  const [fiatReward, setFiatReward] = React.useState(0)
  const [reward, setReward] = React.useState(0)

  React.useEffect(() => {
    if (quotes.data) {
      const selectedQuote = isBestQuote
        ? quotes.data[0]
        : quotes.data.find(q => q.lpId === selectedLpId)
      setQuote(selectedQuote)

      const rewardAmount = getFixedTokenAmount(
        selectedQuote.lpInfo.rewards[0].amount,
        selectedTokens.to.token.decimals
      )
      const fiatRewardAmount = getTokenAmountInPreferredCurrency(
        rewardAmount,
        selectedTokens.from.token.USD,
        preferredCurrency,
        fiatExchangeRates
      )

      setFiatReward(fiatRewardAmount)
      setReward(rewardAmount)
    }
  }, [quotes])

  return (
    <div className={classes.root}>
      {isLoading &&
        <div className={classes.loading}>
          <p className={classes.loadingText}>Searching for the best offers</p>
          <Spinner />
        </div>}
      {isSuccessful &&
        <div className={classes.offerBox}>
          <div className={classes.row}>
            <div className={classes.quote}>
              <p className={classes.quoteText}>
                {isBestQuote ? 'Best q' : 'Q'}uote from {quote.lpInfo?.name}
              </p>
              <p className={classes.quoteRate}>
                1 {selectedTokens.from?.token.symbol}
                = {quote.rate.toFixed(MAX_TOKEN_DECIMALS)} {selectedTokens.to?.token.symbol}
              </p>
            </div>
            <button className={classes.quotes} onClick={onGoToQuotes}>All quotes</button>
          </div>
          <p className={classes.reward}>
            This swap is rewarded with {reward} {quote.lpInfo?.rewards[0].token}  (
            {CurrencySymbol[preferredCurrency].symbol} {fiatReward.toFixed(2)}
            ) <button className={classes.moreInfo} onClick={onOpenOfferSidenav}>More info</button>
          </p>
        </div>}
    </div>
  )
}

SelectedQuote.propTypes = {
  quotes: PropTypes.object,
  fiatExchangeRates: PropTypes.object,
  preferredCurrency: PropTypes.string,
  selectedTokens: PropTypes.object,
  selectedLpId: PropTypes.string,
  onGoToQuotes: PropTypes.func,
  onOpenOfferSidenav: PropTypes.func
}

export default SelectedQuote

import React from 'react'
import PropTypes from 'prop-types'

import useOffersStyles from './offers.style'
import Spinner from '../../../shared/spinner/spinner.view'
import {
  getTokenAmountInPreferredCurrency,
  getFixedTokenAmount
  , CurrencySymbol
} from '../../../../utils/currencies'

function Offers ({
  quotes,
  fiatExchangeRates,
  preferredCurrency,
  selectedTokens,
  onGoToQuotes
}) {
  const classes = useOffersStyles()
  const isBestQuote = quotes.selected === 'best'
  const isLoading = quotes.status === 'loading'
  const successful = quotes.status === 'successful'
  const failure = quotes.status === 'failure'

  const [quote, setQuote] = React.useState({ rate: 0 })
  const [fiatReward, setFiatReward] = React.useState(0)
  const [reward, setReward] = React.useState(0)
  const [timeUntilValid, setTimeUntilValid] = React.useState(30000)

  React.useEffect(() => {
    console.log(quotes)
    if (quotes.data.quotes && quotes.status === 'successful') {
      const selectedQuote = isBestQuote
        ? quotes.data.quotes[0]
        : quotes.data.quotes.find(q => q.lpId === quotes.selected)
      setQuote(selectedQuote)
      console.log(selectedTokens)

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
      console.log(quotes.data.quotes[0].validUntil)
      setTimeUntilValid(30000 - 1000) // TODO should be launched with validUntil in miliseconds from quotes instead 30000
    }
  }, [quotes])

  React.useEffect(() => {
    if (timeUntilValid <= 0) return
    const timer = setTimeout(() => setTimeUntilValid(timeUntilValid - 1000), 1000)
    return () => clearTimeout(timer)
  }, [timeUntilValid])

  const msToTime = (ms) => {
    let s = ms / 1000
    const secs = s % 60
    s = (s - secs) / 60
    const mins = s % 60

    return `${mins.toString().padStart(2, '0')}:${secs.toFixed(0).toString().padStart(2, '0')}`
  }

  const renderBtnText = {
    successful: `Swap ${msToTime(timeUntilValid)}`,
    failure: 'Insufficient liquidity'
  }
  return (
    <div className={classes.root}>
      {isLoading &&
        <div className={classes.loading}>
          <p>Searching for the best offers</p>
          <Spinner />
        </div>}
      {successful &&
        <div className={classes.offerBox}>
          <div className={classes.row}>
            <div className={classes.quote}>
              <p className={classes.quoteText}>
                {isBestQuote ? 'Best q' : 'Q'}uote from {quote.lpInfo?.name}
              </p>
              <p className={classes.quoteRate}>
                1 {selectedTokens.from.token.symbol}
                = {quote.rate.toFixed(6)} {selectedTokens.to.token.symbol}
              </p>
            </div>
            <button className={classes.quotes} onClick={onGoToQuotes}>All quotes</button>
          </div>
          <p className={classes.reward}>
            This swap is rewarded with {reward} {quote.lpInfo?.rewards[0].token}  (
            {CurrencySymbol[preferredCurrency].symbol} {fiatReward.toFixed(2)}
            ) <span className={classes.moreInfo}>More info</span>
          </p>
        </div>}
      {['successful', 'failure'].includes(quotes.status) &&
        <div className={classes.buttonBox}>
          <button
            className={`${classes.button} ${(failure || timeUntilValid <= 0) && classes.btnDisabled}`}
            disabled={failure || timeUntilValid > 0}
          >
            {timeUntilValid > 0
              ? renderBtnText[quotes.status]
              : 'Time expired'}
          </button>
        </div>}
    </div>
  )
}

Offers.propTypes = {
  quotes: PropTypes.object,
  fiatExchangeRates: PropTypes.object,
  preferredCurrency: PropTypes.string,
  selectedTokens: PropTypes.object,
  onGoToQuotes: PropTypes.func
}

export default Offers

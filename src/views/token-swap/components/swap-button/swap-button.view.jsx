import React from 'react'
import PropTypes from 'prop-types'

import useSwapButtonStyles from './swap-button.style'

function SwapButton ({
  quotes
}) {
  const classes = useSwapButtonStyles()
  const failure = quotes.status === 'failure'

  const [timeUntilValid, setTimeUntilValid] = React.useState(30000)

  React.useEffect(() => {
    setTimeUntilValid(30000 - 1000)
    // TODO should be launched with validUntil in miliseconds from quotes instead 30000
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

SwapButton.propTypes = {
  quotes: PropTypes.object
}

export default SwapButton

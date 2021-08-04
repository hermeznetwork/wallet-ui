import React from 'react'
import PropTypes from 'prop-types'

import FormButton from '../../../shared/form-button/form-button.view'
import useSwapButtonStyles from './swap-button.style'

function SwapButton ({ quotes }) {
  const classes = useSwapButtonStyles()
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

  const buttonLabels = {
    successful: `Swap ${msToTime(timeUntilValid)}`,
    failure: 'Insufficient liquidity'
  }

  return (
    <div className={classes.root}>
      {['successful', 'failure'].includes(quotes.status) &&
        <div className={classes.buttonBox}>
          <FormButton
            label={
              timeUntilValid > 0
                ? buttonLabels[quotes.status]
                : 'Time expired'
            }
            disabled={quotes.status === 'failure' || timeUntilValid <= 0}
          />
        </div>}
    </div>
  )
}

SwapButton.propTypes = {
  quotes: PropTypes.object
}

export default SwapButton

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Redirect } from 'react-router-dom'

import useExitStyles from './exit.styles'
import { CurrencySymbol } from '../../../utils/currencies'
import infoIcon from '../../../images/icons/info.svg'

const STEPS = {
  first: 1,
  second: 2,
  third: 3
}

function Exit ({
  amount,
  token,
  fiatAmount,
  fiatAmountUSD,
  preferredCurrency,
  merkleProof,
  batchNum,
  accountIndex,
  pendingWithdraws,
  coordinatorState
}) {
  const classes = useExitStyles()
  const [isWithdrawClicked, setIsWithdrawClicked] = useState(false)
  const [isWithdrawDelayedClicked, setIsWithdrawDelayedClicked] = useState(false)
  const [isWithdrawDelayed, setIsWithdrawDelayed] = useState(false)
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)

  React.useEffect(() => {
    if (typeof coordinatorState !== 'undefined') {
      for (const bucket of coordinatorState.rollup.buckets) {
        if (fiatAmountUSD < bucket.ceilUSD) {
          setIsWithdrawDelayed(bucket.withdrawals === 0)
          break
        }
      }

      setIsEmergencyMode(coordinatorState.withdrawalDelayer.emergencyMode)
    }
  }, [coordinatorState, fiatAmountUSD, setIsWithdrawDelayed, setIsEmergencyMode])

  function getStep () {
    if (!merkleProof) {
      return STEPS.first
    } else if (!pendingWithdraws || (pendingWithdraws && !pendingWithdraws.includes(accountIndex + merkleProof.Root))) {
      return STEPS.second
    } else {
      return STEPS.third
    }
  }

  function getTag () {
    switch (getStep()) {
      case STEPS.first:
        return 'Initiated'
      case STEPS.second:
        return 'On hold'
      case STEPS.third:
        return 'Pending'
      default:
        return ''
    }
  }

  function getWithdrawalDelayerTime () {
    return Math.round(coordinatorState.withdrawalDelayer.withdrawalDelay / 60 / 60 / 24)
  }

  function onWithdrawClick () {
    setIsWithdrawClicked(true)
  }

  function onWithdrawDelayedClick () {
    setIsWithdrawDelayedClicked(true)
  }

  function renderWithdrawalRedirect () {
    return <Redirect to={`/withdraw-complete?batchNum=${batchNum}&accountIndex=${accountIndex}&instantWithdrawal=true`} />
  }

  function renderWithdrawalDelayedRedirect () {
    return <Redirect to={`/withdraw-complete?batchNum=${batchNum}&accountIndex=${accountIndex}&instantWithdrawal=false`} />
  }

  if (isWithdrawClicked) {
    return renderWithdrawalRedirect()
  }

  if (isWithdrawDelayedClicked) {
    return renderWithdrawalDelayedRedirect()
  }

  return (
    <div className={classes.root}>
      <p className={classes.step}>Step {getStep()}/3</p>
      <div className={classes.rowTop}>
        <span className={classes.txType}>Withdrawal</span>
        <span className={classes.amountFiat}>{CurrencySymbol[preferredCurrency].symbol}{fiatAmount.toFixed(2)}</span>
      </div>
      <div className={classes.rowBottom}>
        <div className={clsx({
          [classes.stepTagWrapper]: true,
          [classes.stepTagWrapperTwo]: getStep() === STEPS.second
        })}
        >
          <span className={clsx({
            [classes.stepTag]: true,
            [classes.stepTagTwo]: getStep() === STEPS.second
          })}
          >{getTag()}
          </span>
        </div>
        <span className={classes.tokenAmount}>{amount} {token.symbol}</span>
      </div>
      {(() => {
        if (getStep() !== STEPS.second) {
          return <></>
        }

        if (isEmergencyMode) {
          return (
            <div className={classes.withdraw}>
              <div className={classes.withdrawInfo}>
                <img src={infoIcon} alt='Info Icon' className={classes.infoIcon} />
                <span className={classes.infoText}>Withdrawal will require a manual inspection.</span>
              </div>
              <div className={classes.withdrawInfo}>
                <span className={classes.infoText}>Your funds can stay on hold for a maximum period of 1 year.</span>
              </div>
            </div>
          )
        }

        if (isWithdrawDelayed) {
          return (
            <div className={classes.withdraw}>
              <div className={classes.withdrawInfo}>
                <img src={infoIcon} alt='Info Icon' className={classes.infoIcon} />
                <span className={classes.infoText}>Withdrawal is on hold due to a security mechanism.</span>
              </div>
              <div className={classes.withdrawInfo}>
                <span className={classes.infoText}>You can come back and try again soon.</span>
              </div>
              <div className={classes.withdrawInfo}>
                <span className={classes.infoText}>You can also schedule this transaction with an alternative smart contract. This option will delay the transfer for {getWithdrawalDelayerTime()} days.</span>
              </div>
              <button className={`${classes.withdrawButton} ${classes.withdrawDelayerButton}`} onClick={onWithdrawDelayedClick}>Schedule Withdrawal</button>
            </div>
          )
        }

        return (
          <div className={classes.withdraw}>
            <div className={classes.withdrawInfo}>
              <img src={infoIcon} alt='Info Icon' className={classes.infoIcon} />
              <span className={classes.infoText}>Sign required to finalize withdraw.</span>
              <button className={classes.withdrawButton} onClick={onWithdrawClick}>Finalise</button>
            </div>
          </div>
        )
      })()}

    </div>
  )
}

Exit.propTypes = {
  amount: PropTypes.string.isRequired,
  token: PropTypes.object.isRequired,
  fiatAmount: PropTypes.number.isRequired,
  fiatAmountUSD: PropTypes.number.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  merkleProof: PropTypes.object,
  batchNum: PropTypes.number,
  accountIndex: PropTypes.string,
  pendingWithdraws: PropTypes.array,
  coordinatorState: PropTypes.object
}

export default Exit

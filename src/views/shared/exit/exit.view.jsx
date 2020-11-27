import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Redirect } from 'react-router-dom'

import useExitStyles from './exit.styles'
import { CurrencySymbol } from '../../../utils/currencies'
import { ReactComponent as InfoIcon } from '../../../images/icons/info.svg'

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
  pendingDelayedWithdraws,
  coordinatorState,
  onAddPendingDelayedWithdraw,
  onRemovePendingDelayedWithdraw
}) {
  const classes = useExitStyles()
  const [isWithdrawClicked, setIsWithdrawClicked] = useState(false)
  const [isWithdrawDelayedClicked, setIsWithdrawDelayedClicked] = useState(false)
  const [isWithdrawDelayed, setIsWithdrawDelayed] = useState(false)
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)
  const [isDelayedWithdrawalReady, setIsDelayedWithdrawalReady] = useState(false)
  const [isCompleteDelayedWithdrawalClicked, setIsCompleteDelayedWithdrawalClicked] = useState(false)

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

  /**
   * Calculates in which step is the Exit process in
   * @returns {number} - Step of the exit
   */
  function getStep () {
    if (!merkleProof) {
      return STEPS.first
    } else if (!pendingWithdraws || (pendingWithdraws && !pendingWithdraws.includes(accountIndex + merkleProof.Root))) {
      return STEPS.second
    } else {
      return STEPS.third
    }
  }

  /**
   * Converts the current step of the exit to a readable label
   * @returns {string} - Label for the current step of the exit
   */
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

  /**
   * Converts the withdraw delay from seconds to days
   * @returns {number} - Withdrawal delay in days
   */
  function getWithdrawalDelayerTime () {
    return Math.round(coordinatorState.withdrawalDelayer.withdrawalDelay / 60 / 60 / 24)
  }

  /**
   * Calculates the remaining time until the instant or delayed withdrawal can be made
   * It detects the type and caculates the time accordingly (in hours for instant and days for delayed)
   * If enough time has already passed, it deletes the pendingDelayedWithdraw from LocalStorage
   * @param {Object} delayedWithdrawal - The delayed withdrawal object from LocalStorage
   * @returns {string|void} Returns remaining time as a string, or void if enough time has passed
   */
  function getDateString (delayedWithdrawal) {
    const now = Date.now()
    const difference = now - delayedWithdrawal.date
    if (delayedWithdrawal.instant) {
      const twoHours = 2 * 60 * 60 * 1000
      if (difference > twoHours) {
        onRemovePendingDelayedWithdraw(accountIndex + merkleProof.Root)
      } else {
        const remainingDifference = twoHours - difference
        // Extracts the hours and minutes from the remaining difference
        const hours = remainingDifference / 1000 / 60 / 60
        const hoursFixed = Math.floor(hours)
        // Minutes are in a value between 0-1, so we need to convert to 0-60
        const minutes = Math.round((hours - hoursFixed) * 60)

        return `${hoursFixed}h ${minutes}m`
      }
    } else {
      const delayedTime = coordinatorState.withdrawalDelayer.withdrawalDelay * 1000
      if (difference > delayedTime) {
        setIsDelayedWithdrawalReady(true)
      } else {
        const remainingDifference = delayedTime - difference
        // Extracts the days and hours from the remaining difference
        const days = remainingDifference / 1000 / 60 / 60 / 24
        const daysFixed = Math.floor(days)
        // Hours are in a value between 0-1, so we need to convert to 0-24
        const hours = Math.round((days - daysFixed) * 24)

        return `${daysFixed}d ${hours}h`
      }
    }
  }

  /*
   * Sets to true a local state variable called (isWithdrawClicked or isCompleteDelayedWithdrawalClicked) to redirect to
   * the Transaction view with the withdraw information depending on whether the withd
   * @returns {void}
   */
  function onWithdrawClick () {
    if (isDelayedWithdrawalReady) {
      setIsCompleteDelayedWithdrawalClicked(true)
    } else {
      setIsWithdrawClicked(true)
    }
  }

  /**
   * Sets to true a local state variable (isWithdrawDelayedClicked) to redirect to the Transaction view with the
   * delayed withdraw information
   * @returns {void}
   */
  function onWithdrawDelayedClick () {
    setIsWithdrawDelayedClicked(true)
  }

  function onCheckAvailabilityClick () {
    onAddPendingDelayedWithdraw({
      id: accountIndex + merkleProof.Root,
      instant: true,
      date: Date.now()
    })
  }

  if (isWithdrawClicked) {
    return <Redirect to={`/withdraw-complete?batchNum=${batchNum}&accountIndex=${accountIndex}&instantWithdrawal=true`} />
  }

  if (isWithdrawDelayedClicked) {
    return <Redirect to={`/withdraw-complete?batchNum=${batchNum}&accountIndex=${accountIndex}&instantWithdrawal=false`} />
  }

  if (isCompleteDelayedWithdrawalClicked) {
    return <Redirect to={`/withdraw-complete?batchNum=${batchNum}&accountIndex=${accountIndex}&completeDelayedWithdrawal=true`} />
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
              <div className={`${classes.withdrawInfo} ${classes.withdrawInfoDelayed}`}>
                <span className={classes.infoText}>Withdrawal will require a manual inspection.</span>
                <span className={classes.infoText}>Your funds can stay on hold for a maximum period of 1 year.</span>
              </div>
            </div>
          )
        }

        if (isWithdrawDelayed && !isDelayedWithdrawalReady) {
          // Remove once hermez-node is ready
          const accountIndexTemp = 'hez:SCC:256'
          const pendingDelayedWithdrawal = pendingDelayedWithdraws?.find(
            (pendingDelayedWithdrawal) => pendingDelayedWithdrawal.id === accountIndexTemp + merkleProof.Root
          )

          if (pendingDelayedWithdrawal) {
            return (
              <div className={classes.withdraw}>
                <div className={`${classes.withdrawInfo} ${classes.withdrawInfoDelayed}`}>
                  {pendingDelayedWithdrawal.instant && <span className={classes.infoText}>Your request to withdraw is validating with the network.</span>}
                  {!pendingDelayedWithdrawal.instant && <span className={classes.infoText}>You have scheduled your withdrawal.</span>}

                  <div className={`${classes.withdrawInfo} ${classes.withdrawInfoIcon}`}>
                    <InfoIcon className={classes.infoIcon} />
                    <span className={classes.infoText}>Remaining time: {getDateString(pendingDelayedWithdrawal)}</span>
                  </div>
                </div>
              </div>
            )
          } else {
            return (
              <div className={classes.withdraw}>
                <div className={`${classes.withdrawInfo} ${classes.withdrawInfoDelayed}`}>
                  <span className={classes.infoText}>Withdrawal is on hold because of the current network capacity.</span>
                  <span className={classes.infoText}>You can try to withdraw your funds later or you can schedule this transaction.</span>
                </div>
                <div className={classes.withdrawDelayedButtons}>
                  <button className={`${classes.withdrawButton} ${classes.withdrawDelayerInstantButton}`} onClick={onCheckAvailabilityClick}>Check availability in 2 hours</button>
                  <button className={`${classes.withdrawButton} ${classes.withdrawDelayerButton}`} onClick={onWithdrawDelayedClick}>Withdraw in {getWithdrawalDelayerTime()} days</button>
                </div>
              </div>
            )
          }
        }

        return (
          <div className={classes.withdraw}>
            <div className={classes.withdrawInfo}>
              <InfoIcon className={classes.infoIcon} />
              <span className={classes.infoText}>Signing required to finalize withdraw.</span>
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
  pendingDelayedWithdraws: PropTypes.array,
  coordinatorState: PropTypes.object,
  onAddPendingDelayedWithdraw: PropTypes.func.isRequired,
  onRemovePendingDelayedWithdraw: PropTypes.func.isRequired
}

export default Exit

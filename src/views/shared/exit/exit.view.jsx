import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Redirect } from 'react-router-dom'
import { isInstantWithdrawalAllowed } from '@hermeznetwork/hermezjs/src/tx'

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
  fixedTokenAmount,
  token,
  fiatAmount,
  preferredCurrency,
  exitId,
  merkleProof,
  batchNum,
  accountIndex,
  babyJubJub,
  pendingWithdraws,
  pendingDelayedWithdraws,
  coordinatorState,
  redirectTo,
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
      isInstantWithdrawalAllowed(
        amount,
        accountIndex,
        token,
        babyJubJub,
        batchNum,
        merkleProof?.siblings
      )
        .then(() => {
          setIsWithdrawDelayed(false)
        })
        .catch(() => {
          setIsWithdrawDelayed(true)
        })

      setIsEmergencyMode(coordinatorState.withdrawalDelayer.emergencyMode)
    }
  }, [coordinatorState, isInstantWithdrawalAllowed, setIsWithdrawDelayed, setIsEmergencyMode])

  /**
   * Calculates in which step is the Exit process in
   * @returns {number} - Step of the exit
   */
  function getStep () {
    if (!merkleProof) {
      return STEPS.first
    } else if (!pendingWithdraws || (pendingWithdraws && !pendingWithdraws.find((pendingWithdraw) => pendingWithdraw.id === exitId))) {
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
    return Math.round(coordinatorState?.withdrawalDelayer.withdrawalDelay / 60 / 60)
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
      const tenMinutes = 10 * 60 * 1000
      if (difference > tenMinutes) {
        onRemovePendingDelayedWithdraw(exitId)
      } else {
        const remainingDifference = tenMinutes - difference
        // Extracts the minutes from the remaining difference
        const minutes = Math.round(remainingDifference / 1000 / 60)

        return `${minutes}m`
      }
    } else {
      const delayedTime = coordinatorState?.withdrawalDelayer.withdrawalDelay * 1000
      if (difference > delayedTime) {
        setIsDelayedWithdrawalReady(true)
      } else {
        const remainingDifference = delayedTime - difference
        // Extracts the hours and minutes from the remaining difference
        const hours = remainingDifference / 1000 / 60 / 60
        const hoursFixed = Math.floor(hours)
        // Minutes are in a value between 0-1, so we need to convert to 0-60
        const minutes = Math.round((hours - hoursFixed) * 60)

        return `${hoursFixed}h ${minutes}m`
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
      id: exitId,
      instant: true,
      date: Date.now(),
      token
    })
  }

  if (isWithdrawClicked) {
    return <Redirect to={`/withdraw-complete?batchNum=${batchNum}&accountIndex=${accountIndex}&instantWithdrawal=true&redirectTo=${redirectTo}`} />
  }

  if (isWithdrawDelayedClicked) {
    return <Redirect to={`/withdraw-complete?batchNum=${batchNum}&accountIndex=${accountIndex}&instantWithdrawal=false&redirectTo=${redirectTo}`} />
  }

  if (isCompleteDelayedWithdrawalClicked) {
    return <Redirect to={`/withdraw-complete?batchNum=${batchNum}&accountIndex=${accountIndex}&completeDelayedWithdrawal=true&redirectTo=${redirectTo}`} />
  }

  return (
    <div className={classes.root}>
      <p className={classes.step}>Step {getStep()}/3</p>
      <div className={classes.rowTop}>
        <span className={classes.txType}>Withdrawal</span>
        <span className={classes.tokenAmount}>{fixedTokenAmount} {token.symbol}</span>
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
        <span className={classes.amountFiat}>{CurrencySymbol[preferredCurrency].symbol}{fiatAmount.toFixed(2)}</span>
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
          const pendingDelayedWithdrawal = pendingDelayedWithdraws?.find(
            (pendingDelayedWithdrawal) => pendingDelayedWithdrawal.id === exitId
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
                  <button className={`${classes.withdrawButton} ${classes.withdrawDelayerInstantButton}`} onClick={onCheckAvailabilityClick}>Check availability in 10m</button>
                  <button className={`${classes.withdrawButton} ${classes.withdrawDelayerButton}`} onClick={onWithdrawDelayedClick}>Withdraw in {getWithdrawalDelayerTime()} {getWithdrawalDelayerTime() === 1 ? 'hour' : 'hours'}</button>
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

import React, { useState } from "react";
import clsx from "clsx";
import { Navigate } from "react-router-dom";
import { Tx } from "@hermeznetwork/hermezjs";

import useExitCardStyles from "src/views/shared/exit-card/exit-card.styles";
import { getTxPendingTime, formatMinutes } from "src/utils/transactions";
import { ReactComponent as InfoIcon } from "src/images/icons/info.svg";
import PrimaryButton from "src/views/shared/primary-button/primary-button.view";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
// domain
import {
  CoordinatorState,
  ISOStringDate,
  MerkleProof,
  PendingDelayedWithdraw,
  PendingWithdraw,
  TimerWithdraw,
  Token,
} from "src/domain";

type Step = 1 | 2 | 3;

interface ExitCardProps {
  amount: string;
  fixedTokenAmount: string;
  token: Token;
  preferredCurrency: string;
  accountIndex: string;
  babyJubJub: string;
  pendingWithdraws: PendingWithdraw[];
  pendingDelayedWithdraws: PendingDelayedWithdraw[];
  timerWithdraws: TimerWithdraw[];
  coordinatorState?: CoordinatorState;
  fiatAmount?: number;
  exitId?: string;
  merkleProof?: MerkleProof;
  batchNum?: number;
  onAddTimerWithdraw: (timer: TimerWithdraw) => void;
  onRemoveTimerWithdraw: (exitId: string) => void;
}

function ExitCard({
  amount,
  fixedTokenAmount,
  token,
  preferredCurrency,
  accountIndex,
  babyJubJub,
  pendingWithdraws,
  pendingDelayedWithdraws,
  timerWithdraws,
  coordinatorState,
  fiatAmount,
  exitId,
  merkleProof,
  batchNum,
  onAddTimerWithdraw,
  onRemoveTimerWithdraw,
}: ExitCardProps): JSX.Element {
  const classes = useExitCardStyles();
  const [isWithdrawClicked, setIsWithdrawClicked] = useState(false);
  const [isWithdrawDelayedClicked, setIsWithdrawDelayedClicked] = useState(false);
  const [isWithdrawDelayed, setIsWithdrawDelayed] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isDelayedWithdrawalReady, setIsDelayedWithdrawalReady] = useState(false);
  const [isCompleteDelayedWithdrawalClicked, setIsCompleteDelayedWithdrawalClicked] =
    useState(false);
  const [isTimerCompleted, setIsTimerCompleted] = useState(false);

  /**
   * Calculates in which step is the Exit process in
   */
  const getStep = React.useCallback((): Step => {
    if (!merkleProof) {
      return 1;
    } else if (
      !pendingWithdraws ||
      (pendingWithdraws &&
        !pendingWithdraws.find((pendingWithdraw) => pendingWithdraw.id === exitId))
    ) {
      return 2;
    } else {
      return 3;
    }
  }, [exitId, merkleProof, pendingWithdraws]);

  React.useEffect(() => {
    if (coordinatorState && getStep() <= 2) {
      Tx.isInstantWithdrawalAllowed(
        amount,
        accountIndex,
        token,
        babyJubJub,
        batchNum !== null ? batchNum : undefined,
        merkleProof?.siblings
      )
        .then(() => {
          setIsWithdrawDelayed(false);
        })
        .catch(() => {
          setIsWithdrawDelayed(true);
        });

      setIsEmergencyMode(coordinatorState.withdrawalDelayer.emergencyMode);
    }
  }, [
    coordinatorState,
    setIsWithdrawDelayed,
    setIsEmergencyMode,
    getStep,
    amount,
    accountIndex,
    token,
    babyJubJub,
    batchNum,
    merkleProof,
  ]);

  React.useEffect(() => {
    if (isTimerCompleted && exitId) {
      setIsTimerCompleted(false);
      onRemoveTimerWithdraw(exitId);
    }
  }, [exitId, isTimerCompleted, onRemoveTimerWithdraw]);

  function getStepLabel() {
    switch (getStep()) {
      case 1: {
        return "Step 1/2";
      }
      default:
        return "Step 2/2";
    }
  }

  /**
   * Converts the current step of the exit to a readable label
   */
  function getTag() {
    switch (getStep()) {
      case 1:
        return "Initiated";
      case 2:
        return "On hold";
      case 3:
        return "Pending";
    }
  }

  /**
   * Converts the withdraw delay from seconds to hours or minutes
   */
  function getWithdrawalDelayerTime(cs: CoordinatorState) {
    // Extracts the hours and minutes from the withdrawalDelay time stamp
    const hours = cs.withdrawalDelayer.withdrawalDelay / 60 / 60;
    const hoursFixed = Math.floor(hours);
    // Minutes are in a value between 0-1, so we need to convert to 0-59
    const minutes = Math.round((hours - hoursFixed) * 59);

    if (hours < 1) {
      return `${minutes}m`;
    } else {
      return `${Math.round(hours)}h`;
    }
  }

  /**
   * Calculates the remaining time until the instant or delayed withdrawal can be made
   * It detects the type and caculates the time accordingly (in hours for instant and days for delayed)
   * If enough time has already passed, it deletes the pendingDelayedWithdraw from LocalStorage
   */
  function getDateString(timestamp: ISOStringDate, timer: boolean, cs: CoordinatorState) {
    const now = Date.now();
    const difference = now - new Date(timestamp).getTime();
    if (timer) {
      const tenMinutes = 10 * 60 * 1000;
      if (difference > tenMinutes && !isTimerCompleted) {
        setIsTimerCompleted(true);
      } else {
        const remainingDifference = tenMinutes - difference;
        // Extracts the minutes from the remaining difference
        const minutes = Math.ceil(remainingDifference / 1000 / 60);

        return `${minutes}m`;
      }
    } else {
      const delayedTime = cs.withdrawalDelayer.withdrawalDelay * 1000;
      if (difference > delayedTime) {
        setIsDelayedWithdrawalReady(true);
      } else {
        const remainingDifference = delayedTime - difference;
        // Extracts the hours and minutes from the remaining difference
        const hours = remainingDifference / 1000 / 60 / 60;
        const hoursFixed = Math.floor(hours);
        // Minutes are in a value between 0-1, so we need to convert to 0-59
        const minutes = Math.ceil((hours - hoursFixed) * 59);

        if (hoursFixed < 1) {
          return `${minutes}m`;
        } else {
          return `${hoursFixed}h ${minutes}m`;
        }
      }
    }
  }

  /*
   * Sets to true a local state variable called (isWithdrawClicked or isCompleteDelayedWithdrawalClicked) to redirect to
   * the Transaction view with the withdraw information depending on whether the withd
   */
  function onWithdrawClick() {
    if (isDelayedWithdrawalReady) {
      setIsCompleteDelayedWithdrawalClicked(true);
    } else {
      setIsWithdrawClicked(true);
    }
  }

  /**
   * Sets to true a local state variable (isWithdrawDelayedClicked) to redirect to the Transaction view with the
   * delayed withdraw information
   */
  function onWithdrawDelayedClick() {
    setIsWithdrawDelayedClicked(true);
  }

  function onCheckAvailabilityClick() {
    if (exitId) {
      onAddTimerWithdraw({
        id: exitId,
        timestamp: new Date().toISOString(),
        token,
      });
    }
  }

  if (isWithdrawClicked && batchNum) {
    return (
      <Navigate
        to={`/withdraw-complete?batchNum=${batchNum}&accountIndex=${accountIndex}&instantWithdrawal=true`}
      />
    );
  }

  if (isWithdrawDelayedClicked && batchNum) {
    return (
      <Navigate
        to={`/withdraw-complete?batchNum=${batchNum}&accountIndex=${accountIndex}&instantWithdrawal=false`}
      />
    );
  }

  if (isCompleteDelayedWithdrawalClicked && batchNum) {
    return (
      <Navigate
        to={`/withdraw-complete?batchNum=${batchNum}&accountIndex=${accountIndex}&completeDelayedWithdrawal=true`}
      />
    );
  }

  const pendingTime = getTxPendingTime(false, new Date().toISOString(), coordinatorState);

  return (
    <div className={classes.root}>
      <p className={classes.step}>{getStepLabel()}</p>
      <div className={classes.rowTop}>
        <span className={classes.txType}>Withdrawal</span>
        <span className={classes.tokenAmount}>
          {fixedTokenAmount} {token.symbol}
        </span>
      </div>
      <div className={classes.rowBottom}>
        <div className={classes.pendingContainer}>
          <div
            className={clsx({
              [classes.stepTagWrapper]: true,
              [classes.stepTagWrapperTwo]: getStep() === 2,
            })}
          >
            <span
              className={clsx({
                [classes.stepTag]: true,
                [classes.stepTagTwo]: getStep() === 2,
              })}
            >
              {getTag()}
            </span>
          </div>
          {pendingTime > 0 && getStep() === 1 && (
            <p className={classes.pendingTimer}>{formatMinutes(pendingTime)}</p>
          )}
        </div>
        <FiatAmount
          currency={preferredCurrency}
          amount={fiatAmount}
          className={classes.amountFiat}
        />
      </div>
      {(() => {
        if (getStep() !== 2) {
          return <></>;
        }

        if (isEmergencyMode) {
          return (
            <div className={classes.withdraw}>
              <div className={`${classes.withdrawInfo} ${classes.withdrawInfoDelayed}`}>
                <span className={classes.infoText}>
                  Withdrawal will require a manual inspection.
                </span>
                <span className={classes.infoText}>
                  Your funds can stay on hold for a maximum period of 1 year.
                </span>
              </div>
            </div>
          );
        }

        if (isWithdrawDelayed && !isDelayedWithdrawalReady) {
          const pendingDelayedWithdrawal = pendingDelayedWithdraws.find(
            (pendingDelayedWithdrawal) => pendingDelayedWithdrawal.id === exitId
          );
          const timerWithdraw = timerWithdraws.find(
            (timerWithdraws) => timerWithdraws.id === exitId
          );
          const withdraw = pendingDelayedWithdrawal || timerWithdraw;

          if (withdraw) {
            const remainingTime =
              coordinatorState &&
              getDateString(withdraw.timestamp, timerWithdraw !== undefined, coordinatorState);
            return (
              <div className={classes.withdraw}>
                <div className={`${classes.withdrawInfo} ${classes.withdrawInfoDelayed}`}>
                  {timerWithdraw && (
                    <span className={classes.infoText}>
                      Your request to withdraw is validating with the network.
                    </span>
                  )}
                  {pendingDelayedWithdrawal && (
                    <span className={classes.infoText}>You have scheduled your withdrawal.</span>
                  )}

                  {remainingTime && (
                    <div className={`${classes.withdrawInfo} ${classes.withdrawInfoIcon}`}>
                      <InfoIcon className={`${classes.infoIcon} ${classes.infoBoxIcon}`} />
                      <span className={classes.infoText}>Remaining time: {remainingTime}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          } else {
            return (
              <div className={classes.withdraw}>
                <div className={`${classes.withdrawInfo} ${classes.withdrawInfoDelayed}`}>
                  <span className={classes.infoText}>
                    Withdrawal is on hold because of the current network capacity.
                  </span>
                  <span className={classes.infoText}>
                    You can try to withdraw your funds later or you can schedule this transaction.
                  </span>
                </div>
                <div className={classes.withdrawDelayedButtons}>
                  <PrimaryButton
                    onClick={onCheckAvailabilityClick}
                    label={"Check availability in 10m"}
                    boxed
                    inRow
                  />
                  <PrimaryButton
                    onClick={onWithdrawDelayedClick}
                    label={
                      coordinatorState
                        ? `Withdraw in ${getWithdrawalDelayerTime(coordinatorState)}`
                        : "Withdraw"
                    }
                    boxed
                    inRow
                    last
                  />
                </div>
              </div>
            );
          }
        }

        return (
          <div className={classes.withdraw}>
            <div className={classes.withdrawInfo}>
              <p>
                <InfoIcon className={classes.infoIcon} />
                <span className={classes.infoText}>Signing required to finalize withdraw.</span>
              </p>
              <PrimaryButton onClick={onWithdrawClick} label={"Finalise"} boxed />
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default ExitCard;

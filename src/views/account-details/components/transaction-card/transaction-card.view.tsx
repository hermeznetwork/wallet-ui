import React from "react";
import { Enums } from "@hermeznetwork/hermezjs";

import useTransactionCardStyles from "src/views/account-details/components/transaction-card/transaction-card.styles";
import TransactionType from "src/views/account-details/components/transaction-type/transaction-type.view";
import TransactionLabel from "src/views/account-details/components/transaction-label/transaction-label.view";
import TransactionAmount from "src/views/account-details/components/transaction-amount/transaction-amount.view";
import { getTxPendingTime, formatMinutes } from "src/utils/transactions";
//domain
import { CoordinatorState, ISOStringDate } from "src/domain";

const { TxType } = Enums;

interface TransactionCardProps {
  accountIndex: string;
  type: Enums.TxType;
  amount: string;
  tokenSymbol: string;
  timestamp: ISOStringDate;
  preferredCurrency: string;
  coordinatorState: CoordinatorState;
  invalid: boolean;
  fiatAmount?: number;
  isPending?: boolean;
  fromAccountIndex?: string;
  onClick: () => void;
}

function TransactionCard({
  accountIndex,
  type,
  amount,
  tokenSymbol,
  timestamp,
  preferredCurrency,
  coordinatorState,
  fiatAmount,
  invalid,
  isPending,
  fromAccountIndex,
  onClick,
}: TransactionCardProps): JSX.Element {
  const classes = useTransactionCardStyles();

  const isL1 =
    type === TxType.Deposit || type === TxType.CreateAccountDeposit || type === TxType.ForceExit;
  const pendingTime = getTxPendingTime(isL1, timestamp, coordinatorState);

  return (
    <div className={classes.root} onClick={onClick}>
      <div className={classes.type}>
        <TransactionType
          type={type}
          fromAccountIndex={fromAccountIndex}
          accountIndex={accountIndex}
        />
      </div>
      <div className={classes.info}>
        <div className={`${classes.row} ${classes.topRow}`}>
          <TransactionLabel
            type={type}
            fromAccountIndex={fromAccountIndex}
            accountIndex={accountIndex}
          />
          <p className={classes.tokenSymbol}>
            {amount} {tokenSymbol}
          </p>
        </div>
        <div className={`${classes.row} ${classes.bottomRow}`}>
          {(invalid && (
            <div className={classes.pendingContainer}>
              <div className={classes.invalidLabelContainer}>
                <p className={classes.invalidLabelText}>Invalid</p>
              </div>
            </div>
          )) ||
            (isPending ? (
              <div className={classes.pendingContainer}>
                <div className={classes.pendingLabelContainer}>
                  <p className={classes.pendingLabelText}>Pending</p>
                </div>
                {pendingTime > 0 && (
                  <p className={classes.pendingTimer}>{formatMinutes(pendingTime)}</p>
                )}
              </div>
            ) : (
              <p>{new Date(timestamp).toLocaleDateString()}</p>
            ))}
          <TransactionAmount
            fiatAmount={fiatAmount}
            preferredCurrency={preferredCurrency}
            type={type}
            fromAccountIndex={fromAccountIndex}
            accountIndex={accountIndex}
          />
        </div>
      </div>
    </div>
  );
}

export default TransactionCard;

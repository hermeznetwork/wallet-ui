import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import useTransactionStyles from "src/views/account-details/components/transaction/transaction.styles";
import TransactionType from "src/views/account-details/components/transaction-type/transaction-type.view";
import TransactionLabel from "src/views/account-details/components/transaction-label/transaction-label.view";
import TransactionAmount from "src/views/account-details/components/transaction-amount/transaction-amount.view";
import { getTxPendingTime } from "src/utils/transactions";
//domain
import { CoordinatorState, ISOStringDate } from "src/domain/hermez";

interface TransactionProps {
  accountIndex: string;
  type: TxType;
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

function Transaction({
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
}: TransactionProps): JSX.Element {
  const classes = useTransactionStyles();

  const isL1 =
    type === TxType.Deposit || type === TxType.CreateAccountDeposit || type === TxType.ForceExit;
  const pendingTime = getTxPendingTime(coordinatorState, isL1, timestamp);

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
                {pendingTime > 0 && <p className={classes.pendingTimer}>{pendingTime} min</p>}
              </div>
            ) : (
              <p>{new Date(timestamp).toLocaleDateString()}</p>
            ))}
          <TransactionAmount fiatAmount={fiatAmount} preferredCurrency={preferredCurrency} />
        </div>
      </div>
    </div>
  );
}

export default Transaction;
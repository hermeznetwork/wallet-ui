import React from "react";

import ExitCard from "src/views/shared/exit-card/exit-card.view";
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from "src/utils/currencies";
// domain
import {
  Exit,
  PendingDelayedWithdraw,
  PendingWithdraw,
  TimerWithdraw,
  CoordinatorState,
  FiatExchangeRates,
  PoolTransaction,
  isExit,
} from "src/domain/hermez";

interface ExitCardListProps {
  transactions: (Exit | PoolTransaction)[];
  preferredCurrency: string;
  babyJubJub: string;
  pendingWithdraws: PendingWithdraw[];
  pendingDelayedWithdraws: PendingDelayedWithdraw[];
  timerWithdraws: TimerWithdraw[];
  coordinatorState?: CoordinatorState;
  fiatExchangeRates?: FiatExchangeRates;
  onAddTimerWithdraw: (timer: TimerWithdraw) => void;
  onRemoveTimerWithdraw: (exitId: string) => void;
}

function ExitCardList({
  transactions,
  preferredCurrency,
  babyJubJub,
  pendingWithdraws,
  pendingDelayedWithdraws,
  timerWithdraws,
  coordinatorState,
  fiatExchangeRates,
  onAddTimerWithdraw,
  onRemoveTimerWithdraw,
}: ExitCardListProps): JSX.Element {
  return (
    <>
      {transactions.map((transaction) => {
        const amount = isExit(transaction) ? transaction.balance : transaction.amount;
        const fixedTokenAmount = getFixedTokenAmount(amount, transaction.token.decimals);

        return (
          <ExitCard
            key={transaction.itemId}
            amount={amount}
            fixedTokenAmount={fixedTokenAmount}
            token={transaction.token}
            fiatAmount={getTokenAmountInPreferredCurrency(
              fixedTokenAmount,
              transaction.token.USD,
              preferredCurrency,
              fiatExchangeRates
            )}
            preferredCurrency={preferredCurrency}
            batchNum={transaction.batchNum ? transaction.batchNum : undefined}
            exitId={
              isExit(transaction) ? `${transaction.accountIndex}${transaction.batchNum}` : undefined
            }
            merkleProof={isExit(transaction) ? transaction.merkleProof : undefined}
            accountIndex={
              isExit(transaction) ? transaction.accountIndex : transaction.fromAccountIndex
            }
            babyJubJub={babyJubJub}
            pendingWithdraws={pendingWithdraws}
            pendingDelayedWithdraws={pendingDelayedWithdraws}
            timerWithdraws={timerWithdraws}
            onAddTimerWithdraw={onAddTimerWithdraw}
            onRemoveTimerWithdraw={onRemoveTimerWithdraw}
            coordinatorState={coordinatorState}
          />
        );
      })}
    </>
  );
}

export default ExitCardList;

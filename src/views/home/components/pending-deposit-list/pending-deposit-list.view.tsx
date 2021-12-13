import React from "react";

import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from "src/utils/currencies";
import Account from "src/views/shared/account/account.view";
import usePendingDepositListStyles from "src/views/home/components/pending-deposit-list/pending-deposit-list.styles";
//domain
import { CoordinatorState, FiatExchangeRates, PendingDeposit } from "src/domain/hermez";

interface PendingDepositListProps {
  deposits: PendingDeposit[];
  preferredCurrency: string;
  coordinatorState?: CoordinatorState;
  fiatExchangeRates?: FiatExchangeRates;
  onAccountClick: () => void;
}

function PendingDepositList({
  deposits,
  preferredCurrency,
  fiatExchangeRates,
  coordinatorState,
  onAccountClick,
}: PendingDepositListProps): JSX.Element {
  const classes = usePendingDepositListStyles();

  return (
    <>
      {deposits.map((deposit) => {
        return (
          <div key={deposit.hash} className={classes.pendingDeposit}>
            <Account
              hasPendingDeposit
              balance={deposit.amount}
              fiatBalance={
                fiatExchangeRates &&
                getTokenAmountInPreferredCurrency(
                  getFixedTokenAmount(deposit.amount, deposit.token.decimals),
                  deposit.token.USD,
                  preferredCurrency,
                  fiatExchangeRates
                )
              }
              token={deposit.token}
              preferredCurrency={preferredCurrency}
              coordinatorState={coordinatorState}
              timestamp={deposit.timestamp}
              onClick={onAccountClick}
            />
          </div>
        );
      })}
    </>
  );
}

export default PendingDepositList;

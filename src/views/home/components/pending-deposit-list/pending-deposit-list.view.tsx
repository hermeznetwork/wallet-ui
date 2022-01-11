import React from "react";

import usePendingDepositListStyles from "src/views/home/components/pending-deposit-list/pending-deposit-list.styles";
import AccountCard from "src/views/shared/account-card/account-card.view";
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from "src/utils/currencies";
//domain
import { CoordinatorState, FiatExchangeRates, PendingDeposit } from "src/domain";

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
            <AccountCard
              hasPendingDeposit
              balance={deposit.amount}
              fiatBalance={getTokenAmountInPreferredCurrency(
                getFixedTokenAmount(deposit.amount, deposit.token.decimals),
                deposit.token,
                preferredCurrency,
                fiatExchangeRates
              )}
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

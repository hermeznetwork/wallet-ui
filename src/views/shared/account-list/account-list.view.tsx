import React from "react";
import clsx from "clsx";

import useAccountListStyles from "src/views/shared/account-list/account-list.styles";
import AccountView from "src/views/shared/account/account.view";
// domain
import {
  Account,
  PendingDeposit,
  CoordinatorState,
  isHermezAccount,
  HermezAccount,
} from "src/domain/hermez";

interface AccountListProps {
  accounts: Account[];
  preferredCurrency: string;
  pendingDeposits?: PendingDeposit[];
  coordinatorState?: CoordinatorState;
  disabledTokenIds?: number[];
  onAccountClick: (account: HermezAccount) => void;
}

function AccountList({
  accounts,
  preferredCurrency,
  pendingDeposits,
  coordinatorState,
  disabledTokenIds,
  onAccountClick,
}: AccountListProps): JSX.Element {
  const classes = useAccountListStyles();

  function getAccountPendingDeposit(account: Account): PendingDeposit | undefined {
    return !isHermezAccount(account)
      ? undefined
      : pendingDeposits?.find((deposit) => deposit.accountIndex === account.accountIndex);
  }

  function hasAccountPendingDeposit(account: Account): boolean {
    return pendingDeposits !== undefined && getAccountPendingDeposit(account) !== undefined;
  }

  function isAccountDisabled(account: Account): boolean {
    return disabledTokenIds?.find((id) => account.token.id === id) !== undefined;
  }

  return (
    <div className={classes.root}>
      {accounts.map((account, index) => {
        return (
          <div
            key={(isHermezAccount(account) && account.accountIndex) || account.token.id}
            className={clsx({ [classes.accountSpacer]: index > 0 })}
          >
            <AccountView
              balance={account.balance}
              preferredCurrency={preferredCurrency}
              fiatBalance={account.fiatBalance || 0}
              token={account.token}
              hasPendingDeposit={hasAccountPendingDeposit(account)}
              isDisabled={isAccountDisabled(account)}
              coordinatorState={coordinatorState}
              timestamp={getAccountPendingDeposit(account)?.timestamp}
              onClick={() => onAccountClick(account)}
            />
          </div>
        );
      })}
    </div>
  );
}

export default AccountList;

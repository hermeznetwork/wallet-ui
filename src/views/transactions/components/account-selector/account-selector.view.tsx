import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import AccountList from "src/views/shared/account-list/account-list.view";
import Container from "src/views/shared/container/container.view";
import InfiniteScroll from "src/views/shared/infinite-scroll/infinite-scroll.view";
import Spinner from "src/views/shared/spinner/spinner.view";
import useAccountSelectorStyles from "src/views/transactions/components/account-selector/account-selector.styles";
import { AsyncTask } from "src/utils/types";
import { Pagination } from "src/utils/api";
// domain
import {
  EthereumAccount,
  FiatExchangeRates,
  HermezAccount,
  isEthereumAccount,
  isHermezAccount,
  PendingDeposit,
  PoolTransaction,
} from "src/domain";

export interface AccountsWithPagination {
  accounts: HermezAccount[];
  pagination: Pagination;
}

type AccountSelectorProps = {
  fiatExchangeRates: FiatExchangeRates;
  preferredCurrency: string;
} & (
  | {
      type: TxType.Deposit;
      accountsTask: AsyncTask<EthereumAccount[], Error>;
      pendingDeposits: PendingDeposit[];
      onLoadAccounts: (fiatExchangeRates: FiatExchangeRates, preferredCurrency: string) => void;
      onAccountClick: (ethereumAccount: EthereumAccount) => void;
    }
  | {
      type: TxType.Transfer;
      accountsTask: AsyncTask<AccountsWithPagination, Error>;
      poolTransactionsTask: AsyncTask<PoolTransaction[], Error>;
      onLoadAccounts: (
        poolTransactions: PoolTransaction[],
        fiatExchangeRates: FiatExchangeRates,
        preferredCurrency: string,
        fromItem?: number
      ) => void;
      onAccountClick: (account: HermezAccount) => void;
    }
  | {
      type: TxType.ForceExit;
      accountsTask: AsyncTask<AccountsWithPagination, Error>;
      poolTransactionsTask: AsyncTask<PoolTransaction[], Error>;
      onLoadAccounts: (
        poolTransactions: PoolTransaction[],
        fiatExchangeRates: FiatExchangeRates,
        preferredCurrency: string,
        fromItem?: number
      ) => void;
      onAccountClick: (account: HermezAccount) => void;
    }
);

function AccountSelector({
  fiatExchangeRates,
  preferredCurrency,
  ...transaction
}: AccountSelectorProps): JSX.Element {
  const classes = useAccountSelectorStyles();
  const { accountsTask, type } = transaction;

  React.useEffect(() => {
    if (accountsTask.status === "pending") {
      if (type === TxType.Deposit) {
        transaction.onLoadAccounts(fiatExchangeRates, preferredCurrency);
      } else if (transaction.poolTransactionsTask.status === "successful") {
        transaction.onLoadAccounts(
          transaction.poolTransactionsTask.data,
          fiatExchangeRates,
          preferredCurrency
        );
      }
    }
  }, [accountsTask, fiatExchangeRates, preferredCurrency, transaction, type]);

  switch (type) {
    case TxType.Deposit: {
      const { pendingDeposits, onAccountClick } = transaction;
      const disabledTokenIds = pendingDeposits
        .filter((deposit) => deposit.type === TxType.CreateAccountDeposit)
        .map((deposit) => deposit.token.id);

      return (
        <div className={classes.root}>
          <Container disableTopGutter>
            <section className={classes.accountListWrapper}>
              {((): JSX.Element => {
                switch (transaction.accountsTask.status) {
                  case "pending":
                  case "loading":
                  case "failed": {
                    return <Spinner />;
                  }
                  case "reloading":
                  case "successful": {
                    if (transaction.accountsTask.data.length === 0) {
                      return (
                        <p className={classes.emptyState}>
                          No compatible tokens with Hermez wallet to deposit.
                        </p>
                      );
                    } else {
                      return (
                        <div className={classes.accountListDeposit}>
                          <p className={classes.accountListDepositText}>
                            Available tokens to deposit
                          </p>
                          <AccountList
                            accounts={transaction.accountsTask.data}
                            preferredCurrency={preferredCurrency}
                            disabledTokenIds={disabledTokenIds}
                            onAccountClick={(account) => {
                              if (isEthereumAccount(account)) {
                                onAccountClick(account);
                              }
                            }}
                          />
                        </div>
                      );
                    }
                  }
                }
              })()}
            </section>
          </Container>
        </div>
      );
    }
    default: {
      const { accountsTask, poolTransactionsTask, onAccountClick, onLoadAccounts } = transaction;

      return (
        <div className={classes.root}>
          <Container disableTopGutter>
            <section className={classes.accountListWrapper}>
              {((): JSX.Element => {
                switch (accountsTask.status) {
                  case "pending":
                  case "loading":
                  case "failed": {
                    return <Spinner />;
                  }
                  case "reloading":
                  case "successful": {
                    if (
                      accountsTask.status === "successful" ||
                      accountsTask.status === "reloading"
                    ) {
                      return (
                        <InfiniteScroll
                          asyncTaskStatus={accountsTask.status}
                          paginationData={accountsTask.data.pagination}
                          onLoadNextPage={(fromItem: number) => {
                            onLoadAccounts(
                              poolTransactionsTask.status === "successful" ||
                                poolTransactionsTask.status === "reloading"
                                ? poolTransactionsTask.data
                                : [],
                              fiatExchangeRates,
                              preferredCurrency,
                              fromItem
                            );
                          }}
                        >
                          <AccountList
                            accounts={accountsTask.data.accounts}
                            preferredCurrency={preferredCurrency}
                            onAccountClick={(account) => {
                              if (isHermezAccount(account)) {
                                onAccountClick(account);
                              }
                            }}
                          />
                        </InfiniteScroll>
                      );
                    } else {
                      return <Spinner />;
                    }
                  }
                }
              })()}
            </section>
          </Container>
        </div>
      );
    }
  }
}

export default AccountSelector;

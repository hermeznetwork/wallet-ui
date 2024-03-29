import React from 'react'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'

import AccountList from '../../../shared/account-list/account-list.view'
import Container from '../../../shared/container/container.view'
import InfiniteScroll from '../../../shared/infinite-scroll/infinite-scroll.view'
import Spinner from '../../../shared/spinner/spinner.view'
import useAccountSelectorStyles from './account-selector.styles'

function AccountSelector ({
  transactionType,
  accountsTask,
  poolTransactionsTask,
  preferredCurrency,
  fiatExchangeRates,
  pendingDeposits,
  onLoadAccounts,
  onAccountClick
}) {
  const classes = useAccountSelectorStyles()
  const disabledTokenIds = pendingDeposits
    .filter(deposit => deposit.type === TxType.CreateAccountDeposit)
    .map(deposit => deposit.token.id)

  React.useEffect(() => {
    if (accountsTask.status === 'pending' && poolTransactionsTask.status === 'successful') {
      onLoadAccounts(
        transactionType,
        undefined,
        poolTransactionsTask.data,
        pendingDeposits,
        fiatExchangeRates,
        preferredCurrency
      )
    }
  }, [accountsTask, poolTransactionsTask, onLoadAccounts])

  return (
    <div className={classes.root}>
      <Container disableTopGutter>
        <section className={classes.accountListWrapper}>
          {(() => {
            switch (accountsTask.status) {
              case 'pending':
              case 'loading':
              case 'failed': {
                return <Spinner />
              }
              case 'reloading':
              case 'successful': {
                if (transactionType === TxType.Deposit) {
                  if (accountsTask.data.length === 0) {
                    return (
                      <p className={classes.emptyState}>
                        No compatible tokens with Hermez wallet to deposit.
                      </p>
                    )
                  }

                  return (
                    <div className={classes.accountListDeposit}>
                      <p className={classes.accountListDepositText}>Available tokens to deposit</p>
                      <AccountList
                        accounts={accountsTask.data}
                        preferredCurrency={preferredCurrency}
                        fiatExchangeRates={fiatExchangeRates}
                        disabledTokenIds={disabledTokenIds}
                        onAccountClick={onAccountClick}
                      />
                    </div>
                  )
                } else {
                  return (
                    <InfiniteScroll
                      asyncTaskStatus={accountsTask.status}
                      paginationData={accountsTask.data.pagination}
                      onLoadNextPage={(fromItem) => {
                        onLoadAccounts(
                          transactionType,
                          fromItem,
                          poolTransactionsTask.data,
                          pendingDeposits,
                          fiatExchangeRates,
                          preferredCurrency
                        )
                      }}
                    >
                      <AccountList
                        accounts={accountsTask.data.accounts}
                        preferredCurrency={preferredCurrency}
                        fiatExchangeRates={fiatExchangeRates}
                        onAccountClick={onAccountClick}
                      />
                    </InfiniteScroll>
                  )
                }
              }
              default: {
                return <></>
              }
            }
          })()}
        </section>
      </Container>
    </div>
  )
}

export default AccountSelector

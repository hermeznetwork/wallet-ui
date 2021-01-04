import React from 'react'

import AccountList from '../../../shared/account-list/account-list.view'
import Container from '../../../shared/container/container.view'
import InfiniteScroll from '../../../shared/infinite-scroll/infinite-scroll.view'
import Spinner from '../../../shared/spinner/spinner.view'
import { TransactionType } from '../../transaction.view'
import useAccountSelectorStyles from './account-selector.styles'

function AccountSelector ({
  transactionType,
  accountsTask,
  preferredCurrency,
  fiatExchangeRates,
  onLoadAccounts,
  onAccountClick
}) {
  const classes = useAccountSelectorStyles()

  React.useEffect(() => {
    if (accountsTask.status === 'pending') {
      onLoadAccounts(transactionType)
    }
  }, [accountsTask, transactionType, onLoadAccounts])

  return (
    <div className={classes.root}>
      <Container disableTopGutter>
        <section className={classes.accountListWrapper}>
          {(() => {
            switch (accountsTask.status) {
              case 'loading':
              case 'failed': {
                return <Spinner />
              }
              case 'reloading':
              case 'successful': {
                // TODO: Remove the ForceExit from the if when the Hermez node is ready
                if (
                  transactionType === TransactionType.Deposit ||
                  transactionType === TransactionType.ForceExit
                ) {
                  if (accountsTask.data.length === 0) {
                    return (
                      <p className={classes.emptyState}>
                        No compatible tokens with Hermez wallet to deposit.
                      </p>
                    )
                  }

                  return (
                    <AccountList
                      accounts={accountsTask.data}
                      preferredCurrency={preferredCurrency}
                      fiatExchangeRates={fiatExchangeRates}
                      onAccountClick={onAccountClick}
                    />
                  )
                } else {
                  return (
                    <InfiniteScroll
                      asyncTaskStatus={accountsTask.status}
                      paginationData={accountsTask.data.pagination}
                      onLoadNextPage={(fromItem) => {
                        onLoadAccounts(transactionType, fromItem)
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

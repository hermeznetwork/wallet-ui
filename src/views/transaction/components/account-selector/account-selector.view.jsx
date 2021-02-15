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
  preferredCurrency,
  fiatExchangeRates,
  pendingDeposits,
  onLoadAccounts,
  onAccountClick
}) {
  const classes = useAccountSelectorStyles()

  React.useEffect(() => {
    if (accountsTask.status === 'pending') {
      onLoadAccounts(transactionType)
    }
  }, [accountsTask, transactionType, onLoadAccounts])

  function getDisabledTokenIds () {
    if (!pendingDeposits) {
      return []
    }

    return pendingDeposits.map(deposit => deposit.type === TxType.CreateAccountDeposit && deposit.token.id)
  }

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
                if (
                  transactionType === TxType.Deposit
                ) {
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
                        disabledTokenIds={getDisabledTokenIds()}
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

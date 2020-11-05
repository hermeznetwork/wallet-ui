import React from 'react'

import AccountList from '../../../shared/account-list/account-list.view'
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
    onLoadAccounts(transactionType)
  }, [transactionType, onLoadAccounts])

  return (
    <div className={classes.accountListWrapper}>
      {(() => {
        switch (accountsTask.status) {
          case 'loading':
          case 'failed': {
            return <Spinner />
          }
          case 'reloading':
          case 'successful': {
            if (
              transactionType === TransactionType.Deposit ||
              transactionType === TransactionType.ForceExit
            ) {
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
    </div>
  )
}

export default AccountSelector

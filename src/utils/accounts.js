import { getFeeValue } from '@hermeznetwork/hermezjs/src/tx-utils'

import { getFiatBalance } from './currencies'

/** */
function getAccountBalance (account, poolTransactions, pendingDeposits) {
  if (!account) {
    return undefined
  }

  let totalBalance = BigInt(account.balance)

  if (pendingDeposits && pendingDeposits.length) {
    const pendingAccountDeposits = pendingDeposits
      .filter(deposit => deposit.account.accountIndex === account.accountIndex)

    pendingAccountDeposits.forEach((pendingDeposit) => {
      totalBalance += BigInt(pendingDeposit.amount)
    })
  }

  if (poolTransactions && poolTransactions.length) {
    const accountPoolTransactions = poolTransactions
      .filter(transaction => transaction.fromAccountIndex === account.accountIndex)

    accountPoolTransactions.forEach((pendingTransaction) => {
      totalBalance -= BigInt(pendingTransaction.amount)
      totalBalance -= BigInt(getFeeValue(pendingTransaction.fee, pendingTransaction.amount))
    })
  }

  return totalBalance.toString()
}

function formatAccount (account, poolTransactions, pendingDeposits, pricesTask, fiatExchangeRates, preferredCurrency) {
  const accountToken = pricesTask.status === 'successful' ||
    pricesTask.status === 'reloading'
    ? { ...account, token: { ...pricesTask.data.tokens[account.token.id] } }
    : { ...account }
  const accountBalance = getAccountBalance(accountToken, poolTransactions, pendingDeposits)
  const fiatBalance = getFiatBalance(
    accountBalance,
    accountToken.token,
    preferredCurrency,
    fiatExchangeRates
  )

  return {
    ...accountToken,
    balance: accountBalance,
    fiatBalance
  }
}

export {
  getAccountBalance,
  formatAccount
}

import { getFeeValue } from '@hermeznetwork/hermezjs/src/tx-utils'

/** */
function getAccountBalance (account, poolTransactions, pendingDeposits) {
  if (!account) {
    return undefined
  }

  let totalBalance = BigInt(account.balance)

  if (pendingDeposits && pendingDeposits.length) {
    const pendingAccountDeposits = pendingDeposits.filter(
      deposit => deposit.account.accountIndex === account.accountIndex
    )

    pendingAccountDeposits.forEach(pendingDeposit => {
      totalBalance += BigInt(pendingDeposit.amount)
    })
  }

  if (poolTransactions && poolTransactions.length) {
    const accountPoolTransactions = poolTransactions.filter(
      transaction => transaction.fromAccountIndex === account.accountIndex
    )

    accountPoolTransactions.forEach(pendingTransaction => {
      totalBalance -= BigInt(pendingTransaction.amount)
      totalBalance -= BigInt(
        getFeeValue(pendingTransaction.fee, pendingTransaction.amount)
      )
    })
  }

  return totalBalance.toString()
}

export { getAccountBalance }

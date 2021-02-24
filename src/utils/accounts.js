/** */
function getAccountBalance (account, poolTransactions, pendingDeposits, pendingWithdraws) {
  if (!account) {
    return undefined
  }

  let totalBalance = BigInt(account.balance)

  if (pendingDeposits && pendingDeposits.length) {
    const pendingAccountDeposits = pendingDeposits.filter(deposit => deposit.token.id === account.token.id)

    pendingAccountDeposits.forEach((pendingDeposit) => {
      totalBalance += BigInt(pendingDeposit.amount)
    })
  }

  if (poolTransactions && poolTransactions.length) {
    const accountPoolTransactions = poolTransactions.filter(transaction => transaction.token.id === account.token.id)

    accountPoolTransactions.forEach((pendingTransaction) => {
      totalBalance -= BigInt(pendingTransaction.amount)
    })
  }

  if (pendingWithdraws && pendingWithdraws.length) {
    const accountPendingWithdraws = pendingWithdraws.filter(withdraw => withdraw.token.id === account.token.id)

    accountPendingWithdraws.forEach((pendingWithdraw) => {
      totalBalance -= pendingWithdraw.balance ? BigInt(pendingWithdraw.balance) : BigInt(pendingWithdraw.amount)
    })
  }

  return totalBalance.toString()
}

export {
  getAccountBalance
}

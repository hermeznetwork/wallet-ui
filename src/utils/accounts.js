/** */
function getAccountBalance (account, poolTransactions, pendingDeposits) {
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

  return totalBalance.toString()
}

export {
  getAccountBalance
}

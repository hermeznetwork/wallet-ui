/** */
function getAccountBalance (account, poolTransactions, pendingDeposits, pendingWithdraws) {
  if (!account) {
    return undefined
  }

  let totalBalance = BigInt(account.balance)
  if (pendingDeposits && pendingDeposits.length) {
    const pendingAccountDeposits = pendingDeposits.filter((deposit) => deposit.token.id === account.token.id)

    pendingAccountDeposits.forEach((pendingDeposit) => {
      totalBalance += BigInt(pendingDeposit.amount)
    })
  }

  if (poolTransactions && poolTransactions.length) {
    poolTransactions.forEach((pendingTransaction) => {
      totalBalance -= BigInt(pendingTransaction.amount)
    })
  }

  if (pendingWithdraws && pendingWithdraws.length) {
    pendingWithdraws.forEach((pendingWithdraw) => {
      totalBalance -= BigInt(pendingWithdraw.balance)
    })
  }

  return totalBalance.toString()
}

export {
  getAccountBalance
}

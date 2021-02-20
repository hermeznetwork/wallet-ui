import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from './currencies'

/** */
function getAccountBalance (account, poolTransactions, pendingDeposits) {
  if (!account) {
    return undefined
  }

  let totalBalance = BigInt(account.balance)

  if (pendingDeposits) {
    const pendingAccountDeposits = pendingDeposits.filter((deposit) => deposit.token.id === account.token.id)

    pendingAccountDeposits.forEach((pendingDeposit) => {
      totalBalance += BigInt(pendingDeposit.amount)
    })
  }

  if (poolTransactions) {
    poolTransactions.forEach((pendingTransaction) => {
      totalBalance -= BigInt(pendingTransaction.amount)
    })
  }

  return totalBalance.toString()
}

function getAccountsFiatBalance (
  accounts,
  poolTransactions,
  pendingDeposits,
  preferredCurrency,
  fiatExchangeRates
) {
  if (!accounts) {
    return undefined
  }

  return accounts.reduce((totalBalance, account) => {
    const accountBalance = getAccountBalance(account, poolTransactions, pendingDeposits)
    const fixedAccountBalance = getFixedTokenAmount(accountBalance, account.token.decimals)
    const accountFiatBalance = getTokenAmountInPreferredCurrency(
      fixedAccountBalance,
      account.token.USD,
      preferredCurrency,
      fiatExchangeRates
    )

    return totalBalance + accountFiatBalance
  }, 0)
}

export {
  getAccountBalance,
  getAccountsFiatBalance
}

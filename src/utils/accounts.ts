import { BigNumber } from "ethers";
import { getFeeValue } from "@hermeznetwork/hermezjs/src/tx-utils";

import { convertTokenAmountToFiat } from "src/utils/currencies";
import { AsyncTask } from "src/utils/types";
// domain
import { Account, PooledTransaction, Deposit, Token, FiatExchangeRates } from "src/domain/hermez";

function getAccountBalance(
  account: Account,
  poolTransactions?: PooledTransaction[],
  pendingDeposits?: Deposit[]
): string {
  let totalBalance = BigNumber.from(account.balance);

  if (pendingDeposits !== undefined && pendingDeposits.length) {
    const pendingAccountDeposits = pendingDeposits.filter(
      (deposit) => deposit.account.accountIndex === account.accountIndex
    );
    pendingAccountDeposits.forEach((pendingDeposit) => {
      totalBalance = totalBalance.add(BigNumber.from(pendingDeposit.amount));
    });
  }

  if (poolTransactions !== undefined && poolTransactions.length) {
    const accountPoolTransactions = poolTransactions.filter(
      (transaction) =>
        transaction.fromAccountIndex === account.accountIndex && !transaction.errorCode
    );

    accountPoolTransactions.forEach((pendingTransaction) => {
      totalBalance = totalBalance.sub(BigNumber.from(pendingTransaction.amount));
      totalBalance = totalBalance.sub(
        BigNumber.from(getFeeValue(pendingTransaction.fee, pendingTransaction.amount))
      );
    });
  }

  return totalBalance.toString();
}

function updateAccountToken(tokensPrice: AsyncTask<Token[], string>, account: Account): Account {
  if (tokensPrice.status === "successful" || tokensPrice.status === "reloading") {
    const token: Token | undefined = tokensPrice.data.find(
      (token) => token.id === account.token.id
    );
    return token === undefined ? account : { ...account, token };
  } else {
    return account;
  }
}

// TODO Study if this belongs to the domain model, as it's the function who creates a domain entity Account and move it there
function createAccount(
  account: Account,
  poolTransactions: PooledTransaction[] | undefined,
  pendingDeposits: Deposit[] | undefined,
  tokensPriceTask: AsyncTask<Token[], string>,
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): Account {
  const updatedAccount: Account = updateAccountToken(tokensPriceTask, account);
  const accountBalance = getAccountBalance(updatedAccount, poolTransactions, pendingDeposits);
  const fiatBalance: number = convertTokenAmountToFiat(
    accountBalance,
    updatedAccount.token,
    preferredCurrency,
    fiatExchangeRates
  );

  return {
    ...updatedAccount,
    balance: accountBalance,
    fiatBalance,
  };
}

export { getAccountBalance, createAccount };

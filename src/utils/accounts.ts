import { getFeeValue } from "@hermeznetwork/hermezjs/src/tx-utils";
import { BigNumber } from "ethers";

import { convertTokenAmountToFiat } from "./currencies";

import { Account, PooledTransaction, Deposit, Token, FiatExchangeRates } from "src/domain/hermez";

import { AsyncTask } from "src/utils/types";

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

// TODO Study if this belongs to the domain model, as it's the function who creates a domain entity Account and move it there
function createAccount(
  account: Account,
  poolTransactions: PooledTransaction[] | undefined,
  pendingDeposits: Deposit[] | undefined,
  tokensPriceTask: AsyncTask<Token[], string>,
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): Account {
  const accountToken: Account =
    tokensPriceTask.status === "successful" && tokensPriceTask.data[account.token.id]
      ? { ...account, token: { ...tokensPriceTask.data[account.token.id] } }
      : { ...account };
  const accountBalance = getAccountBalance(accountToken, poolTransactions, pendingDeposits);
  const fiatBalance: number = convertTokenAmountToFiat(
    accountBalance,
    accountToken.token,
    preferredCurrency,
    fiatExchangeRates
  );

  return {
    ...accountToken,
    balance: accountBalance,
    fiatBalance,
  };
}

export { getAccountBalance, createAccount };

import { BigNumber } from "ethers";
import { getFeeValue } from "@hermeznetwork/hermezjs/src/tx-utils";

import { convertTokenAmountToFiat } from "src/utils/currencies";
import { AsyncTask } from "src/utils/types";
// domain
import {
  HermezAccount,
  PoolTransaction,
  PendingDeposit,
  Token,
  FiatExchangeRates,
} from "src/domain/hermez";

function getAccountBalance(
  account: HermezAccount,
  poolTransactions?: PoolTransaction[],
  pendingDeposits?: PendingDeposit[]
): string {
  let totalBalance = BigNumber.from(account.balance);

  if (pendingDeposits !== undefined && pendingDeposits.length) {
    const pendingAccountDeposits = pendingDeposits.filter(
      (deposit) => deposit.accountIndex === account.accountIndex
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
        BigNumber.from(getFeeValue(Number(pendingTransaction.fee), pendingTransaction.amount))
      );
    });
  }

  return totalBalance.toString();
}

function updateAccountToken(
  tokensPrice: AsyncTask<Token[], string>,
  account: HermezAccount
): HermezAccount {
  if (tokensPrice.status === "successful" || tokensPrice.status === "reloading") {
    const token: Token | undefined = tokensPrice.data.find(
      (token) => token.id === account.token.id
    );
    return token === undefined ? account : { ...account, token };
  } else {
    return account;
  }
}

// ToDo: This helper should be moved to persistence when we move to persistence and abstract the calls to CoordinatorAPI.getAccounts
function createAccount(
  account: HermezAccount,
  poolTransactions: PoolTransaction[] | undefined,
  pendingDeposits: PendingDeposit[] | undefined,
  tokensPriceTask: AsyncTask<Token[], string>,
  preferredCurrency: string,
  fiatExchangeRates?: FiatExchangeRates
): HermezAccount {
  const updatedAccount: HermezAccount = updateAccountToken(tokensPriceTask, account);
  const accountBalance = getAccountBalance(updatedAccount, poolTransactions, pendingDeposits);
  const fiatBalance = convertTokenAmountToFiat(
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

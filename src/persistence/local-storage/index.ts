import * as z from "zod";
import * as storage from "src/utils/storage";
import * as constants from "src/constants";

// domain
import { Withdraw, DelayedWithdraw, Deposit, Account, Token } from "src/domain/hermez";

import {
  PendingWithdraws,
  PendingDelayedWithdraws,
  PendingDeposits,
} from "src/domain/local-storage";

const withdrawZod: z.ZodType<Withdraw> = z.object({
  accountIndex: z.string(),
  batchNum: z.number(),
  hash: z.string(),
  id: z.string(),
  timestamp: z.string(),
});

const pendingWithdrawsZod: z.ZodType<PendingWithdraws> = z.record(z.record(z.array(withdrawZod)));

export function getPendingWithdraws(): PendingWithdraws {
  const pendingWithdraws: unknown = storage.getStorage(constants.PENDING_WITHDRAWS_KEY);
  const parsedPendingWithdraws = pendingWithdrawsZod.safeParse(pendingWithdraws);
  if (parsedPendingWithdraws.success) {
    return parsedPendingWithdraws.data;
  } else {
    return {};
  }
}

const delayedWithdrawZod: z.ZodType<DelayedWithdraw> = withdrawZod.and(
  z.object({
    instant: z.boolean(),
  })
);

const pendingDelayedWithdrawsZod: z.ZodType<PendingDelayedWithdraws> = z.record(
  z.record(z.array(delayedWithdrawZod))
);

export function getPendingDelayedWithdraws(): PendingDelayedWithdraws {
  const pendingDelayedWithdraws: unknown = storage.getStorage(
    constants.PENDING_DELAYED_WITHDRAWS_KEY
  );
  const parsedPendingDelayedWithdraws =
    pendingDelayedWithdrawsZod.safeParse(pendingDelayedWithdraws);
  if (parsedPendingDelayedWithdraws.success) {
    return parsedPendingDelayedWithdraws.data;
  } else {
    return {};
  }
}

const tokenZod: z.ZodType<Token> = z.object({
  itemId: z.number(),
  decimals: z.number(),
  ethereumAddress: z.string(),
  ethereumBlockNum: z.number(),
  usdUpdate: z.string(),
  id: z.number(),
  name: z.string(),
  symbol: z.string(),
  USD: z.number(),
});

const accountZod: z.ZodType<Account> = z.object({
  itemId: z.number(),
  accountIndex: z.string(),
  balance: z.string(),
  bjj: z.string(),
  fiatBalance: z.number(),
  token: tokenZod,
});

const depositZod: z.ZodType<Deposit> = z.object({
  account: accountZod,
  hash: z.string(),
  token: tokenZod,
  amount: z.string(),
  timestamp: z.string(),
  type: z.union([z.literal("Deposit"), z.literal("CreateAccountDeposit")]),
});

const pendingDepositsZod: z.ZodType<PendingDeposits> = z.record(z.record(z.array(depositZod)));

export function getPendingDeposits(): PendingDeposits {
  const pendingDeposits: unknown = storage.getStorage(constants.PENDING_DEPOSITS_KEY);
  const parsedPendingDeposits = pendingDepositsZod.safeParse(pendingDeposits);
  if (parsedPendingDeposits.success) {
    return parsedPendingDeposits.data;
  } else {
    return {};
  }
}

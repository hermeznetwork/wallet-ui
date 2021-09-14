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

const withdrawParser: z.ZodSchema<Withdraw> = z.object({
  accountIndex: z.string(),
  batchNum: z.number(),
  hash: z.string(),
  id: z.string(),
  timestamp: z.string(),
});

const pendingWithdrawsParser: z.ZodSchema<PendingWithdraws> = z.record(
  z.record(z.array(withdrawParser))
);

export function getPendingWithdraws(): PendingWithdraws {
  const pendingWithdraws: unknown = storage.getStorage(constants.PENDING_WITHDRAWS_KEY);
  const parsedPendingWithdraws = pendingWithdrawsParser.safeParse(pendingWithdraws);
  return parsedPendingWithdraws.success ? parsedPendingWithdraws.data : {};
}

const delayedWithdrawParser: z.ZodSchema<DelayedWithdraw> = withdrawParser.and(
  z.object({
    instant: z.boolean(),
  })
);

const pendingDelayedWithdrawsParser: z.ZodSchema<PendingDelayedWithdraws> = z.record(
  z.record(z.array(delayedWithdrawParser))
);

export function getPendingDelayedWithdraws(): PendingDelayedWithdraws {
  const pendingDelayedWithdraws: unknown = storage.getStorage(
    constants.PENDING_DELAYED_WITHDRAWS_KEY
  );
  const parsedPendingDelayedWithdraws =
    pendingDelayedWithdrawsParser.safeParse(pendingDelayedWithdraws);
  return parsedPendingDelayedWithdraws.success ? parsedPendingDelayedWithdraws.data : {};
}

const tokenParser: z.ZodSchema<Token> = z.object({
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

const accountParser: z.ZodSchema<Account> = z.object({
  itemId: z.number(),
  accountIndex: z.string(),
  balance: z.string(),
  bjj: z.string(),
  fiatBalance: z.number(),
  token: tokenParser,
});

const depositParser: z.ZodSchema<Deposit> = z.object({
  account: accountParser,
  hash: z.string(),
  token: tokenParser,
  amount: z.string(),
  timestamp: z.string(),
  type: z.union([z.literal("Deposit"), z.literal("CreateAccountDeposit")]),
});

const pendingDepositsParser: z.ZodSchema<PendingDeposits> = z.record(
  z.record(z.array(depositParser))
);

export function getPendingDeposits(): PendingDeposits {
  const pendingDeposits: unknown = storage.getStorage(constants.PENDING_DEPOSITS_KEY);
  const parsedPendingDeposits = pendingDepositsParser.safeParse(pendingDeposits);
  return parsedPendingDeposits.success ? parsedPendingDeposits.data : {};
}

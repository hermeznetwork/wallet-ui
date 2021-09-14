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

const withdrawParser: z.ZodType<Withdraw> = z.object({
  accountIndex: z.string(),
  batchNum: z.number(),
  hash: z.string(),
  id: z.string(),
  timestamp: z.string(),
});

const pendingWithdrawsParser: z.ZodType<PendingWithdraws> = z.record(z.record(z.array(withdrawParser)));

export function getPendingWithdraws(): PendingWithdraws {
  const pendingWithdraws: unknown = storage.getStorage(constants.PENDING_WITHDRAWS_KEY);
  const parsedPendingWithdraws = pendingWithdrawsParser.safeParse(pendingWithdraws);
  if (parsedPendingWithdraws.success) {
    return parsedPendingWithdraws.data;
  } else {
    return {};
  }
}

const delayedWithdrawParser: z.ZodType<DelayedWithdraw> = withdrawParser.and(
  z.object({
    instant: z.boolean(),
  })
);

const pendingDelayedWithdrawsParser: z.ZodType<PendingDelayedWithdraws> = z.record(
  z.record(z.array(delayedWithdrawParser))
);

export function getPendingDelayedWithdraws(): PendingDelayedWithdraws {
  const pendingDelayedWithdraws: unknown = storage.getStorage(
    constants.PENDING_DELAYED_WITHDRAWS_KEY
  );
  const parsedPendingDelayedWithdraws =
    pendingDelayedWithdrawsParser.safeParse(pendingDelayedWithdraws);
  if (parsedPendingDelayedWithdraws.success) {
    return parsedPendingDelayedWithdraws.data;
  } else {
    return {};
  }
}

const tokenParser: z.ZodType<Token> = z.object({
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

const accountParser: z.ZodType<Account> = z.object({
  itemId: z.number(),
  accountIndex: z.string(),
  balance: z.string(),
  bjj: z.string(),
  fiatBalance: z.number(),
  token: tokenParser,
});

const depositParser: z.ZodType<Deposit> = z.object({
  account: accountParser,
  hash: z.string(),
  token: tokenParser,
  amount: z.string(),
  timestamp: z.string(),
  type: z.union([z.literal("Deposit"), z.literal("CreateAccountDeposit")]),
});

const pendingDepositsParser: z.ZodType<PendingDeposits> = z.record(z.record(z.array(depositParser)));

export function getPendingDeposits(): PendingDeposits {
  const pendingDeposits: unknown = storage.getStorage(constants.PENDING_DEPOSITS_KEY);
  const parsedPendingDeposits = pendingDepositsParser.safeParse(pendingDeposits);
  if (parsedPendingDeposits.success) {
    return parsedPendingDeposits.data;
  } else {
    return {};
  }
}

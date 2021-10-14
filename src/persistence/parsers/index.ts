import { z } from "zod";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

// domain
import { Withdraw, DelayedWithdraw, Deposit, Account, Token } from "src/domain/hermez";

const withdraw: z.ZodSchema<Withdraw> = z.object({
  accountIndex: z.string(),
  batchNum: z.number(),
  hash: z.string(),
  id: z.string(),
  timestamp: z.string(),
});

const delayedWithdraw: z.ZodSchema<DelayedWithdraw> = withdraw.and(
  z.object({
    instant: z.boolean(),
  })
);

const token: z.ZodSchema<Token> = z.object({
  itemId: z.number(),
  decimals: z.number(),
  ethereumAddress: z.string(),
  ethereumBlockNum: z.number(),
  id: z.number(),
  name: z.string(),
  symbol: z.string(),
  USD: z.number(),
});

// ToDo: Investigate why TS does not complain when props present in the parser are not in the interface: https://github.com/colinhacks/zod/issues/652
//       Also, fiatBalance is optional in the type, but we can remove the .optional() below with no errors
const account: z.ZodSchema<Account> = z.object({
  itemId: z.number(),
  accountIndex: z.string(),
  balance: z.string(),
  bjj: z.string(),
  hezEthereumAddress: z.string(),
  token: token,
  fiatBalance: z.number().optional(),
});

const deposit: z.ZodSchema<Deposit> = z.object({
  account: account,
  hash: z.string(),
  token: token,
  amount: z.string(),
  timestamp: z.string(),
  type: z.union([z.literal(TxType.Deposit), z.literal(TxType.CreateAccountDeposit)]),
  transactionId: z.string().optional(),
});

export { withdraw, delayedWithdraw, token, account, deposit };

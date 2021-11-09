// Be careful with Zod parsers! TS will not complain when props present in the parser
// are not present in the interface: https://github.com/colinhacks/zod/issues/652
// Also, some modifiers as "optional" can be missing in the parser with no compile errors.

import { z } from "zod";
import { TxState, TxType } from "@hermeznetwork/hermezjs/src/enums";

// domain
import {
  Account,
  HermezApiResourceItem,
  HistoryTransaction,
  MerkleProof,
  PendingDelayedWithdraw,
  PendingDeposit,
  PendingWithdraw,
  Token,
  L1Info,
} from "src/domain/hermez";

const hermezApiResourceItem: z.ZodSchema<HermezApiResourceItem> = z.object({
  itemId: z.number(),
});

const token: z.ZodSchema<Token> = hermezApiResourceItem.and(
  z.object({
    decimals: z.number(),
    ethereumAddress: z.string(),
    ethereumBlockNum: z.number(),
    id: z.number(),
    name: z.string(),
    symbol: z.string(),
    USD: z.number(),
  })
);

const account: z.ZodSchema<Account> = hermezApiResourceItem.and(
  z.object({
    accountIndex: z.string(),
    balance: z.string(),
    bjj: z.string(),
    hezEthereumAddress: z.string(),
    token: token,
  })
);

const l1Info: z.ZodSchema<L1Info> = z.object({
  depositAmount: z.string(),
});

const l1orL2: z.ZodSchema<"L1" | "L2"> = z.union([z.literal("L1"), z.literal("L2")]);

const historyTransaction: z.ZodSchema<HistoryTransaction> = hermezApiResourceItem.and(
  z.object({
    amount: z.string(),
    batchNum: z.number(),
    fromAccountIndex: z.string(),
    fromHezEthereumAddress: z.string(),
    id: z.string(),
    L1Info: l1Info,
    L1orL2: l1orL2,
    toHezEthereumAddress: z.string().nullable(),
    type: z.nativeEnum(TxType),
  })
);

const pendingDeposit: z.ZodSchema<PendingDeposit> = z.object({
  account,
  amount: z.string(),
  fromHezEthereumAddress: z.string(),
  hash: z.string(),
  state: z.nativeEnum(TxState),
  timestamp: z.string(),
  toHezEthereumAddress: z.string(),
  token,
  type: z.enum([TxType.Deposit, TxType.CreateAccountDeposit]),
  transactionId: z.string().optional(),
});

const pendingWithdraw: z.ZodSchema<PendingWithdraw> = z.object({
  accountIndex: z.string(),
  hermezEthereumAddress: z.string(),
  balance: z.string(),
  batchNum: z.number(),
  hash: z.string(),
  id: z.string(),
  timestamp: z.string(),
  token,
});

const merkleProof: z.ZodSchema<MerkleProof> = z.object({
  root: z.string(),
  siblings: z.string().array(),
});

const pendingDelayedWithdraw: z.ZodSchema<PendingDelayedWithdraw> = pendingWithdraw.and(
  z.object({
    instant: z.boolean(),
    merkleProof,
  })
);

export {
  token,
  account,
  historyTransaction,
  pendingDeposit,
  pendingWithdraw,
  pendingDelayedWithdraw,
};

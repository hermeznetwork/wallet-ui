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
    fiatBalance: z.number().optional(),
    hezEthereumAddress: z.string(),
    token: token,
  })
);

const historyTransaction: z.ZodSchema<HistoryTransaction> = hermezApiResourceItem.and(
  z.object({
    amount: z.string(),
    batchNum: z.number(),
    fromAccountIndex: z.string(),
    fromBJJ: z.string(),
    fromHezEthereumAddress: z.string(),
    id: z.string(),
    timestamp: z.string(),
    toAccountIndex: z.string(),
    toBJJ: z.string().nullable(),
    toHezEthereumAddress: z.string().nullable(),
    token: token,
    type: z.nativeEnum(TxType),
  })
);

const pendingDeposit: z.ZodSchema<PendingDeposit> = hermezApiResourceItem.and(
  z.object({
    account,
    amount: z.string(),
    fromHezEthereumAddress: z.string(),
    hash: z.string(),
    state: z.nativeEnum(TxState),
    timestamp: z.string(),
    toHezEthereumAddress: z.string(),
    token,
    type: z.enum([TxType.Deposit, TxType.CreateAccountDeposit]),
  })
);

const pendingWithdraw: z.ZodSchema<PendingWithdraw> = hermezApiResourceItem.and(
  z.object({
    accountIndex: z.string(),
    amount: z.string(),
    batchNum: z.number(),
    hash: z.string(),
    hermezEthereumAddress: z.string(),
    id: z.string(),
    timestamp: z.string(),
    token,
    type: z.enum([TxType.Withdraw]),
  })
);

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

import { z } from "zod";
import { TxState, TxType } from "@hermeznetwork/hermezjs/src/enums";

// domain
import {
  HermezApiResourceItem,
  HistoryTransaction,
  MerkleProof,
  PendingDelayedWithdraw,
  PendingDeposit,
  PendingWithdraw,
  TimerWithdraw,
  Token,
  L1Info,
  L2Info,
  Exit,
  HermezAccount,
} from "src/domain/hermez";
// utils
import { EnsureSchema } from "src/utils/type-safety";

const hermezApiResourceItem = EnsureSchema<HermezApiResourceItem>()(
  z.object({
    itemId: z.number(),
  })
);

const token = EnsureSchema<Token>()(
  hermezApiResourceItem.and(
    z.object({
      decimals: z.number(),
      ethereumAddress: z.string(),
      ethereumBlockNum: z.number(),
      id: z.number(),
      name: z.string(),
      symbol: z.string(),
      USD: z.number(),
    })
  )
);

const hermezAccount = EnsureSchema<HermezAccount>()(
  hermezApiResourceItem.and(
    z.object({
      accountIndex: z.string(),
      balance: z.string(),
      bjj: z.string(),
      hezEthereumAddress: z.string(),
      token: token,
      fiatBalance: z.number().optional(),
    })
  )
);

const l1Info = EnsureSchema<L1Info>()(
  z.object({
    depositAmount: z.string(),
  })
);

const l2Info = EnsureSchema<L2Info>()(
  z.object({
    fee: z.number(),
    historicFeeUSD: z.number().nullable(),
  })
);

const l1orL2 = EnsureSchema<"L1" | "L2">()(z.union([z.literal("L1"), z.literal("L2")]));

const historyTransaction = EnsureSchema<HistoryTransaction>()(
  hermezApiResourceItem.and(
    z.object({
      amount: z.string(),
      batchNum: z.number(),
      fromAccountIndex: z.string(),
      fromHezEthereumAddress: z.string(),
      historicUSD: z.number().nullable(),
      id: z.string(),
      L1Info: l1Info.nullable(),
      L2Info: l2Info.nullable(),
      L1orL2: l1orL2,
      timestamp: z.string(),
      toBJJ: z.string().nullable(),
      toHezEthereumAddress: z.string().nullable(),
      token: token,
      type: z.nativeEnum(TxType),
    })
  )
);

const pendingDeposit = EnsureSchema<PendingDeposit>()(
  z.object({
    accountIndex: z.string().optional(),
    amount: z.string(),
    fromHezEthereumAddress: z.string(),
    hash: z.string(),
    state: z.nativeEnum(TxState),
    timestamp: z.string(),
    toHezEthereumAddress: z.string(),
    token,
    type: z.enum([TxType.Deposit, TxType.CreateAccountDeposit]),
    transactionId: z.string().optional(),
  })
);

const merkleProof = EnsureSchema<MerkleProof>()(
  z.object({
    root: z.string(),
    siblings: z.string().array(),
  })
);

const exit = EnsureSchema<Exit>()(
  hermezApiResourceItem.and(
    z.object({
      accountIndex: z.string(),
      batchNum: z.number(),
      delayedWithdraw: z.number().nullable(),
      instantWithdraw: z.number().nullable(),
      delayedWithdrawRequest: z.number().nullable(),
      token,
      merkleProof,
      balance: z.string(),
    })
  )
);

const pendingWithdraw = EnsureSchema<PendingWithdraw>()(
  exit.and(
    z.object({
      hermezEthereumAddress: z.string(),
      hash: z.string(),
      id: z.string(),
      timestamp: z.string(),
    })
  )
);

const pendingDelayedWithdraw = EnsureSchema<PendingDelayedWithdraw>()(
  pendingWithdraw.and(
    z.object({
      isInstant: z.boolean(),
    })
  )
);

const timerWithdraw = EnsureSchema<TimerWithdraw>()(
  z.object({
    id: z.string(),
    timestamp: z.string(),
    token,
  })
);

export {
  token,
  hermezAccount,
  historyTransaction,
  pendingDeposit,
  pendingWithdraw,
  pendingDelayedWithdraw,
  timerWithdraw,
};

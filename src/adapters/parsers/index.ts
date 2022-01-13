import { z } from "zod";
import { TxState, TxType } from "@hermeznetwork/hermezjs/src/enums";

// domain
import {
  AccountAuthorization,
  CoordinatorState,
  Exit,
  HermezAccount,
  HermezApiResourceItem,
  HistoryTransaction,
  L1Info,
  L2Info,
  MerkleProof,
  NextForger,
  PendingDelayedWithdraw,
  PendingDeposit,
  PendingWithdraw,
  RecommendedFee,
  TimerWithdraw,
  Token,
} from "src/domain";
// utils
import { StrictSchema } from "src/utils/type-safety";

const hermezApiResourceItem = StrictSchema<HermezApiResourceItem>()(
  z.object({
    itemId: z.number(),
  })
);

const accountAuthorization = StrictSchema<AccountAuthorization>()(
  z.object({
    signature: z.string(),
  })
);

// CoordinatorState

const coordinator = StrictSchema<NextForger["coordinator"]>()(
  hermezApiResourceItem.and(
    z.object({
      forgerAddr: z.string(),
      URL: z.string(),
    })
  )
);

const period = StrictSchema<NextForger["period"]>()(
  z.object({
    toTimestamp: z.string(),
  })
);

const nextForger = StrictSchema<NextForger>()(
  z.object({
    coordinator: coordinator,
    period: period,
  })
);

const batch = StrictSchema<CoordinatorState["network"]["lastBatch"]>()(
  hermezApiResourceItem.and(
    z.object({
      timestamp: z.string(),
    })
  )
);

const network = StrictSchema<CoordinatorState["network"]>()(
  z.object({
    lastBatch: batch,
    nextForgers: z.array(nextForger),
  })
);

const node = StrictSchema<CoordinatorState["node"]>()(
  z.object({
    forgeDelay: z.number(),
    poolLoad: z.number(),
  })
);

const withdrawalDelayer = StrictSchema<CoordinatorState["withdrawalDelayer"]>()(
  z.object({
    withdrawalDelay: z.number(),
    emergencyMode: z.boolean(),
  })
);

const recommendedFee = StrictSchema<RecommendedFee>()(
  z.object({
    existingAccount: z.number(),
    createAccount: z.number(),
    createAccountInternal: z.number(),
  })
);

const coordinatorState = StrictSchema<CoordinatorState>()(
  z.object({
    node: node,
    network: network,
    withdrawalDelayer: withdrawalDelayer,
    recommendedFee: recommendedFee,
  })
);

const token = StrictSchema<Token>()(
  hermezApiResourceItem.and(
    z.object({
      decimals: z.number(),
      ethereumAddress: z.string(),
      ethereumBlockNum: z.number(),
      id: z.number(),
      name: z.string(),
      symbol: z.string(),
      USD: z.number().nullable(),
    })
  )
);

const hermezAccount = StrictSchema<HermezAccount>()(
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

const l1Info = StrictSchema<L1Info>()(
  z.object({
    depositAmount: z.string(),
  })
);

const l2Info = StrictSchema<L2Info>()(
  z.object({
    fee: z.number(),
    historicFeeUSD: z.number().nullable(),
  })
);

const l1orL2 = StrictSchema<"L1" | "L2">()(z.union([z.literal("L1"), z.literal("L2")]));

const historyTransaction = StrictSchema<HistoryTransaction>()(
  hermezApiResourceItem.and(
    z.object({
      amount: z.string(),
      batchNum: z.number().nullable(),
      fromAccountIndex: z.string().nullable(),
      fromHezEthereumAddress: z.string().nullable(),
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

const pendingDeposit = StrictSchema<PendingDeposit>()(
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

const merkleProof = StrictSchema<MerkleProof>()(
  z.object({
    root: z.string(),
    siblings: z.string().array(),
  })
);

const exit = StrictSchema<Exit>()(
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

const pendingWithdraw = StrictSchema<PendingWithdraw>()(
  exit.and(
    z.object({
      hermezEthereumAddress: z.string(),
      hash: z.string(),
      id: z.string(),
      timestamp: z.string(),
    })
  )
);

const pendingDelayedWithdraw = StrictSchema<PendingDelayedWithdraw>()(
  pendingWithdraw.and(
    z.object({
      isInstant: z.boolean(),
    })
  )
);

const timerWithdraw = StrictSchema<TimerWithdraw>()(
  z.object({
    id: z.string(),
    timestamp: z.string(),
    token,
  })
);

export {
  accountAuthorization,
  coordinatorState,
  hermezAccount,
  historyTransaction,
  pendingDelayedWithdraw,
  pendingDeposit,
  pendingWithdraw,
  timerWithdraw,
  token,
};

import { z } from "zod";
import { Enums, Tx } from "@hermeznetwork/hermezjs";

// domain
import {
  AccountAuthorization,
  CoordinatorState,
  Exit,
  HermezAccount,
  HermezRawAccount,
  HermezApiResourceItem,
  HistoryTransaction,
  L1Info,
  L2Info,
  MerkleProof,
  NextForger,
  PendingDelayedWithdraw,
  PendingDeposit,
  PendingWithdraw,
  PoolTransaction,
  RecommendedFee,
  TimerWithdraw,
  Token,
} from "src/domain";
// utils
import { StrictSchema } from "src/utils/type-safety";

const { TxState, TxType } = Enums;

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

const hermezRawAccount = StrictSchema<HermezRawAccount>()(
  hermezApiResourceItem.and(
    z.object({
      accountIndex: z.string(),
      balance: z.string(),
      bjj: z.string(),
      hezEthereumAddress: z.string(),
      token: token,
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

const poolTransaction = StrictSchema<PoolTransaction>()(
  hermezApiResourceItem.and(
    z.object({
      amount: z.string(),
      batchNum: z.number().nullable().optional(),
      errorCode: z.number().nullable().optional(),
      fee: z.number(),
      fromAccountIndex: z.string(),
      fromBJJ: z.string().nullable(),
      fromHezEthereumAddress: z.string().nullable(),
      id: z.string(),
      state: z.nativeEnum(TxState),
      timestamp: z.string(),
      toAccountIndex: z.string().nullable(),
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
      bjj: z.string(),
      hezEthereumAddress: z.string(),
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

const sendL2TransactionResponse = StrictSchema<Tx.SendL2TransactionResponse>()(
  z.object({
    status: z.number(),
    id: z.string(),
    nonce: z.number(),
  })
);

const timerWithdraw = StrictSchema<TimerWithdraw>()(
  z.object({
    id: z.string(),
    timestamp: z.string(),
    token,
  })
);

// The response from a Tx.deposit, Tx.forceExit, Tx.withdrawCircuit and Tx.delayedWithdraw calls
const txData = StrictSchema<Tx.TxData>()(
  z.object({
    hash: z.string(),
  })
);

interface UnknownHermezRawAccounts {
  accounts: unknown[];
  pendingItems: number;
}

const unknownHermezRawAccounts = StrictSchema<UnknownHermezRawAccounts>()(
  z.object({
    accounts: z.array(z.unknown()),
    pendingItems: z.number(),
  })
);

interface UnknownExits {
  exits: unknown[];
  pendingItems: number;
}

const unknownExits = StrictSchema<UnknownExits>()(
  z.object({
    exits: z.array(z.unknown()),
    pendingItems: z.number(),
  })
);

interface UnknownHistoryTransactions {
  transactions: unknown[];
  pendingItems: number;
}

const unknownHistoryTransactions = StrictSchema<UnknownHistoryTransactions>()(
  z.object({
    transactions: z.array(z.unknown()),
    pendingItems: z.number(),
  })
);

interface UnknownPoolTransactions {
  transactions: unknown[];
  pendingItems: number;
}

const unknownPoolTransactions = StrictSchema<UnknownPoolTransactions>()(
  z.object({
    transactions: z.array(z.unknown()),
    pendingItems: z.number(),
  })
);

interface UnknownTokens {
  tokens: unknown[];
  pendingItems: number;
}

const unknownTokens = StrictSchema<UnknownTokens>()(
  z.object({
    tokens: z.array(z.unknown()),
    pendingItems: z.number(),
  })
);

export {
  accountAuthorization,
  coordinatorState,
  exit,
  hermezAccount,
  hermezRawAccount,
  historyTransaction,
  pendingDelayedWithdraw,
  pendingDeposit,
  pendingWithdraw,
  poolTransaction,
  sendL2TransactionResponse,
  timerWithdraw,
  token,
  txData,
  unknownExits,
  unknownHermezRawAccounts,
  unknownHistoryTransactions,
  unknownPoolTransactions,
  unknownTokens,
};

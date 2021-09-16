import * as z from "zod";
import * as constants from "src/constants";

// domain
import { Withdraw, DelayedWithdraw, Deposit, Account, Token } from "src/domain/hermez";

import {
  PendingWithdraws,
  ChainPendingWithdraws,
  PendingDelayedWithdraws,
  ChainPendingDelayedWithdraws,
  PendingDeposits,
  ChainPendingDeposits,
} from "src/domain/local-storage";

// ToDo: Primitive domain entity parsers can be moved to a more generic persistence module

const withdrawParser: z.ZodSchema<Withdraw> = z.object({
  accountIndex: z.string(),
  batchNum: z.number(),
  hash: z.string(),
  id: z.string(),
  timestamp: z.string(),
});

const tokenParser: z.ZodSchema<Token> = z.object({
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
const accountParser: z.ZodType<Account> = z.object({
  itemId: z.number(),
  accountIndex: z.string(),
  balance: z.string(),
  bjj: z.string(),
  token: tokenParser,
  fiatBalance: z.number().optional(),
});

const depositParser: z.ZodSchema<Deposit> = z.object({
  account: accountParser,
  hash: z.string(),
  token: tokenParser,
  amount: z.string(),
  timestamp: z.string(),
  type: z.union([z.literal("Deposit"), z.literal("CreateAccountDeposit")]),
  transactionId: z.string().optional(),
});

// Storage Helpers

export function getStorage(key: string): unknown {
  const storageStringOrNull = localStorage.getItem(key);
  if (storageStringOrNull === null) {
    return initStorage(key);
  } else {
    try {
      return JSON.parse(storageStringOrNull);
    } catch (error) {
      return initStorage(key);
    }
  }
}

export function setStorageKey(key: string, storage: unknown): void {
  localStorage.setItem(key, JSON.stringify(storage));
}

export function initStorage(key: string): Record<string, never> {
  const initialStorage = {};

  setStorageKey(key, initialStorage);

  return initialStorage;
}

// Parsing Helpers

const stringToNumber = z.string().transform((val) => parseFloat(val));

// Pending Withdraws

const pendingWithdrawsParser: z.ZodSchema<PendingWithdraws> = z.record(
  z.record(z.array(withdrawParser))
);

export function getPendingWithdraws(): PendingWithdraws {
  const pendingWithdraws: unknown = getStorage(constants.PENDING_WITHDRAWS_KEY);
  const parsedPendingWithdraws = pendingWithdrawsParser.safeParse(pendingWithdraws);
  return parsedPendingWithdraws.success ? parsedPendingWithdraws.data : {};
}

export function addPendingWithdraw(
  chainId: number,
  hermezEthereumAddress: string,
  pendingWithdraw: Withdraw
): PendingWithdraws {
  const pendingWithdraws = getPendingWithdraws();
  const chainPendingWithdraws: ChainPendingWithdraws = pendingWithdraws[chainId] || {};
  const withdraws: Withdraw[] = chainPendingWithdraws[hermezEthereumAddress] || [];
  const newStorage: PendingWithdraws = {
    ...pendingWithdraws,
    [chainId]: {
      ...chainPendingWithdraws,
      [hermezEthereumAddress]: [...withdraws, pendingWithdraw],
    },
  };
  localStorage.setItem(constants.PENDING_WITHDRAWS_KEY, JSON.stringify(newStorage));
  return newStorage;
}

export function removePendingWithdrawByHash(
  chainId: number,
  hermezEthereumAddress: string,
  hash: string
): PendingWithdraws {
  const pendingWithdraws = getPendingWithdraws();
  const chainPendingWithdraws: ChainPendingWithdraws = pendingWithdraws[chainId] || {};
  const withdraws: Withdraw[] = chainPendingWithdraws[hermezEthereumAddress] || [];
  const newStorage: PendingWithdraws = {
    ...pendingWithdraws,
    [chainId]: {
      ...chainPendingWithdraws,
      [hermezEthereumAddress]: withdraws.filter((item) => item.hash !== hash),
    },
  };
  localStorage.setItem(constants.PENDING_WITHDRAWS_KEY, JSON.stringify(newStorage));
  return newStorage;
}

// Pending Delayed Withdraws

const delayedWithdrawParser: z.ZodSchema<DelayedWithdraw> = withdrawParser.and(
  z.object({
    instant: z.boolean(),
  })
);

const pendingDelayedWithdrawsParser: z.ZodSchema<PendingDelayedWithdraws> = z.record(
  z.record(z.array(delayedWithdrawParser))
);

export function getPendingDelayedWithdraws(): PendingDelayedWithdraws {
  const pendingDelayedWithdraws: unknown = getStorage(constants.PENDING_DELAYED_WITHDRAWS_KEY);
  const parsedPendingDelayedWithdraws =
    pendingDelayedWithdrawsParser.safeParse(pendingDelayedWithdraws);
  return parsedPendingDelayedWithdraws.success ? parsedPendingDelayedWithdraws.data : {};
}

export function addPendingDelayedWithdraw(
  chainId: number,
  hermezEthereumAddress: string,
  pendingDelayedWithdraw: DelayedWithdraw
): PendingDelayedWithdraws {
  const pendingDelayedWithdraws = getPendingDelayedWithdraws();
  const chainPendingDelayedWithdraws: ChainPendingDelayedWithdraws =
    pendingDelayedWithdraws[chainId] || {};
  const delayedWithdraws: DelayedWithdraw[] =
    chainPendingDelayedWithdraws[hermezEthereumAddress] || [];
  const newStorage: PendingDelayedWithdraws = {
    ...pendingDelayedWithdraws,
    [chainId]: {
      ...chainPendingDelayedWithdraws,
      [hermezEthereumAddress]: [...delayedWithdraws, pendingDelayedWithdraw],
    },
  };
  localStorage.setItem(constants.PENDING_DELAYED_WITHDRAWS_KEY, JSON.stringify(newStorage));
  return newStorage;
}

export function updatePendingDelayedWithdrawByHash(
  chainId: number,
  hermezEthereumAddress: string,
  hash: string,
  partialDelayedWithdraw: Partial<DelayedWithdraw>
): PendingDelayedWithdraws {
  const pendingDelayedWithdraws = getPendingDelayedWithdraws();
  const chainPendingDelayedWithdraws: ChainPendingDelayedWithdraws =
    pendingDelayedWithdraws[chainId] || {};
  const delayedWithdraws: DelayedWithdraw[] =
    chainPendingDelayedWithdraws[hermezEthereumAddress] || [];
  const newStorage: PendingDelayedWithdraws = {
    ...pendingDelayedWithdraws,
    [chainId]: {
      ...chainPendingDelayedWithdraws,
      [hermezEthereumAddress]: delayedWithdraws.map((item) =>
        item.hash === hash ? { ...item, ...partialDelayedWithdraw } : item
      ),
    },
  };
  localStorage.setItem(constants.PENDING_DELAYED_WITHDRAWS_KEY, JSON.stringify(newStorage));
  return newStorage;
}

export function removePendingDelayedWithdrawById(
  chainId: number,
  hermezEthereumAddress: string,
  id: string
): PendingDelayedWithdraws {
  const pendingDelayedWithdraws = getPendingDelayedWithdraws();
  const chainPendingDelayedWithdraws: ChainPendingDelayedWithdraws =
    pendingDelayedWithdraws[chainId] || {};
  const delayedWithdraws: DelayedWithdraw[] =
    chainPendingDelayedWithdraws[hermezEthereumAddress] || [];
  const newStorage: PendingDelayedWithdraws = {
    ...pendingDelayedWithdraws,
    [chainId]: {
      ...chainPendingDelayedWithdraws,
      [hermezEthereumAddress]: delayedWithdraws.filter((item) => item.id !== id),
    },
  };
  localStorage.setItem(constants.PENDING_DELAYED_WITHDRAWS_KEY, JSON.stringify(newStorage));
  return newStorage;
}

export function removePendingDelayedWithdrawByHash(
  chainId: number,
  hermezEthereumAddress: string,
  hash: string
): PendingDelayedWithdraws {
  const pendingDelayedWithdraws = getPendingDelayedWithdraws();
  const chainPendingDelayedWithdraws: ChainPendingDelayedWithdraws =
    pendingDelayedWithdraws[chainId] || {};
  const delayedWithdraws: DelayedWithdraw[] =
    chainPendingDelayedWithdraws[hermezEthereumAddress] || [];
  const newStorage: PendingDelayedWithdraws = {
    ...pendingDelayedWithdraws,
    [chainId]: {
      ...chainPendingDelayedWithdraws,
      [hermezEthereumAddress]: delayedWithdraws.filter((item) => item.hash !== hash),
    },
  };
  localStorage.setItem(constants.PENDING_DELAYED_WITHDRAWS_KEY, JSON.stringify(newStorage));
  return newStorage;
}

// Pending Deposits

const pendingDepositsParser: z.ZodSchema<PendingDeposits> = z.record(
  z.record(z.array(depositParser))
);

export function getPendingDeposits(): PendingDeposits {
  const pendingDeposits: unknown = getStorage(constants.PENDING_DEPOSITS_KEY);
  const parsedPendingDeposits = pendingDepositsParser.safeParse(pendingDeposits);
  return parsedPendingDeposits.success ? parsedPendingDeposits.data : {};
}

export function addPendingDeposit(
  chainId: number,
  hermezEthereumAddress: string,
  pendingDeposit: Deposit
): PendingDeposits {
  const pendingDeposits = getPendingDeposits();
  const chainPendingDeposits: ChainPendingDeposits = pendingDeposits[chainId] || {};
  const deposits: Deposit[] = chainPendingDeposits[hermezEthereumAddress] || [];
  const newStorage: PendingDeposits = {
    ...pendingDeposits,
    [chainId]: {
      ...chainPendingDeposits,
      [hermezEthereumAddress]: [...deposits, pendingDeposit],
    },
  };
  localStorage.setItem(constants.PENDING_DEPOSITS_KEY, JSON.stringify(newStorage));
  return newStorage;
}

export function updatePendingDepositByHash(
  chainId: number,
  hermezEthereumAddress: string,
  hash: string,
  partialPendingDeposit: Partial<Deposit>
): PendingDeposits {
  const pendingDeposits = getPendingDeposits();
  const chainPendingDeposits: ChainPendingDeposits = pendingDeposits[chainId] || {};
  const deposits: Deposit[] = chainPendingDeposits[hermezEthereumAddress] || [];
  const newStorage: PendingDeposits = {
    ...pendingDeposits,
    [chainId]: {
      ...chainPendingDeposits,
      [hermezEthereumAddress]: deposits.map((item) =>
        item.hash === hash ? { ...item, ...partialPendingDeposit } : item
      ),
    },
  };
  localStorage.setItem(constants.PENDING_DEPOSITS_KEY, JSON.stringify(newStorage));
  return newStorage;
}

export function removePendingDepositByTransactionId(
  chainId: number,
  hermezEthereumAddress: string,
  transactionId: string
): PendingDeposits {
  const pendingDeposits = getPendingDeposits();
  const chainPendingDeposits: ChainPendingDeposits = pendingDeposits[chainId] || {};
  const deposits: Deposit[] = chainPendingDeposits[hermezEthereumAddress] || [];
  const newStorage: PendingDeposits = {
    ...pendingDeposits,
    [chainId]: {
      ...chainPendingDeposits,
      [hermezEthereumAddress]: deposits.filter((deposit) => {
        return deposit.transactionId !== transactionId;
      }),
    },
  };
  localStorage.setItem(constants.PENDING_DEPOSITS_KEY, JSON.stringify(newStorage));
  return newStorage;
}

export function removePendingDepositByHash(
  chainId: number,
  hermezEthereumAddress: string,
  hash: string
): PendingDeposits {
  const pendingDeposits = getPendingDeposits();
  const chainPendingDeposits: ChainPendingDeposits = pendingDeposits[chainId] || {};
  const deposits: Deposit[] = chainPendingDeposits[hermezEthereumAddress] || [];
  const newStorage: PendingDeposits = {
    ...pendingDeposits,
    [chainId]: {
      ...chainPendingDeposits,
      [hermezEthereumAddress]: deposits.filter((deposit) => deposit.hash !== hash),
    },
  };
  localStorage.setItem(constants.PENDING_DEPOSITS_KEY, JSON.stringify(newStorage));
  return newStorage;
}

// Storage Version

export function getCurrentStorageVersion(): number | undefined {
  const currentStorageVersion: unknown = getStorage(constants.STORAGE_VERSION_KEY);
  const parsedCurrentStorageVersion = stringToNumber.safeParse(currentStorageVersion);
  return parsedCurrentStorageVersion.success ? parsedCurrentStorageVersion.data : undefined;
}

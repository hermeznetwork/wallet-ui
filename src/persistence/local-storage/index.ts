import { z } from "zod";

import * as constants from "src/constants";
// domain
import { PendingDeposit, PendingWithdraw, PendingDelayedWithdraw } from "src/domain/hermez";
// persistence
import * as parsers from "src/persistence/parsers";
import {
  AuthSignatures,
  PendingWithdraws,
  ChainPendingWithdraws,
  PendingDelayedWithdraws,
  ChainPendingDelayedWithdraws,
  PendingDeposits,
  ChainPendingDeposits,
} from "src/domain/local-storage";

// Storage Helpers

export function getStorageByKey(key: string): unknown {
  const storageStringOrNull = localStorage.getItem(key);
  if (storageStringOrNull === null) {
    return initStorage(key);
  } else {
    try {
      return JSON.parse(storageStringOrNull);
    } catch (error) {
      return storageStringOrNull;
    }
  }
}

export function setStorageByKey(key: string, value: unknown): void {
  if (typeof value === "string") {
    localStorage.setItem(key, value);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function initStorage(key: string): Record<string, never> {
  const initialStorage = {};

  setStorageByKey(key, initialStorage);

  return initialStorage;
}

// Parsing Helpers

const stringToNumber = z.string().transform((val) => parseFloat(val));

// Auth Signatures

const authSignaturesParser: z.ZodSchema<AuthSignatures> = z.record(z.record(z.string()));

export function getAuthSignatures(): AuthSignatures {
  const authSignatures: unknown = getStorageByKey(constants.ACCOUNT_AUTH_SIGNATURES_KEY);
  const parsedAuthSignatures = authSignaturesParser.safeParse(authSignatures);
  return parsedAuthSignatures.success ? parsedAuthSignatures.data : {};
}

export function setAuthSignatures(authSignatures: AuthSignatures): void {
  setStorageByKey(constants.ACCOUNT_AUTH_SIGNATURES_KEY, authSignatures);
}

// Preferred currency

export function getPreferredCurrency(): string {
  const preferredCurrency: unknown = getStorageByKey(constants.MY_ACCOUNT.PREFERRED_CURRENCY_KEY);
  const parsedPreferredCurrency = z.string().safeParse(preferredCurrency);
  if (parsedPreferredCurrency.success) {
    return parsedPreferredCurrency.data;
  } else {
    setPreferredCurrency(constants.MY_ACCOUNT.DEFAULT_PREFERRED_CURRENCY);
    return constants.MY_ACCOUNT.DEFAULT_PREFERRED_CURRENCY;
  }
}

export function setPreferredCurrency(preferredCurrency: string): void {
  setStorageByKey(constants.MY_ACCOUNT.PREFERRED_CURRENCY_KEY, preferredCurrency);
}

// Pending Withdraws

const pendingWithdrawsParser: z.ZodSchema<PendingWithdraws> = z.record(
  z.record(z.array(parsers.pendingWithdraw))
);

export function getPendingWithdraws(): PendingWithdraws {
  const pendingWithdraws: unknown = getStorageByKey(constants.PENDING_WITHDRAWS_KEY);
  const parsedPendingWithdraws = pendingWithdrawsParser.safeParse(pendingWithdraws);
  return parsedPendingWithdraws.success ? parsedPendingWithdraws.data : {};
}

export function addPendingWithdraw(
  chainId: number,
  hermezEthereumAddress: string,
  pendingWithdraw: PendingWithdraw
): PendingWithdraws {
  const pendingWithdraws = getPendingWithdraws();
  const chainPendingWithdraws: ChainPendingWithdraws = pendingWithdraws[chainId] || {};
  const withdraws: PendingWithdraw[] = chainPendingWithdraws[hermezEthereumAddress] || [];
  const newStorage: PendingWithdraws = {
    ...pendingWithdraws,
    [chainId]: {
      ...chainPendingWithdraws,
      [hermezEthereumAddress]: [...withdraws, pendingWithdraw],
    },
  };
  setStorageByKey(constants.PENDING_WITHDRAWS_KEY, newStorage);
  return newStorage;
}

export function removePendingWithdrawByHash(
  chainId: number,
  hermezEthereumAddress: string,
  hash: string
): PendingWithdraws {
  const pendingWithdraws = getPendingWithdraws();
  const chainPendingWithdraws: ChainPendingWithdraws = pendingWithdraws[chainId] || {};
  const withdraws: PendingWithdraw[] = chainPendingWithdraws[hermezEthereumAddress] || [];
  const newStorage: PendingWithdraws = {
    ...pendingWithdraws,
    [chainId]: {
      ...chainPendingWithdraws,
      [hermezEthereumAddress]: withdraws.filter((item) => item.hash !== hash),
    },
  };
  setStorageByKey(constants.PENDING_WITHDRAWS_KEY, newStorage);
  return newStorage;
}

// Pending Delayed Withdraws

const pendingDelayedWithdrawsParser: z.ZodSchema<PendingDelayedWithdraws> = z.record(
  z.record(z.array(parsers.pendingDelayedWithdraw))
);

export function getPendingDelayedWithdraws(): PendingDelayedWithdraws {
  const pendingDelayedWithdraws: unknown = getStorageByKey(constants.PENDING_DELAYED_WITHDRAWS_KEY);
  const parsedPendingDelayedWithdraws =
    pendingDelayedWithdrawsParser.safeParse(pendingDelayedWithdraws);
  return parsedPendingDelayedWithdraws.success ? parsedPendingDelayedWithdraws.data : {};
}

export function addPendingDelayedWithdraw(
  chainId: number,
  hermezEthereumAddress: string,
  pendingDelayedWithdraw: PendingDelayedWithdraw
): PendingDelayedWithdraws {
  const pendingDelayedWithdraws = getPendingDelayedWithdraws();
  const chainPendingDelayedWithdraws: ChainPendingDelayedWithdraws =
    pendingDelayedWithdraws[chainId] || {};
  const delayedWithdraws: PendingDelayedWithdraw[] =
    chainPendingDelayedWithdraws[hermezEthereumAddress] || [];
  const newStorage: PendingDelayedWithdraws = {
    ...pendingDelayedWithdraws,
    [chainId]: {
      ...chainPendingDelayedWithdraws,
      [hermezEthereumAddress]: [...delayedWithdraws, pendingDelayedWithdraw],
    },
  };
  setStorageByKey(constants.PENDING_DELAYED_WITHDRAWS_KEY, newStorage);
  return newStorage;
}

export function updatePendingDelayedWithdrawByHash(
  chainId: number,
  hermezEthereumAddress: string,
  hash: string,
  partialDelayedWithdraw: Partial<PendingDelayedWithdraw>
): PendingDelayedWithdraws {
  const pendingDelayedWithdraws = getPendingDelayedWithdraws();
  const chainPendingDelayedWithdraws: ChainPendingDelayedWithdraws =
    pendingDelayedWithdraws[chainId] || {};
  const delayedWithdraws: PendingDelayedWithdraw[] =
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
  setStorageByKey(constants.PENDING_DELAYED_WITHDRAWS_KEY, newStorage);
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
  const delayedWithdraws: PendingDelayedWithdraw[] =
    chainPendingDelayedWithdraws[hermezEthereumAddress] || [];
  const newStorage: PendingDelayedWithdraws = {
    ...pendingDelayedWithdraws,
    [chainId]: {
      ...chainPendingDelayedWithdraws,
      [hermezEthereumAddress]: delayedWithdraws.filter((item) => item.id !== id),
    },
  };
  setStorageByKey(constants.PENDING_DELAYED_WITHDRAWS_KEY, newStorage);
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
  const delayedWithdraws: PendingDelayedWithdraw[] =
    chainPendingDelayedWithdraws[hermezEthereumAddress] || [];
  const newStorage: PendingDelayedWithdraws = {
    ...pendingDelayedWithdraws,
    [chainId]: {
      ...chainPendingDelayedWithdraws,
      [hermezEthereumAddress]: delayedWithdraws.filter((item) => item.hash !== hash),
    },
  };
  setStorageByKey(constants.PENDING_DELAYED_WITHDRAWS_KEY, newStorage);
  return newStorage;
}

// Pending Deposits

const pendingDepositsParser: z.ZodSchema<PendingDeposits> = z.record(
  z.record(z.array(parsers.pendingDeposit))
);

export function getPendingDeposits(): PendingDeposits {
  const pendingDeposits: unknown = getStorageByKey(constants.PENDING_DEPOSITS_KEY);
  const parsedPendingDeposits = pendingDepositsParser.safeParse(pendingDeposits);
  return parsedPendingDeposits.success ? parsedPendingDeposits.data : {};
}

export function addPendingDeposit(
  chainId: number,
  hermezEthereumAddress: string,
  pendingDeposit: PendingDeposit
): PendingDeposits {
  const pendingDeposits = getPendingDeposits();
  const chainPendingDeposits: ChainPendingDeposits = pendingDeposits[chainId] || {};
  const deposits: PendingDeposit[] = chainPendingDeposits[hermezEthereumAddress] || [];
  const newStorage: PendingDeposits = {
    ...pendingDeposits,
    [chainId]: {
      ...chainPendingDeposits,
      [hermezEthereumAddress]: [...deposits, pendingDeposit],
    },
  };
  setStorageByKey(constants.PENDING_DEPOSITS_KEY, newStorage);
  return newStorage;
}

export function updatePendingDepositByHash(
  chainId: number,
  hermezEthereumAddress: string,
  hash: string,
  partialPendingDeposit: Partial<PendingDeposit>
): PendingDeposits {
  const pendingDeposits = getPendingDeposits();
  const chainPendingDeposits: ChainPendingDeposits = pendingDeposits[chainId] || {};
  const deposits: PendingDeposit[] = chainPendingDeposits[hermezEthereumAddress] || [];
  const newStorage: PendingDeposits = {
    ...pendingDeposits,
    [chainId]: {
      ...chainPendingDeposits,
      [hermezEthereumAddress]: deposits.map((item) =>
        item.hash === hash ? { ...item, ...partialPendingDeposit } : item
      ),
    },
  };
  setStorageByKey(constants.PENDING_DEPOSITS_KEY, newStorage);
  return newStorage;
}

export function removePendingDepositByTransactionId(
  chainId: number,
  hermezEthereumAddress: string,
  transactionId: string
): PendingDeposits {
  const pendingDeposits = getPendingDeposits();
  const chainPendingDeposits: ChainPendingDeposits = pendingDeposits[chainId] || {};
  const deposits: PendingDeposit[] = chainPendingDeposits[hermezEthereumAddress] || [];
  const newStorage: PendingDeposits = {
    ...pendingDeposits,
    [chainId]: {
      ...chainPendingDeposits,
      [hermezEthereumAddress]: deposits.filter((deposit) => {
        return deposit.transactionId !== transactionId;
      }),
    },
  };
  setStorageByKey(constants.PENDING_DEPOSITS_KEY, newStorage);
  return newStorage;
}

export function removePendingDepositByHash(
  chainId: number,
  hermezEthereumAddress: string,
  hash: string
): PendingDeposits {
  const pendingDeposits = getPendingDeposits();
  const chainPendingDeposits: ChainPendingDeposits = pendingDeposits[chainId] || {};
  const deposits: PendingDeposit[] = chainPendingDeposits[hermezEthereumAddress] || [];
  const newStorage: PendingDeposits = {
    ...pendingDeposits,
    [chainId]: {
      ...chainPendingDeposits,
      [hermezEthereumAddress]: deposits.filter((deposit) => deposit.hash !== hash),
    },
  };
  setStorageByKey(constants.PENDING_DEPOSITS_KEY, newStorage);
  return newStorage;
}

// Storage Version

export function getCurrentStorageVersion(): number | undefined {
  const currentStorageVersion: unknown = getStorageByKey(constants.STORAGE_VERSION_KEY);
  const parsedCurrentStorageVersion = stringToNumber.safeParse(currentStorageVersion);
  return parsedCurrentStorageVersion.success ? parsedCurrentStorageVersion.data : undefined;
}

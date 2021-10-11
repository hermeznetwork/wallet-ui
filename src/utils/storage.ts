import {
  PENDING_DELAYED_WITHDRAWS_KEY,
  PENDING_WITHDRAWS_KEY,
  STORAGE_VERSION,
  STORAGE_VERSION_KEY,
} from "src/constants";
// domain
import { Withdraw, DelayedWithdraw, Deposit } from "src/domain/hermez";
import {
  ChainId,
  HermezEthereumAddress,
  PendingWithdraws,
  ChainPendingWithdraws,
  PendingDelayedWithdraws,
  ChainPendingDelayedWithdraws,
  PendingDeposits,
  ChainPendingDeposits,
} from "src/domain/local-storage";
// persistence
import {
  getPendingWithdraws,
  getPendingDelayedWithdraws,
  getCurrentStorageVersion,
  setStorageByKey,
} from "src/persistence/local-storage";

// MIGRATIONS
function runV2Migration() {
  const pendingWithdraws = getPendingWithdraws();
  const newPendingWithdraws: PendingWithdraws = Object.keys(pendingWithdraws).reduce(
    (currentChainPendingWithdraws: PendingWithdraws, chainId: ChainId): PendingWithdraws => {
      const chainPendingWithdraws: ChainPendingWithdraws = pendingWithdraws[chainId];
      const newChainPendingWithdraws: ChainPendingWithdraws = Object.keys(
        chainPendingWithdraws
      ).reduce(
        (
          currentAccountPendingWithdraws: ChainPendingWithdraws,
          hezEthereumAddress: HermezEthereumAddress
        ): ChainPendingWithdraws => {
          const accountPendingWithdraws: Withdraw[] = chainPendingWithdraws[hezEthereumAddress];
          const newAccountPendingWithdraws = accountPendingWithdraws.filter(
            (pendingWithdraw) => pendingWithdraw.hash !== undefined
          );

          return {
            ...currentAccountPendingWithdraws,
            [hezEthereumAddress]: newAccountPendingWithdraws,
          };
        },
        {}
      );

      return {
        ...currentChainPendingWithdraws,
        [chainId]: newChainPendingWithdraws,
      };
    },
    {}
  );

  setStorageByKey(PENDING_WITHDRAWS_KEY, JSON.stringify(newPendingWithdraws));

  const pendingDelayedWithdraws = getPendingDelayedWithdraws();
  const newPendingDelayedWithdraws: PendingDelayedWithdraws = Object.keys(
    pendingDelayedWithdraws
  ).reduce((currentChainPendingDelayedWithdraws: PendingDelayedWithdraws, chainId: ChainId) => {
    const chainPendingDelayedWithdraws: ChainPendingDelayedWithdraws =
      pendingDelayedWithdraws[chainId];
    const newChainPendingDelayedWithdraws: ChainPendingDelayedWithdraws = Object.keys(
      chainPendingDelayedWithdraws
    ).reduce(
      (
        currentAccountPendingDelayedWithdraws: ChainPendingDelayedWithdraws,
        hezEthereumAddress: HermezEthereumAddress
      ) => {
        const accountPendingDelayedWithdraws: DelayedWithdraw[] =
          chainPendingDelayedWithdraws[hezEthereumAddress];
        const newAccountPendingDelayedWithdraws: DelayedWithdraw[] =
          accountPendingDelayedWithdraws.filter(
            (pendingDelayedWithdraw) => pendingDelayedWithdraw.hash !== undefined
          );

        return {
          ...currentAccountPendingDelayedWithdraws,
          [hezEthereumAddress]: newAccountPendingDelayedWithdraws,
        };
      },
      {}
    );

    return {
      ...currentChainPendingDelayedWithdraws,
      [chainId]: newChainPendingDelayedWithdraws,
    };
  }, {});

  setStorageByKey(PENDING_DELAYED_WITHDRAWS_KEY, JSON.stringify(newPendingDelayedWithdraws));
}

function checkVersion(): void {
  const currentStorageVersion = getCurrentStorageVersion();

  if (currentStorageVersion === undefined) {
    setStorageByKey(STORAGE_VERSION_KEY, JSON.stringify(STORAGE_VERSION));
  } else {
    // LocalStorage migrations
    if (STORAGE_VERSION > currentStorageVersion) {
      // Added L1 withdraws tracking
      if (STORAGE_VERSION >= 2) {
        runV2Migration();
      }

      setStorageByKey(STORAGE_VERSION_KEY, JSON.stringify(STORAGE_VERSION));
    }
  }
}

function getPendingWithdrawsByHermezAddress(
  pendingWithdrawsStorage: PendingWithdraws,
  chainId: number,
  hermezEthereumAddress: string
): Withdraw[] {
  const chainPendingWithdraws: ChainPendingWithdraws = pendingWithdrawsStorage[chainId] || {};
  const accountWithdraws: Withdraw[] = chainPendingWithdraws[hermezEthereumAddress] || [];
  return accountWithdraws;
}

function getPendingDelayedWithdrawsByHermezAddress(
  pendingDelayedWithdrawsStorage: PendingDelayedWithdraws,
  chainId: number,
  hermezEthereumAddress: string
): DelayedWithdraw[] {
  const chainPendingDelayedWithdraws: ChainPendingDelayedWithdraws =
    pendingDelayedWithdrawsStorage[chainId] || {};
  const accountWithdraws: DelayedWithdraw[] =
    chainPendingDelayedWithdraws[hermezEthereumAddress] || [];
  return accountWithdraws;
}

function getPendingDepositsByHermezAddress(
  pendingDepositsStorage: PendingDeposits,
  chainId: number,
  hermezEthereumAddress: string
): Deposit[] {
  const chainPendingDeposits: ChainPendingDeposits = pendingDepositsStorage[chainId] || {};
  const accountDeposits: Deposit[] = chainPendingDeposits[hermezEthereumAddress] || [];
  return accountDeposits;
}

export {
  checkVersion,
  getPendingWithdrawsByHermezAddress,
  getPendingDelayedWithdrawsByHermezAddress,
  getPendingDepositsByHermezAddress,
};

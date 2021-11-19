import {
  PENDING_DELAYED_WITHDRAWS_KEY,
  PENDING_WITHDRAWS_KEY,
  STORAGE_VERSION,
  STORAGE_VERSION_KEY,
} from "src/constants";
// domain
import {
  PendingWithdraw,
  PendingDelayedWithdraw,
  PendingDeposit,
  AvailableWithdraw,
} from "src/domain/hermez";
import {
  ChainId,
  HermezEthereumAddress,
  PendingWithdraws,
  ChainPendingWithdraws,
  PendingDelayedWithdraws,
  ChainPendingDelayedWithdraws,
  PendingDeposits,
  ChainPendingDeposits,
  AvailableWithdraws,
  ChainAvailableWithdraws,
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
          const accountPendingWithdraws: PendingWithdraw[] =
            chainPendingWithdraws[hezEthereumAddress];
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
        const accountPendingDelayedWithdraws: PendingDelayedWithdraw[] =
          chainPendingDelayedWithdraws[hezEthereumAddress];
        const newAccountPendingDelayedWithdraws: PendingDelayedWithdraw[] =
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
): PendingWithdraw[] {
  const chainPendingWithdraws: ChainPendingWithdraws = pendingWithdrawsStorage[chainId] || {};
  const accountWithdraws: PendingWithdraw[] = chainPendingWithdraws[hermezEthereumAddress] || [];
  return accountWithdraws;
}

function getPendingDelayedWithdrawsByHermezAddress(
  pendingDelayedWithdrawsStorage: PendingDelayedWithdraws,
  chainId: number,
  hermezEthereumAddress: string
): PendingDelayedWithdraw[] {
  const chainPendingDelayedWithdraws: ChainPendingDelayedWithdraws =
    pendingDelayedWithdrawsStorage[chainId] || {};
  const accountWithdraws: PendingDelayedWithdraw[] =
    chainPendingDelayedWithdraws[hermezEthereumAddress] || [];
  return accountWithdraws;
}

function getPendingDepositsByHermezAddress(
  pendingDepositsStorage: PendingDeposits,
  chainId: number,
  hermezEthereumAddress: string
): PendingDeposit[] {
  const chainPendingDeposits: ChainPendingDeposits = pendingDepositsStorage[chainId] || {};
  const accountDeposits: PendingDeposit[] = chainPendingDeposits[hermezEthereumAddress] || [];
  return accountDeposits;
}

function getAvailableWithdrawsByHermezAddress(
  availableWithdrawsStorage: AvailableWithdraws,
  chainId: number,
  hermezEthereumAddress: string
): AvailableWithdraw[] {
  const chainAvailableWithdraws: ChainAvailableWithdraws = availableWithdrawsStorage[chainId] || {};
  const accountWithdraws: AvailableWithdraw[] =
    chainAvailableWithdraws[hermezEthereumAddress] || [];
  return accountWithdraws;
}

export {
  checkVersion,
  getPendingWithdrawsByHermezAddress,
  getPendingDelayedWithdrawsByHermezAddress,
  getPendingDepositsByHermezAddress,
  getAvailableWithdrawsByHermezAddress,
};

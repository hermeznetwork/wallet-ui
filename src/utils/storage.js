import {
  PENDING_DELAYED_WITHDRAWS_KEY,
  PENDING_WITHDRAWS_KEY,
  STORAGE_VERSION,
  STORAGE_VERSION_KEY,
} from "../constants";

// MIGRATIONS
function runV2Migration() {
  const pendingWithdraws = getStorage(PENDING_WITHDRAWS_KEY);
  const newPendingWithdraws = Object.keys(pendingWithdraws).reduce(
    (currentChainPendingWithdraws, chainId) => {
      const chainPendingWithdraws = pendingWithdraws[chainId];
      const newChainPendingWithdraws = Object.keys(chainPendingWithdraws).reduce(
        (currentAccountPendingWithdraws, hezEthereumAddress) => {
          const accountPendingWithdraws = chainPendingWithdraws[hezEthereumAddress];
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

  setStorage(PENDING_WITHDRAWS_KEY, newPendingWithdraws);

  const pendingDelayedWithdraws = getStorage(PENDING_DELAYED_WITHDRAWS_KEY);
  const newPendingDelayedWithdraws = Object.keys(pendingDelayedWithdraws).reduce(
    (currentChainPendingDelayedWithdraws, chainId) => {
      const chainPendingDelayedWithdraws = pendingDelayedWithdraws[chainId];
      const newChainPendingDelayedWithdraws = Object.keys(chainPendingDelayedWithdraws).reduce(
        (currentAccountPendingDelayedWithdraws, hezEthereumAddress) => {
          const accountPendingDelayedWithdraws = chainPendingDelayedWithdraws[hezEthereumAddress];
          const newAccountPendingDelayedWithdraws = accountPendingDelayedWithdraws.filter(
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
    },
    {}
  );

  setStorage(PENDING_DELAYED_WITHDRAWS_KEY, newPendingDelayedWithdraws);
}

function checkVersion() {
  const currentStorageVersion = JSON.parse(localStorage.getItem(STORAGE_VERSION_KEY));

  if (!currentStorageVersion) {
    localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
  }

  // LocalStorage migrations
  if (currentStorageVersion && STORAGE_VERSION > currentStorageVersion) {
    // Added L1 withdraws tracking
    if (STORAGE_VERSION >= 2) {
      runV2Migration();
    }

    localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
  }
}

function initStorage(key) {
  const initialStorage = {};

  localStorage.setItem(key, JSON.stringify(initialStorage));

  return initialStorage;
}

function getStorage(key) {
  const storage = JSON.parse(localStorage.getItem(key));

  if (!storage) {
    return initStorage(key);
  }

  return storage;
}

function setStorage(key, storage) {
  localStorage.setItem(key, JSON.stringify(storage));
}

function addItem(key, chainId, hermezEthereumAddress, item) {
  const storage = getStorage(key);
  const chainIdStorage = storage[chainId] || {};
  const accountStorage = chainIdStorage[hermezEthereumAddress] || [];
  const newStorage = {
    ...storage,
    [chainId]: {
      ...chainIdStorage,
      [hermezEthereumAddress]: [...accountStorage, item],
    },
  };

  setStorage(key, newStorage);

  return newStorage;
}

function removeItem(key, chainId, hermezEthereumAddress, id) {
  const storage = getStorage(key);
  const chainIdStorage = storage[chainId] || {};
  const accountStorage = chainIdStorage[hermezEthereumAddress] || [];
  const newStorage = {
    ...storage,
    [chainId]: {
      ...chainIdStorage,
      [hermezEthereumAddress]: accountStorage.filter((item) => item.id !== id),
    },
  };

  setStorage(key, newStorage);

  return newStorage;
}

function removeItemByCustomProp(key, chainId, hermezEthereumAddress, prop) {
  const storage = getStorage(key);
  const chainIdStorage = storage[chainId] || {};
  const accountStorage = chainIdStorage[hermezEthereumAddress] || [];
  const newStorage = {
    ...storage,
    [chainId]: {
      ...chainIdStorage,
      [hermezEthereumAddress]: accountStorage.filter((item) => item[prop.name] !== prop.value),
    },
  };

  setStorage(key, newStorage);

  return newStorage;
}

function updatePartialItemByCustomProp(key, chainId, hermezEthereumAddress, prop, partialItem) {
  const storage = getStorage(key);
  const chainIdStorage = storage[chainId] || {};
  const accountStorage = chainIdStorage[hermezEthereumAddress] || [];
  const newStorage = {
    ...storage,
    [chainId]: {
      ...chainIdStorage,
      [hermezEthereumAddress]: accountStorage.map((item) => {
        if (item[prop.name] === prop.value) {
          return { ...item, ...partialItem };
        }
        return item;
      }),
    },
  };

  setStorage(key, newStorage);

  return newStorage;
}

function getItemsByHermezAddress(storage, chainId, hermezEthereumAddress) {
  const chainIdIdStorage = storage[chainId] || {};
  const accountStorage = chainIdIdStorage[hermezEthereumAddress] || [];

  return accountStorage;
}

export {
  checkVersion,
  getStorage,
  addItem,
  removeItem,
  removeItemByCustomProp,
  updatePartialItemByCustomProp,
  getItemsByHermezAddress,
};

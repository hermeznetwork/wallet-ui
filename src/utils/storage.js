import { STORAGE_VERSION, STORAGE_VERSION_KEY } from '../constants'

function initStorage (key) {
  const initialStorage = {}

  localStorage.setItem(key, JSON.stringify(initialStorage))

  return initialStorage
}

function getStorage (key) {
  const storage = JSON.parse(localStorage.getItem(key))
  const storageVersion = JSON.parse(localStorage.getItem(STORAGE_VERSION_KEY))

  if (!storageVersion) {
    localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION)
  }

  if (!storage || storageVersion !== STORAGE_VERSION) {
    return initStorage(key)
  }

  return storage
}

function addItem (key, chainId, hermezEthereumAddress, item) {
  const storage = getStorage(key)
  const chainIdStorage = storage[chainId] || {}
  const accountStorage = chainIdStorage[hermezEthereumAddress] || []
  const newStorage = {
    ...storage,
    [chainId]: {
      ...chainIdStorage,
      [hermezEthereumAddress]: [...accountStorage, item]
    }
  }

  localStorage.setItem(key, JSON.stringify(newStorage))

  return newStorage
}

function removeItem (key, chainId, hermezEthereumAddress, id) {
  const storage = getStorage(key)
  const chainIdStorage = storage[chainId] || {}
  const accountStorage = chainIdStorage[hermezEthereumAddress] || []
  const newStorage = {
    ...storage,
    [chainId]: {
      ...chainIdStorage,
      [hermezEthereumAddress]: accountStorage.filter(item => item.id !== id)
    }
  }

  localStorage.setItem(key, JSON.stringify(newStorage))

  return newStorage
}

function updatePartialItemByCustomProp (key, chainId, hermezEthereumAddress, prop, partialItem) {
  const storage = getStorage(key)
  const chainIdStorage = storage[chainId] || {}
  const accountStorage = chainIdStorage[hermezEthereumAddress] || []
  const newStorage = {
    ...storage,
    [chainId]: {
      ...chainIdStorage,
      [hermezEthereumAddress]: accountStorage.map((item) => {
        if (item[prop.name] === prop.value) {
          return { ...item, ...partialItem }
        }
        return item
      })
    }
  }

  localStorage.setItem(key, JSON.stringify(newStorage))

  return newStorage
}

function getItemsByHermezAddress (storage, chainId, hermezEthereumAddress) {
  const chainIdIdStorage = storage[chainId] || {}
  const accountStorage = chainIdIdStorage[hermezEthereumAddress] || []

  return accountStorage
}

export {
  getStorage,
  addItem,
  removeItem,
  updatePartialItemByCustomProp,
  getItemsByHermezAddress
}

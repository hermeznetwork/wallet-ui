function getPaginationData (pendingItems) {
  return pendingItems === 0
    ? { hasMoreItems: false }
    : { hasMoreItems: true }
}

export {
  getPaginationData
}

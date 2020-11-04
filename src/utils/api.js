function getPaginationData (items, pagination) {
  const { totalItems } = pagination
  const lastReturnedItem = items[items.length - 1]

  return pagination.lastItem === lastReturnedItem.itemId
    ? { hasMoreItems: false, totalItems }
    : { hasMoreItems: true, totalItems, fromItem: lastReturnedItem.itemId + 1 }
}

export {
  getPaginationData
}

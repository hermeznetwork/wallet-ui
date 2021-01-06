import { PaginationOrder } from '@hermeznetwork/hermezjs/src/api'

/**
 * Checks if a request to a paginated API endpoint has more items pending to retrieve
 * @param {number} pendingItems - Pending items to retrieve from a paginated API endpoint
 * @returns {Object} - Pagination information for the next request
 */
function getPaginationData (pendingItems, items, order) {
  if (pendingItems === 0) {
    return { hasMoreItems: false }
  }

  const fromItem = !order || order === PaginationOrder.ASC
    ? items[items.length - 1].itemId + 1
    : items[items.length - 1].itemId - 1

  return { hasMoreItems: true, fromItem }
}

export {
  getPaginationData
}

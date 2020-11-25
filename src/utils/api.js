/**
 * Checks if a request to a paginated API endpoint has more items pending to retrieve
 * @param {number} pendingItems - Pending items to retrieve from a paginated API endpoint
 * @returns {Object} - Pagination information for the next request
 */
function getPaginationData (pendingItems) {
  return pendingItems === 0
    ? { hasMoreItems: false }
    : { hasMoreItems: true }
}

export {
  getPaginationData
}

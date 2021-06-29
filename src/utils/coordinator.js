/**
 * Extracts the nextForgerUrls without duplicates from the coordinator state returned by
 * the Hermez API
 * @param {Object} coordinatorState - Coordinator state returned by the Hermez API
 * @returns URL's of the next forgers
 */
function getNextForgerUrls (coordinatorState) {
  const nextForgerUrls = coordinatorState.network.nextForgers.map((nextForger) => nextForger.coordinator.URL)

  return [...new Set(nextForgerUrls)]
}

export { getNextForgerUrls }

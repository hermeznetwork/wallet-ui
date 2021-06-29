/**
 * Extracts the next forgers without duplicates from the coordinator state returned by
 * the Hermez API
 * @param {Object} coordinatorState - Coordinator state returned by the Hermez API
 * @returns Next forgers
 */
function getNextForgers (coordinatorState) {
  return coordinatorState.network.nextForgers.reduce((acc, curr) => {
    const doesItemExist = acc.find(elem => elem.coordinator.forgerAddr === curr.coordinator.forgerAddr)

    return doesItemExist
      ? acc
      : [...acc, curr]
  }, [])
}

/**
 * Extracts the nextForgerUrls without duplicates from the coordinator state returned by
 * the Hermez API
 * @param {Object} coordinatorState - Coordinator state returned by the Hermez API
 * @returns URL's of the next forgers
 */
function getNextForgerUrls (coordinatorState) {
  const nextForgerUrls = getNextForgers(coordinatorState)
    .map((nextForger) => nextForger.coordinator.URL)

  return nextForgerUrls
}

export {
  getNextForgers,
  getNextForgerUrls
}

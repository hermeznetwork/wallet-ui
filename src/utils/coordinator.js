import { DELAY_TO_NEXT_FORGER } from '../constants'

/**
 * Extracts the next forgers without duplicates from the coordinator state returned by
 * the Hermez API
 * @param {Object} coordinatorState - Coordinator state returned by the Hermez API
 * @returns Next forgers
 */
function getNextForgers (coordinatorState) {
  return (coordinatorState.network.nextForgers || []).reduce((acc, curr) => {
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

/**
 * Returns the next best forger of the network. The next best forger is the one which will
 * be forging for at least enough time to pick the transaction that we are going to send
 * afterwards. If it's about to finish forging, the next forger matching this criteria
 * will be picked up
 * @param {Object} coordinatorState - Coordinator state returned by the Hermez API
 * @returns Next best forger
 */
function getNextBestForger (coordinatorState) {
  const nextForgers = getNextForgers(coordinatorState)

  if (nextForgers.length === 0) {
    return undefined
  }

  if (nextForgers.length === 1) {
    return nextForgers[0]
  }

  const bestNextForgers = nextForgers.filter((forger) => {
    const toTimestamp = new Date(forger.period.toTimestamp).getTime()
    const expectedMinTime = Date.now() + DELAY_TO_NEXT_FORGER

    return expectedMinTime <= toTimestamp
  })

  return bestNextForgers.length === 0
    ? nextForgers[1]
    : bestNextForgers[0]
}

export {
  getNextForgers,
  getNextForgerUrls,
  getNextBestForger
}

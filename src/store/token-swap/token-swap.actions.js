export const tokenSwapActionTypes = {
  GO_TO_SWAP: '[TOKEN SWAP] GO TO SWAP',
  GO_TO_QUOTES: '[TOKEN SWAP] GO TO QUOTES',
  RESET_STATE: '[TOKEN SWAP] RESET STATE'
}

function goToSwap () {
  return {
    type: tokenSwapActionTypes.GO_TO_SWAP
  }
}

function goToQuotes () {
  return {
    type: tokenSwapActionTypes.GO_TO_QUOTES
  }
}

function resetState () {
  return {
    type: tokenSwapActionTypes.RESET_STATE
  }
}

export {
  goToSwap,
  goToQuotes,
  resetState
}

export const tokenSwapActionTypes = {
  RESET_STATE: '[TOKEN SWAP] RESET STATE'
}

function resetState () {
  return {
    type: tokenSwapActionTypes.RESET_STATE
  }
}

export {
  resetState
}

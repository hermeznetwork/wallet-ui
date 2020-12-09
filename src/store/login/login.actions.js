export const loginActionTypes = {
  GO_TO_ACCOUNT_SELECTOR_STEP: '[ACCOUNT] GO TO ACCOUNT SELECTOR STEP',
  GO_TO_LOADING_STEP: '[ACCOUNT] GO TO LOADING STEP'
}

function goToAccountSelectorStep (walletName) {
  return {
    type: loginActionTypes.GO_TO_ACCOUNT_SELECTOR_STEP,
    walletName
  }
}

function goToLoadingStep (walletName) {
  return {
    type: loginActionTypes.GO_TO_LOADING_STEP,
    walletName
  }
}

export {
  goToAccountSelectorStep,
  goToLoadingStep
}

export const globalActionTypes = {
  LOAD_TOKENS: '[GLOBAL] LOAD TOKENS',
  LOAD_TOKENS_SUCCESS: '[GLOBAL] LOAD TOKENS SUCCESS',
  LOAD_TOKENS_FAILURE: '[GLOBAL] LOAD TOKENS FAILURE',
  LOAD_OPERATOR: '[GLOBAL] LOAD_OPERATOR',
  LOAD_OPERATOR_SUCCESS: '[GLOBAL] LOAD_OPERATOR_SUCCESS',
  LOAD_OPERATOR_FAILURE: '[GLOBAL] LOAD_OPERATOR_FAILURE',
  LOAD_CONFIG: '[GLOBAL] LOAD_CONFIG',
  LOAD_CONFIG_SUCCESS: '[GLOBAL] LOAD_CONFIG_SUCCESS',
  LOAD_CONFIG_FAILURE: '[GLOBAL] LOAD_CONFIG_FAILURE',
  LOAD_GAS_MULTIPLIER: '[GLOBAL] LOAD_GAS_MULTIPLIER',
  LOAD_CURRENT_BATCH: '[GLOBAL] LOAD_CURRENT_BATCH',
  LOAD_CURRENT_BATCH_SUCCESS: '[GLOBAL] LOAD_CURRENT_BATCH',
  LOAD_CURRENT_BATCH_FAILURE: '[GLOBAL] LOAD_CURRENT_BATCH_FAILURE'
}

function loadTokens () {
  return {
    type: globalActionTypes.LOAD_TOKENS
  }
}

function loadTokensSuccess (accounts) {
  return {
    type: globalActionTypes.LOAD_TOKENS_SUCCESS,
    accounts: accounts
  }
}

function loadTokensFailure () {
  return {
    type: globalActionTypes.LOAD_TOKENS_FAILURE
  }
}

function loadConfig () {
  return {
    type: globalActionTypes.LOAD_CONFIG
  }
}

function loadConfigSuccess (config, abiRollup, abiTokens, chainId, errorMessage) {
  return {
    type: globalActionTypes.LOAD_CONFIG_SUCCESS,
    config: { config, abiRollup, abiTokens, chainId },
    error: errorMessage
  }
}

function loadConfigFailure (config, error) {
  return {
    type: globalActionTypes.LOAD_CONFIG_FAILURE,
    config: { config },
    error
  }
}

function loadOperator () {
  return {
    type: globalActionTypes.LOAD_OPERATOR
  }
}

function loadOperatorSuccess (apiOperator) {
  return {
    type: globalActionTypes.LOAD_OPERATOR_SUCCESS,
    apiOperator: apiOperator
  }
}

function loadOperatorFailure (error) {
  return {
    type: globalActionTypes.LOAD_OPERATOR_FAILURE,
    error
  }
}

function loadGasMultiplier (num) {
  return {
    type: globalActionTypes.LOAD_GAS_MULTIPLIER,
    gasMultiplier: num
  }
}

function loadCurrentBatch () {
  return {
    type: globalActionTypes.LOAD_CURRENT_BATCH
  }
}

function loadCurrentBatchSuccess (currentBatch) {
  return {
    type: globalActionTypes.LOAD_CURRENT_BATCH_SUCCESS,
    currentBatch: currentBatch
  }
}

function loadCurrentBatchFailure () {
  return {
    type: globalActionTypes.LOAD_CURRENT_BATCH_FAILURE
  }
}

export {
  loadTokens,
  loadTokensSuccess,
  loadTokensFailure,
  loadConfig,
  loadConfigSuccess,
  loadConfigFailure,
  loadOperator,
  loadOperatorSuccess,
  loadOperatorFailure,
  loadGasMultiplier,
  loadCurrentBatch,
  loadCurrentBatchSuccess,
  loadCurrentBatchFailure
}

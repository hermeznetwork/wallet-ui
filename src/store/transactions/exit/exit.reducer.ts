import {
  ExitAction,
  TransactionToReview,
  Step,
  ExitActionTypes,
} from "src/store/transactions/exit/exit.actions";
import { AsyncTask } from "src/utils/types";
// domain
import { PooledTransaction, Account, RecommendedFee } from "src/domain/hermez";
import { EstimatedWithdrawFee } from "src/domain";

export interface ExitState {
  step: Step;
  pooledTransactionsTask: AsyncTask<PooledTransaction[], Error>;
  accountTask: AsyncTask<Account, string>;
  feesTask: AsyncTask<RecommendedFee, Error>;
  estimatedWithdrawFeeTask: AsyncTask<EstimatedWithdrawFee, Error>;
  transaction: TransactionToReview | undefined;
  isTransactionBeingApproved: boolean;
}

const initialExitState: ExitState = {
  step: "load-account",
  pooledTransactionsTask: {
    status: "pending",
  },
  accountTask: {
    status: "pending",
  },
  feesTask: {
    status: "pending",
  },
  estimatedWithdrawFeeTask: {
    status: "pending",
  },
  transaction: undefined,
  isTransactionBeingApproved: false,
};

function exitReducer(state: ExitState = initialExitState, action: ExitAction): ExitState {
  switch (action.type) {
    case ExitActionTypes.GO_TO_BUILD_TRANSACTION_STEP: {
      return {
        ...state,
        step: "build-transaction",
        accountTask: {
          status: "successful",
          data: action.account,
        },
      };
    }
    case ExitActionTypes.GO_TO_REVIEW_TRANSACTION_STEP: {
      return {
        ...state,
        step: "review-transaction",
        transaction: action.transaction,
      };
    }
    case ExitActionTypes.CHANGE_CURRENT_STEP: {
      return {
        ...state,
        step: action.nextStep,
      };
    }
    case ExitActionTypes.LOAD_POOLED_TRANSACTIONS: {
      return {
        ...state,
        pooledTransactionsTask:
          state.pooledTransactionsTask.status === "successful"
            ? {
                status: "reloading",
                data: state.pooledTransactionsTask.data,
              }
            : {
                status: "loading",
              },
      };
    }
    case ExitActionTypes.LOAD_POOLED_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        pooledTransactionsTask: {
          status: "successful",
          data: action.transactions,
        },
      };
    }
    case ExitActionTypes.LOAD_POOLED_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        pooledTransactionsTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case ExitActionTypes.LOAD_ACCOUNT: {
      return {
        ...state,
        accountTask: {
          status: "loading",
        },
      };
    }
    case ExitActionTypes.LOAD_ACCOUNT_SUCCESS: {
      return {
        ...state,
        step: "build-transaction",
        accountTask: {
          status: "successful",
          data: action.account,
        },
      };
    }
    case ExitActionTypes.LOAD_ACCOUNT_FAILURE: {
      return {
        ...state,
        accountTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case ExitActionTypes.LOAD_FEES:
      return {
        ...state,
        feesTask: {
          status: "loading",
        },
      };
    case ExitActionTypes.LOAD_FEES_SUCCESS:
      return {
        ...state,
        feesTask: {
          status: "successful",
          data: action.fees,
        },
      };
    case ExitActionTypes.LOAD_FEES_FAILURE:
      return {
        ...state,
        feesTask: {
          status: "failed",
          error: action.error,
        },
      };
    case ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE: {
      return {
        ...state,
        estimatedWithdrawFeeTask: {
          status: "loading",
        },
      };
    }
    case ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_SUCCESS: {
      return {
        ...state,
        estimatedWithdrawFeeTask: {
          status: "successful",
          data: action.estimatedFee,
        },
      };
    }
    case ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_FAILURE: {
      return {
        ...state,
        estimatedWithdrawFeeTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case ExitActionTypes.START_TRANSACTION_APPROVAL: {
      return {
        ...state,
        isTransactionBeingApproved: true,
      };
    }
    case ExitActionTypes.STOP_TRANSACTION_APPROVAL: {
      return {
        ...state,
        isTransactionBeingApproved: false,
      };
    }
    case ExitActionTypes.RESET_STATE: {
      return initialExitState;
    }
    default: {
      return state;
    }
  }
}

export default exitReducer;

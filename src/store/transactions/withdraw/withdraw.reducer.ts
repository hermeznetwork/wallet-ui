import {
  WithdrawAction,
  WithdrawActionTypes,
  Step,
} from "src/store/transactions/withdraw/withdraw.actions";
import { AsyncTask } from "src/utils/types";
// domain
import { PoolTransaction, Exit, HermezAccount } from "src/domain/hermez";
import { EstimatedL1Fee } from "src/domain";

export interface WithdrawState {
  step: Step;
  poolTransactionsTask: AsyncTask<PoolTransaction[], Error>;
  accountTask: AsyncTask<HermezAccount, string>;
  exitTask: AsyncTask<Exit, Error>;
  estimatedWithdrawFeeTask: AsyncTask<EstimatedL1Fee, Error>;
  isTransactionBeingApproved: boolean;
}

const initialWithdrawState: WithdrawState = {
  step: "load-data",
  poolTransactionsTask: {
    status: "pending",
  },
  accountTask: {
    status: "pending",
  },
  exitTask: {
    status: "pending",
  },
  estimatedWithdrawFeeTask: {
    status: "pending",
  },
  isTransactionBeingApproved: false,
};

function withdrawReducer(
  state: WithdrawState = initialWithdrawState,
  action: WithdrawAction
): WithdrawState {
  switch (action.type) {
    case WithdrawActionTypes.LOAD_POOL_TRANSACTIONS: {
      return {
        ...state,
        poolTransactionsTask:
          state.poolTransactionsTask.status === "successful"
            ? {
                status: "reloading",
                data: state.poolTransactionsTask.data,
              }
            : {
                status: "loading",
              },
      };
    }
    case WithdrawActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        poolTransactionsTask: {
          status: "successful",
          data: action.transactions,
        },
      };
    }
    case WithdrawActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        poolTransactionsTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case WithdrawActionTypes.LOAD_ACCOUNT: {
      return {
        ...state,
        accountTask: {
          status: "loading",
        },
      };
    }
    case WithdrawActionTypes.LOAD_ACCOUNT_SUCCESS: {
      return {
        ...state,
        step: state.exitTask.status === "successful" ? "review-transaction" : state.step,
        accountTask: {
          status: "successful",
          data: action.account,
        },
      };
    }
    case WithdrawActionTypes.LOAD_ACCOUNT_FAILURE: {
      return {
        ...state,
        accountTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case WithdrawActionTypes.LOAD_EXIT: {
      return {
        ...state,
        exitTask: {
          status: "loading",
        },
      };
    }
    case WithdrawActionTypes.LOAD_EXIT_SUCCESS: {
      return {
        ...state,
        step: state.accountTask.status === "successful" ? "review-transaction" : state.step,
        exitTask: {
          status: "successful",
          data: action.exit,
        },
      };
    }
    case WithdrawActionTypes.LOAD_EXIT_FAILURE: {
      return {
        ...state,
        exitTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case WithdrawActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE:
      return {
        ...state,
        estimatedWithdrawFeeTask:
          state.estimatedWithdrawFeeTask.status === "successful"
            ? { status: "reloading", data: state.estimatedWithdrawFeeTask.data }
            : { status: "loading" },
      };
    case WithdrawActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_SUCCESS:
      return {
        ...state,
        estimatedWithdrawFeeTask: {
          status: "successful",
          data: action.estimatedFee,
        },
      };
    case WithdrawActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_FAILURE:
      return {
        ...state,
        estimatedWithdrawFeeTask: {
          status: "failed",
          error: action.error,
        },
      };
    case WithdrawActionTypes.START_TRANSACTION_APPROVAL: {
      return {
        ...state,
        isTransactionBeingApproved: true,
      };
    }
    case WithdrawActionTypes.STOP_TRANSACTION_APPROVAL: {
      return {
        ...state,
        isTransactionBeingApproved: false,
      };
    }
    case WithdrawActionTypes.RESET_STATE: {
      return initialWithdrawState;
    }
    default: {
      return state;
    }
  }
}

export default withdrawReducer;

import { BigNumber } from "@ethersproject/bignumber";

import {
  ExitAction,
  TransactionToReview,
  Step,
  ExitActionTypes,
} from "src/store/transactions/exit/exit.actions";
import { AsyncTask } from "src/utils/types";
// domain
import { HermezAccount, RecommendedFee, EstimatedL1Fee } from "src/domain";

export interface ExitState {
  step: Step;
  accountTask: AsyncTask<HermezAccount, string>;
  feesTask: AsyncTask<RecommendedFee, Error>;
  accountBalanceTask: AsyncTask<BigNumber, Error>;
  estimatedWithdrawFeeTask: AsyncTask<EstimatedL1Fee, Error>;
  transaction: TransactionToReview | undefined;
  isTransactionBeingApproved: boolean;
}

const initialExitState: ExitState = {
  step: "load-account",
  accountTask: {
    status: "pending",
  },
  feesTask: {
    status: "pending",
  },
  accountBalanceTask: {
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
    case ExitActionTypes.LOAD_ACCOUNT_BALANCE: {
      return {
        ...state,
        accountBalanceTask: {
          status: "loading",
        },
      };
    }
    case ExitActionTypes.LOAD_ACCOUNT_BALANCE_SUCCESS: {
      return {
        ...state,
        accountBalanceTask: {
          status: "successful",
          data: action.balance,
        },
      };
    }
    case ExitActionTypes.LOAD_ACCOUNT_BALANCE_FAILURE: {
      return {
        ...state,
        accountBalanceTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE: {
      return {
        ...state,
        estimatedWithdrawFeeTask:
          state.estimatedWithdrawFeeTask.status === "successful"
            ? { status: "reloading", data: state.estimatedWithdrawFeeTask.data }
            : { status: "loading" },
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

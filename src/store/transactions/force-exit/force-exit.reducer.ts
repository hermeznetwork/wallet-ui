import {
  ForceExitAction,
  ForceExitActionTypes,
  Step,
  TransactionToReview,
} from "src/store/transactions/force-exit/force-exit.actions";
import { AsyncTask } from "src/utils/types";
import { getPaginationData, Pagination } from "src/utils/api";
// domain
import { HermezAccount, EstimatedL1Fee } from "src/domain";

export interface AccountsWithPagination {
  accounts: HermezAccount[];
  pagination: Pagination;
}

export interface ForceExitState {
  step: Step;
  accountsTask: AsyncTask<AccountsWithPagination, Error>;
  estimatedWithdrawFeeTask: AsyncTask<EstimatedL1Fee, Error>;
  account?: HermezAccount;
  transaction?: TransactionToReview;
  isTransactionBeingApproved: boolean;
}

const initialForceExitState: ForceExitState = {
  step: "choose-account",
  accountsTask: {
    status: "pending",
  },
  estimatedWithdrawFeeTask: {
    status: "pending",
  },
  account: undefined,
  transaction: undefined,
  isTransactionBeingApproved: false,
};

function forceExitReducer(
  state: ForceExitState = initialForceExitState,
  action: ForceExitAction
): ForceExitState {
  switch (action.type) {
    case ForceExitActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP: {
      return {
        ...state,
        step: "choose-account",
      };
    }
    case ForceExitActionTypes.GO_TO_BUILD_TRANSACTION_STEP: {
      return {
        ...state,
        step: "build-transaction",
        account: action.account || undefined,
      };
    }
    case ForceExitActionTypes.GO_TO_REVIEW_TRANSACTION_STEP: {
      return {
        ...state,
        step: "review-transaction",
        transaction: action.transaction,
      };
    }
    case ForceExitActionTypes.LOAD_ACCOUNTS: {
      return {
        ...state,
        accountsTask:
          state.accountsTask.status === "successful"
            ? {
                status: "reloading",
                data: state.accountsTask.data,
              }
            : { status: "loading" },
      };
    }
    case ForceExitActionTypes.LOAD_ACCOUNTS_SUCCESS: {
      const accounts =
        state.accountsTask.status === "reloading"
          ? [...state.accountsTask.data.accounts, ...action.accounts.accounts]
          : action.accounts.accounts;
      const pagination = getPaginationData(action.accounts.pendingItems, accounts);

      return {
        ...state,
        accountsTask: {
          status: "successful",
          data: { accounts, pagination },
        },
      };
    }
    case ForceExitActionTypes.LOAD_ACCOUNTS_FAILURE: {
      return {
        ...state,
        accountsTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case ForceExitActionTypes.START_TRANSACTION_APPROVAL: {
      return {
        ...state,
        isTransactionBeingApproved: true,
      };
    }
    case ForceExitActionTypes.STOP_TRANSACTION_APPROVAL: {
      return {
        ...state,
        isTransactionBeingApproved: false,
      };
    }
    case ForceExitActionTypes.RESET_STATE: {
      return initialForceExitState;
    }
    default: {
      return state;
    }
  }
}

export default forceExitReducer;

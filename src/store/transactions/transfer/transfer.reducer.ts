import {
  TransferActionTypes,
  TransferAction,
  TransactionToReview,
  Step,
} from "src/store/transactions/transfer/transfer.actions";
import { getPaginationData, Pagination } from "src/utils/api";
import { AsyncTask } from "src/utils/types";
// domain
import { PoolTransaction, HermezAccount, RecommendedFee } from "src/domain/hermez";

export interface AccountsWithPagination {
  accounts: HermezAccount[];
  pagination: Pagination;
}

export interface TransferState {
  step: Step;
  poolTransactionsTask: AsyncTask<PoolTransaction[], Error>;
  accountTask: AsyncTask<HermezAccount, string>;
  accountsTask: AsyncTask<AccountsWithPagination, Error>;
  feesTask: AsyncTask<RecommendedFee, Error>;
  hasReceiverApprovedAccountsCreation: undefined | boolean;
  transaction: TransactionToReview | undefined;
  isTransactionBeingApproved: boolean;
}

const initialTransferState: TransferState = {
  step: "load-account",
  poolTransactionsTask: {
    status: "pending",
  },
  accountTask: {
    status: "pending",
  },
  accountsTask: {
    status: "pending",
  },
  feesTask: {
    status: "pending",
  },
  hasReceiverApprovedAccountsCreation: undefined,
  transaction: undefined,
  isTransactionBeingApproved: false,
};

function transferReducer(
  state: TransferState = initialTransferState,
  action: TransferAction
): TransferState {
  switch (action.type) {
    case TransferActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP: {
      return {
        ...state,
        step: "choose-account",
      };
    }
    case TransferActionTypes.GO_TO_BUILD_TRANSACTION_STEP: {
      return {
        ...state,
        step: "build-transaction",
        accountTask: {
          status: "successful",
          data: action.account,
        },
      };
    }
    case TransferActionTypes.GO_TO_REVIEW_TRANSACTION_STEP: {
      return {
        ...state,
        step: "review-transaction",
        transaction: action.transaction,
      };
    }
    case TransferActionTypes.CHANGE_CURRENT_STEP: {
      return {
        ...state,
        step: action.nextStep,
      };
    }
    case TransferActionTypes.LOAD_POOL_TRANSACTIONS: {
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
    case TransferActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        poolTransactionsTask: {
          status: "successful",
          data: action.transactions,
        },
      };
    }
    case TransferActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        poolTransactionsTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case TransferActionTypes.LOAD_ACCOUNTS: {
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
    case TransferActionTypes.LOAD_ACCOUNTS_SUCCESS: {
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
    case TransferActionTypes.LOAD_ACCOUNTS_FAILURE: {
      return {
        ...state,
        accountsTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case TransferActionTypes.LOAD_ACCOUNT: {
      return {
        ...state,
        accountTask: {
          status: "loading",
        },
      };
    }
    case TransferActionTypes.LOAD_ACCOUNT_SUCCESS: {
      return {
        ...state,
        step: "build-transaction",
        accountTask: {
          status: "successful",
          data: action.account,
        },
      };
    }
    case TransferActionTypes.LOAD_ACCOUNT_FAILURE: {
      return {
        ...state,
        accountTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case TransferActionTypes.LOAD_FEES:
      return {
        ...state,
        feesTask: {
          status: "loading",
        },
      };
    case TransferActionTypes.LOAD_FEES_SUCCESS:
      return {
        ...state,
        feesTask: {
          status: "successful",
          data: action.fees,
        },
      };
    case TransferActionTypes.LOAD_FEES_FAILURE:
      return {
        ...state,
        feesTask: {
          status: "failed",
          error: action.error,
        },
      };
    case TransferActionTypes.SET_RECEIVER_ACCOUNTS_CREATION_AUTHORIZATION: {
      return {
        ...state,
        hasReceiverApprovedAccountsCreation: action.approval,
      };
    }
    case TransferActionTypes.START_TRANSACTION_APPROVAL: {
      return {
        ...state,
        isTransactionBeingApproved: true,
      };
    }
    case TransferActionTypes.STOP_TRANSACTION_APPROVAL: {
      return {
        ...state,
        isTransactionBeingApproved: false,
      };
    }
    case TransferActionTypes.RESET_STATE: {
      return initialTransferState;
    }
    default: {
      return state;
    }
  }
}

export default transferReducer;

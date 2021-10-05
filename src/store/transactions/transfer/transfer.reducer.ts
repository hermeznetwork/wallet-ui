import { getPaginationData, Pagination } from "src/utils/api";
import {
  TransactionTransferActionTypes,
  TransactionTransferAction,
  TransactionToReview,
  Step,
} from "src/store/transactions/transfer/transfer.actions";

import { AsyncTask } from "src/utils/types";
import { PooledTransaction, Account } from "src/domain/hermez";

export interface AccountsWithPagination {
  accounts: Account[];
  pagination: Pagination;
}

export interface TransactionTransferState {
  step: Step;
  pooledTransactionsTask: AsyncTask<PooledTransaction[], Error>;
  accountTask: AsyncTask<Account, string>;
  accountsTask: AsyncTask<AccountsWithPagination, Error>;
  accountBalanceTask: AsyncTask<unknown, Error>;
  feesTask: AsyncTask<unknown, Error>;
  transaction: TransactionToReview | undefined;
  isTransactionBeingApproval: boolean;
}

const initialTransactionState: TransactionTransferState = {
  step: "load-account",
  pooledTransactionsTask: {
    status: "pending",
  },
  accountTask: {
    status: "pending",
  },
  accountsTask: {
    status: "pending",
  },
  accountBalanceTask: {
    status: "pending",
  },
  feesTask: {
    status: "pending",
  },
  transaction: undefined,
  isTransactionBeingApproval: false,
};

function transactionReducer(
  state: TransactionTransferState = initialTransactionState,
  action: TransactionTransferAction
): TransactionTransferState {
  switch (action.type) {
    case TransactionTransferActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP: {
      return {
        ...state,
        step: "choose-account",
      };
    }
    case TransactionTransferActionTypes.GO_TO_BUILD_TRANSACTION_STEP: {
      return {
        ...state,
        step: "build-transaction",
        accountTask: {
          status: "successful",
          data: action.account,
        },
      };
    }
    case TransactionTransferActionTypes.GO_TO_REVIEW_TRANSACTION_STEP: {
      return {
        ...state,
        step: "review-transaction",
        transaction: action.transaction,
      };
    }
    case TransactionTransferActionTypes.CHANGE_CURRENT_STEP: {
      return {
        ...state,
        step: action.nextStep,
      };
    }
    case TransactionTransferActionTypes.LOAD_POOLED_TRANSACTIONS: {
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
    case TransactionTransferActionTypes.LOAD_POOLED_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        pooledTransactionsTask: {
          status: "successful",
          data: action.transactions,
        },
      };
    }
    case TransactionTransferActionTypes.LOAD_POOLED_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        pooledTransactionsTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case TransactionTransferActionTypes.LOAD_ACCOUNTS: {
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
    case TransactionTransferActionTypes.LOAD_ACCOUNTS_SUCCESS: {
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
    case TransactionTransferActionTypes.LOAD_ACCOUNTS_FAILURE: {
      return {
        ...state,
        accountsTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case TransactionTransferActionTypes.LOAD_ACCOUNT: {
      return {
        ...state,
        accountTask: {
          status: "loading",
        },
      };
    }
    case TransactionTransferActionTypes.LOAD_ACCOUNT_SUCCESS: {
      return {
        ...state,
        step: "build-transaction",
        accountTask: {
          status: "successful",
          data: action.account,
        },
      };
    }
    case TransactionTransferActionTypes.LOAD_ACCOUNT_FAILURE: {
      return {
        ...state,
        accountTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case TransactionTransferActionTypes.LOAD_ACCOUNT_BALANCE: {
      return {
        ...state,
        accountBalanceTask: {
          status: "loading",
        },
      };
    }
    case TransactionTransferActionTypes.LOAD_ACCOUNT_BALANCE_SUCCESS: {
      return {
        ...state,
        accountBalanceTask: {
          status: "successful",
          data: action.accountBalance,
        },
      };
    }
    case TransactionTransferActionTypes.LOAD_ACCOUNT_BALANCE_FAILURE: {
      return {
        ...state,
        accountBalanceTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case TransactionTransferActionTypes.LOAD_FEES:
      return {
        ...state,
        feesTask: {
          status: "loading",
        },
      };
    case TransactionTransferActionTypes.LOAD_FEES_SUCCESS:
      return {
        ...state,
        feesTask: {
          status: "successful",
          data: action.fees,
        },
      };
    case TransactionTransferActionTypes.LOAD_FEES_FAILURE:
      return {
        ...state,
        feesTask: {
          status: "failed",
          error: action.error,
        },
      };
    case TransactionTransferActionTypes.START_TRANSACTION_APPROVAL: {
      return {
        ...state,
        isTransactionBeingApproval: true,
      };
    }
    case TransactionTransferActionTypes.STOP_TRANSACTION_APPROVAL: {
      return {
        ...state,
        isTransactionBeingApproval: false,
      };
    }
    case TransactionTransferActionTypes.RESET_STATE: {
      return initialTransactionState;
    }
    default: {
      return state;
    }
  }
}

export default transactionReducer;

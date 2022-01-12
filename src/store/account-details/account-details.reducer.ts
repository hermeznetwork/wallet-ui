import { Pagination } from "src/utils/api";
// domain
import { Exits, HermezAccount, HistoryTransaction, PoolTransaction } from "src/domain";
import {
  AccountDetailsActionTypes,
  AccountDetailsAction,
} from "src/store/account-details/account-details.actions";
import { getPaginationData } from "src/utils/api";
import { AsyncTask } from "src/utils/types";

interface ViewHistoryTransactions {
  transactions: HistoryTransaction[];
  fromItemHistory: number[];
  pagination: Pagination;
}

export interface AccountDetailsState {
  accountTask: AsyncTask<HermezAccount, string>;
  exitsTask: AsyncTask<Exits, Error>;
  historyTransactionsTask: AsyncTask<ViewHistoryTransactions, string>;
  l1TokenBalanceTask: AsyncTask<null, string>;
  poolTransactionsTask: AsyncTask<PoolTransaction[], string>;
}

const initialAccountDetailsState: AccountDetailsState = {
  accountTask: {
    status: "pending",
  },
  l1TokenBalanceTask: {
    status: "pending",
  },
  poolTransactionsTask: {
    status: "pending",
  },
  historyTransactionsTask: {
    status: "pending",
  },
  exitsTask: {
    status: "pending",
  },
};

function accountDetailsReducer(
  state: AccountDetailsState = initialAccountDetailsState,
  action: AccountDetailsAction
): AccountDetailsState {
  switch (action.type) {
    case AccountDetailsActionTypes.LOAD_ACCOUNT: {
      return {
        ...state,
        accountTask:
          state.accountTask.status === "successful"
            ? { status: "reloading", data: state.accountTask.data }
            : { status: "loading" },
      };
    }
    case AccountDetailsActionTypes.LOAD_ACCOUNT_SUCCESS: {
      return {
        ...state,
        accountTask: {
          status: "successful",
          data: action.account,
        },
      };
    }
    case AccountDetailsActionTypes.LOAD_ACCOUNT_FAILURE: {
      return {
        ...state,
        accountTask: {
          status: "failed",
          error: "An error ocurred loading the account",
        },
      };
    }
    case AccountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE: {
      return {
        ...state,
        l1TokenBalanceTask: {
          status: "loading",
        },
      };
    }
    case AccountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE_SUCCESS: {
      return {
        ...state,
        l1TokenBalanceTask: {
          status: "successful",
          data: null,
        },
      };
    }
    case AccountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE_FAILURE: {
      return {
        ...state,
        l1TokenBalanceTask: {
          status: "failed",
          error: "An error occurred loading the L1 Token Balance",
        },
      };
    }
    case AccountDetailsActionTypes.LOAD_POOL_TRANSACTIONS: {
      return {
        ...state,
        poolTransactionsTask:
          state.poolTransactionsTask.status === "successful"
            ? { status: "reloading", data: state.poolTransactionsTask.data }
            : { status: "loading" },
      };
    }
    case AccountDetailsActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        poolTransactionsTask: {
          status: "successful",
          data: action.transactions,
        },
      };
    }
    case AccountDetailsActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        poolTransactionsTask: {
          status: "failed",
          error: "An error ocurred loading the transactions from the pool",
        },
      };
    }
    case AccountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS: {
      if (state.historyTransactionsTask.status === "reloading") {
        return state;
      }

      return {
        ...state,
        historyTransactionsTask:
          state.historyTransactionsTask.status === "successful"
            ? { status: "reloading", data: state.historyTransactionsTask.data }
            : { status: "loading" },
      };
    }
    case AccountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS_SUCCESS: {
      const transactions =
        state.historyTransactionsTask.status === "reloading"
          ? [...state.historyTransactionsTask.data.transactions, ...action.data.transactions]
          : action.data.transactions;
      const pagination = getPaginationData(action.data.pendingItems, transactions, "DESC");
      const fromItemHistory =
        state.historyTransactionsTask.status === "reloading" &&
        state.historyTransactionsTask.data.pagination.hasMoreItems
          ? [
              ...state.historyTransactionsTask.data.fromItemHistory,
              state.historyTransactionsTask.data.pagination.fromItem,
            ]
          : [];

      return {
        ...state,
        historyTransactionsTask: {
          status: "successful",
          data: { transactions, pagination, fromItemHistory },
        },
      };
    }
    case AccountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        historyTransactionsTask: {
          status: "failed",
          error: "An error ocurred loading the transactions from the history",
        },
      };
    }
    case AccountDetailsActionTypes.REFRESH_HISTORY_TRANSACTIONS: {
      return {
        ...state,
        historyTransactionsTask:
          state.historyTransactionsTask.status === "successful"
            ? {
                ...state.historyTransactionsTask,
                status: "reloading",
              }
            : {
                ...state.historyTransactionsTask,
                status: "loading",
              },
      };
    }
    case AccountDetailsActionTypes.REFRESH_HISTORY_TRANSACTIONS_SUCCESS: {
      if (
        state.historyTransactionsTask.status !== "reloading" &&
        state.historyTransactionsTask.status !== "successful"
      ) {
        return state;
      }
      const pagination = getPaginationData(
        action.historyTransactions.pendingItems,
        action.historyTransactions.transactions,
        "DESC"
      );
      return {
        ...state,
        historyTransactionsTask: {
          status: "successful",
          data: {
            ...state.historyTransactionsTask.data,
            transactions: action.historyTransactions.transactions,
            pagination,
          },
        },
      };
    }
    case AccountDetailsActionTypes.LOAD_EXITS: {
      return {
        ...state,
        exitsTask:
          state.exitsTask.status === "successful"
            ? { status: "reloading", data: state.exitsTask.data }
            : { status: "loading" },
      };
    }
    case AccountDetailsActionTypes.LOAD_EXITS_SUCCESS: {
      return {
        ...state,
        exitsTask: {
          status: "successful",
          data: action.exits,
        },
      };
    }
    case AccountDetailsActionTypes.LOAD_EXITS_FAILURE: {
      return {
        ...state,
        exitsTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case AccountDetailsActionTypes.RESET_STATE: {
      return initialAccountDetailsState;
    }
    default: {
      return state;
    }
  }
}

export default accountDetailsReducer;

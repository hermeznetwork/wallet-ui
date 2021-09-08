import { PaginationOrder } from "@hermeznetwork/hermezjs/src/api";
import { Pagination } from "src/utils/api";

// domain
import { Account, L2Transaction } from "src/domain/hermez";

// persistence
import { Exits } from "src/persistence";

import { AccountDetailsActionTypes, AccountDetailsAction } from "./account-details.actions";
import { getPaginationData } from "src/utils/api";
import { AsyncTask } from "src/utils/types";

interface ViewHistoryTransactions {
  transactions: L2Transaction[];
  fromItemHistory: number[];
  pagination: Pagination;
}

export interface AccountDetailsState {
  accountTask: AsyncTask<Account, string>;
  exitsTask: AsyncTask<Exits, string>;
  historyTransactionsTask: AsyncTask<ViewHistoryTransactions, string>;
  l1TokenBalanceTask: AsyncTask<null, string>;
  poolTransactionsTask: AsyncTask<L2Transaction[], string>;
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

function accountDetailsReducer(state = initialAccountDetailsState, action: AccountDetailsAction) {
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
        },
      };
    }
    case AccountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE_FAILURE: {
      return {
        ...state,
        l1TokenBalanceTask: {
          status: "failed",
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
        state.historyTransactionsTask.status === "reloading"
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
        historyTransactionsTask: {
          ...state.historyTransactionsTask,
          status: "reloading",
        },
      };
    }
    case AccountDetailsActionTypes.REFRESH_HISTORY_TRANSACTIONS_SUCCESS: {
      if (state.historyTransactionsTask.status !== "successful") {
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

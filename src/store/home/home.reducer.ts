import { HomeActionTypes, HomeAction } from "src/store/home/home.actions";
import { getPaginationData } from "src/utils/api";
import { PaginationOrder } from "@hermeznetwork/hermezjs/src/api";
import { Pagination } from "src/utils/api"

// domain
import { Account, L2Transaction } from "src/domain/hermez";

// persistence
import { Exits } from "src/persistence";

import { AsyncTask } from "src/utils/async-task";

interface ViewAccounts {
  accounts: Account[];
  fromItemHistory: number[];
  pagination: Pagination;
}

export interface HomeState {
  totalBalanceTask: AsyncTask<number, string>;
  accountsTask: AsyncTask<ViewAccounts, string>;
  poolTransactionsTask: AsyncTask<L2Transaction[], string>;
  exitsTask: AsyncTask<Exits, string>;
}

const initialHomeState: HomeState = {
  totalBalanceTask: {
    status: "pending",
  },
  accountsTask: {
    status: "pending",
  },
  poolTransactionsTask: {
    status: "pending",
  },
  exitsTask: {
    status: "pending",
  },
};

function homeReducer(state = initialHomeState, action: HomeAction) {
  switch (action.type) {
    case HomeActionTypes.LOAD_TOTAL_BALANCE: {
      const totalBalanceTask =
        state.totalBalanceTask.status === "successful"
          ? { status: "reloading", data: state.totalBalanceTask.data }
          : { status: "loading" };

      return {
        ...state,
        totalBalanceTask,
      };
    }
    case HomeActionTypes.LOAD_TOTAL_BALANCE_SUCCESS: {
      return {
        ...state,
        totalBalanceTask: {
          status: "successful",
          data: action.balance,
        },
      };
    }
    case HomeActionTypes.LOAD_TOTAL_BALANCE_FAILURE: {
      return {
        ...state,
        totalBalanceTask: {
          status: "failed",
          error: "An error ocurred loading the total balance of the accounts",
        },
      };
    }
    case HomeActionTypes.LOAD_ACCOUNTS: {
      if (state.accountsTask.status === "reloading") {
        return state;
      }

      return {
        ...state,
        accountsTask:
          state.accountsTask.status === "successful"
            ? { status: "reloading", data: state.accountsTask.data }
            : { status: "loading" },
      };
    }
    case HomeActionTypes.LOAD_ACCOUNTS_SUCCESS: {
      const accounts =
        state.accountsTask.status === "reloading"
          ? [...state.accountsTask.data.accounts, ...action.accounts.accounts]
          : action.accounts.accounts;
      const pagination = getPaginationData(action.accounts.pendingItems, accounts);
      const fromItemHistory =
        state.accountsTask.status === "reloading"
          ? [
              ...state.accountsTask.data.fromItemHistory,
              state.accountsTask.data.pagination.fromItem,
            ]
          : [];

      return {
        ...state,
        accountsTask: {
          status: "successful",
          data: { accounts, pagination, fromItemHistory },
        },
      };
    }
    case HomeActionTypes.LOAD_ACCOUNTS_FAILURE: {
      return {
        ...state,
        accountsTask: {
          status: "failed",
          error: "An error ocurred loading the accounts",
        },
      };
    }
    case HomeActionTypes.REFRESH_ACCOUNTS: {
      return {
        ...state,
        accountsTask: {
          ...state.accountsTask,
          status: "reloading",
        },
      };
    }
    case HomeActionTypes.REFRESH_ACCOUNTS_SUCCESS: {
      const pagination = getPaginationData(
        action.accounts.pendingItems,
        action.accounts.accounts,
        PaginationOrder.DESC
      );

      return {
        ...state,
        accountsTask: {
          status: "successful",
          data: {
            accounts: action.accounts.accounts,
            pagination,
            fromItemHistory: [],
          },
        },
      };
    }
    case HomeActionTypes.LOAD_POOL_TRANSACTIONS: {
      return {
        ...state,
        poolTransactionsTask:
          state.poolTransactionsTask.status === "pending" ||
          state.poolTransactionsTask.status === "failed"
            ? { status: "loading" }
            : { ...state.poolTransactionsTask, status: "reloading" },
      };
    }
    case HomeActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        poolTransactionsTask: {
          status: "successful",
          data: action.transactions,
        },
      };
    }
    case HomeActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        poolTransactionsTask: {
          status: "failed",
          error: "An error ocurred loading the transactions from the pool",
        },
      };
    }
    case HomeActionTypes.LOAD_EXITS: {
      return {
        ...state,
        exitsTask:
          state.exitsTask.status === "pending" ||
          state.exitsTask.status === "failed"
            ? { status: "loading" }
            : { ...state.exitsTask, status: "reloading" },
      };
    }
    case HomeActionTypes.LOAD_EXITS_SUCCESS: {
      return {
        ...state,
        exitsTask: {
          status: "successful",
          data: action.exits,
        },
      };
    }
    case HomeActionTypes.LOAD_EXITS_FAILURE: {
      return {
        ...state,
        exitsTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case HomeActionTypes.RESET_STATE: {
      return { ...initialHomeState };
    }
    default: {
      return state;
    }
  }
}

export default homeReducer;

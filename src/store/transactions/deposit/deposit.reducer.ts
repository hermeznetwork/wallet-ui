import {
  DepositActionTypes,
  DepositAction,
  TransactionToReview,
  Step,
} from "src/store/transactions/deposit/deposit.actions";
import { AsyncTask } from "src/utils/types";
// domain
import { EstimatedDepositFee } from "src/domain";
import { PoolTransaction, RecommendedFee, EthereumAccount } from "src/domain/hermez";

export interface DepositState {
  step: Step;
  poolTransactionsTask: AsyncTask<PoolTransaction[], Error>;
  ethereumAccountTask: AsyncTask<EthereumAccount, string>;
  ethereumAccountsTask: AsyncTask<EthereumAccount[], Error>;
  feesTask: AsyncTask<RecommendedFee, Error>;
  estimatedDepositFeeTask: AsyncTask<EstimatedDepositFee, Error>;
  transaction: TransactionToReview | undefined;
  isTransactionBeingApproved: boolean;
}

const initialDepositState: DepositState = {
  step: "load-account",
  poolTransactionsTask: {
    status: "pending",
  },
  ethereumAccountTask: {
    status: "pending",
  },
  ethereumAccountsTask: {
    status: "pending",
  },
  feesTask: {
    status: "pending",
  },
  estimatedDepositFeeTask: {
    status: "pending",
  },
  transaction: undefined,
  isTransactionBeingApproved: false,
};

function transactionReducer(
  state: DepositState = initialDepositState,
  action: DepositAction
): DepositState {
  switch (action.type) {
    case DepositActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP: {
      return {
        ...state,
        step: "choose-account",
      };
    }
    case DepositActionTypes.GO_TO_BUILD_TRANSACTION_STEP: {
      return {
        ...state,
        step: "build-transaction",
        ethereumAccountTask: {
          status: "successful",
          data: action.ethereumAccount,
        },
      };
    }
    case DepositActionTypes.GO_TO_REVIEW_TRANSACTION_STEP: {
      return {
        ...state,
        step: "review-transaction",
        transaction: action.transaction,
      };
    }
    case DepositActionTypes.CHANGE_CURRENT_STEP: {
      return {
        ...state,
        step: action.nextStep,
      };
    }
    case DepositActionTypes.LOAD_ACCOUNTS: {
      return {
        ...state,
        ethereumAccountsTask:
          state.ethereumAccountsTask.status === "successful"
            ? {
                status: "reloading",
                data: state.ethereumAccountsTask.data,
              }
            : { status: "loading" },
      };
    }
    case DepositActionTypes.LOAD_ACCOUNTS_SUCCESS: {
      return {
        ...state,
        ethereumAccountsTask: {
          status: "successful",
          data: action.ethereumAccounts,
        },
      };
    }
    case DepositActionTypes.LOAD_ACCOUNTS_FAILURE: {
      return {
        ...state,
        ethereumAccountsTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case DepositActionTypes.LOAD_POOL_TRANSACTIONS: {
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
    case DepositActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        poolTransactionsTask: {
          status: "successful",
          data: action.transactions,
        },
      };
    }
    case DepositActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        poolTransactionsTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case DepositActionTypes.LOAD_ETHEREUM_ACCOUNT: {
      return {
        ...state,
        ethereumAccountTask: {
          status: "loading",
        },
      };
    }
    case DepositActionTypes.LOAD_ETHEREUM_ACCOUNT_SUCCESS: {
      return {
        ...state,
        step: "build-transaction",
        ethereumAccountTask: {
          status: "successful",
          data: action.ethereumAccount,
        },
      };
    }
    case DepositActionTypes.LOAD_ETHEREUM_ACCOUNT_FAILURE: {
      return {
        ...state,
        ethereumAccountTask: {
          status: "failed",
          error: action.error,
        },
      };
    }

    case DepositActionTypes.LOAD_FEES:
      return {
        ...state,
        feesTask: {
          status: "loading",
        },
      };
    case DepositActionTypes.LOAD_FEES_SUCCESS:
      return {
        ...state,
        feesTask: {
          status: "successful",
          data: action.fees,
        },
      };
    case DepositActionTypes.LOAD_FEES_FAILURE:
      return {
        ...state,
        feesTask: {
          status: "failed",
          error: action.error,
        },
      };
    case DepositActionTypes.LOAD_ESTIMATED_DEPOSIT_FEE: {
      return {
        ...state,
        estimatedDepositFeeTask: {
          status: "loading",
        },
      };
    }
    case DepositActionTypes.LOAD_ESTIMATED_DEPOSIT_FEE_SUCCESS: {
      return {
        ...state,
        estimatedDepositFeeTask: {
          status: "successful",
          data: action.estimatedFee,
        },
      };
    }
    case DepositActionTypes.LOAD_ESTIMATED_DEPOSIT_FEE_FAILURE: {
      return {
        ...state,
        estimatedDepositFeeTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case DepositActionTypes.START_TRANSACTION_APPROVAL: {
      return {
        ...state,
        isTransactionBeingApproved: true,
      };
    }
    case DepositActionTypes.STOP_TRANSACTION_APPROVAL: {
      return {
        ...state,
        isTransactionBeingApproved: false,
      };
    }
    case DepositActionTypes.RESET_STATE: {
      return initialDepositState;
    }
    default: {
      return state;
    }
  }
}

export default transactionReducer;

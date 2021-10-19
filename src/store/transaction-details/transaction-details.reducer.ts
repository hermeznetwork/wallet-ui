import {
  TransactionDetailsActionTypes,
  TransactionDetailsAction,
} from "src/store/transaction-details/transaction-details.actions";
import { AsyncTask } from "src/utils/types";
// domain
import { PendingDeposit, HistoryTransaction, PoolTransaction } from "src/domain/hermez";

export interface TransactionDetailsState {
  transactionTask: AsyncTask<PendingDeposit | HistoryTransaction | PoolTransaction, string>;
}

const initialTransactionDetailsReducer: TransactionDetailsState = {
  transactionTask: {
    status: "pending",
  },
};

function transactionDetailsReducer(
  state: TransactionDetailsState = initialTransactionDetailsReducer,
  action: TransactionDetailsAction
): TransactionDetailsState {
  switch (action.type) {
    case TransactionDetailsActionTypes.LOAD_TRANSACTION: {
      return {
        ...state,
        transactionTask: {
          status: "loading",
        },
      };
    }
    case TransactionDetailsActionTypes.LOAD_TRANSACTION_SUCCESS: {
      return {
        ...state,
        transactionTask: {
          status: "successful",
          data: action.transaction,
        },
      };
    }
    case TransactionDetailsActionTypes.LOAD_TRANSACTION_FAILURE: {
      return {
        ...state,
        transactionTask: {
          status: "failed",
          error: "An error ocurred loading the transaction",
        },
      };
    }
    default: {
      return state;
    }
  }
}

export default transactionDetailsReducer;

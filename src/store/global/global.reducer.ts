import { AppAction } from "src/store";
import { GlobalActionTypes, GlobalAction } from "src/store/global/global.actions";
import { AsyncTask } from "src/utils/types";
// domain
import {
  CoordinatorState,
  EthereumNetwork,
  FiatExchangeRates,
  HermezStatus,
  HermezWallet,
  Message,
  NetworkStatus,
  PendingDelayedWithdraws,
  PendingDeposits,
  PendingWithdraw,
  PendingWithdraws,
  PoolTransaction,
  Signers,
  TimerWithdraw,
  TimerWithdraws,
  Token,
} from "src/domain";
// adapters
import * as localStoragePersistence from "src/adapters/local-storage";

interface PageHeader {
  type: "page";
  data: {
    title: string;
    subtitle?: string;
    goBackAction?: AppAction;
    closeAction?: AppAction;
  };
}

export type HeaderState =
  | {
      type: undefined;
    }
  | {
      type: "main";
    }
  | PageHeader;

export type SnackbarState =
  | {
      status: "closed";
    }
  | {
      status: "open";
      message: Message;
    };

export interface GlobalState {
  hermezStatusTask: AsyncTask<HermezStatus, string>;
  ethereumNetworkTask: AsyncTask<EthereumNetwork, string>;
  poolTransactionsTask: AsyncTask<PoolTransaction[], string>;
  wallet: HermezWallet.HermezWallet | undefined;
  signer: Signers.SignerData | undefined;
  header: HeaderState;
  redirectRoute: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
  snackbar: SnackbarState;
  networkStatus: NetworkStatus;
  pendingWithdraws: PendingWithdraws;
  pendingDelayedWithdraws: PendingDelayedWithdraws;
  timerWithdraws: TimerWithdraws;
  pendingDelayedWithdrawCheckTask: AsyncTask<null, string>;
  pendingWithdrawalsCheckTask: AsyncTask<null, string>;
  pendingDeposits: PendingDeposits;
  pendingDepositsCheckTask: AsyncTask<null, string>;
  coordinatorStateTask: AsyncTask<CoordinatorState, string>;
  tokensPriceTask: AsyncTask<Token[], string>;
}

function getInitialGlobalState(): GlobalState {
  return {
    hermezStatusTask: {
      status: "pending",
    },
    ethereumNetworkTask: {
      status: "pending",
    },
    poolTransactionsTask: {
      status: "pending",
    },
    wallet: undefined,
    signer: undefined,
    header: {
      type: undefined,
    },
    redirectRoute: "/",
    fiatExchangeRatesTask: {
      status: "pending",
    },
    snackbar: {
      status: "closed",
    },
    networkStatus: "online",
    pendingWithdraws: localStoragePersistence.getPendingWithdraws(),
    pendingDelayedWithdraws: localStoragePersistence.getPendingDelayedWithdraws(),
    timerWithdraws: localStoragePersistence.getTimerWithdraws(),
    pendingDelayedWithdrawCheckTask: {
      status: "pending",
    },
    pendingWithdrawalsCheckTask: {
      status: "pending",
    },
    pendingDeposits: localStoragePersistence.getPendingDeposits(),
    pendingDepositsCheckTask: {
      status: "pending",
    },
    coordinatorStateTask: {
      status: "pending",
    },
    tokensPriceTask: {
      status: "pending",
    },
  };
}

function globalReducer(
  state: GlobalState = getInitialGlobalState(),
  action: GlobalAction
): GlobalState {
  switch (action.type) {
    case GlobalActionTypes.LOAD_HERMEZ_STATUS: {
      return {
        ...state,
        hermezStatusTask: {
          status: "loading",
        },
      };
    }
    case GlobalActionTypes.LOAD_HERMEZ_STATUS_SUCCESS: {
      return {
        ...state,
        hermezStatusTask: {
          status: "successful",
          data: { isUnderMaintenance: Boolean(action.status) },
        },
      };
    }
    case GlobalActionTypes.LOAD_HERMEZ_STATUS_FAILURE: {
      return {
        ...state,
        hermezStatusTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case GlobalActionTypes.LOAD_ETHEREUM_NETWORK: {
      return {
        ...state,
        ethereumNetworkTask: {
          status: "loading",
        },
      };
    }
    case GlobalActionTypes.LOAD_ETHEREUM_NETWORK_SUCCESS: {
      return {
        ...state,
        ethereumNetworkTask: {
          status: "successful",
          data: action.ethereumNetwork,
        },
      };
    }
    case GlobalActionTypes.LOAD_POOL_TRANSACTIONS: {
      return {
        ...state,
        poolTransactionsTask:
          state.poolTransactionsTask.status === "successful"
            ? { status: "reloading", data: state.poolTransactionsTask.data }
            : { status: "loading" },
      };
    }
    case GlobalActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        poolTransactionsTask: {
          status: "successful",
          data: action.transactions,
        },
      };
    }
    case GlobalActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        poolTransactionsTask: {
          status: "failed",
          error: "An error ocurred loading the transactions from the pool",
        },
      };
    }
    case GlobalActionTypes.LOAD_WALLET:
      return {
        ...state,
        wallet: action.wallet,
      };
    case GlobalActionTypes.UNLOAD_WALLET: {
      return {
        ...state,
        wallet: undefined,
      };
    }
    case GlobalActionTypes.SET_SIGNER: {
      return {
        ...state,
        signer: action.signer,
      };
    }
    case GlobalActionTypes.CHANGE_HEADER: {
      return {
        ...state,
        header: action.header,
      };
    }
    case GlobalActionTypes.CHANGE_REDIRECT_ROUTE: {
      return {
        ...state,
        redirectRoute: action.redirectRoute,
      };
    }
    case GlobalActionTypes.LOAD_FIAT_EXCHANGE_RATES: {
      return {
        ...state,
        fiatExchangeRatesTask: {
          status: "loading",
        },
      };
    }
    case GlobalActionTypes.LOAD_FIAT_EXCHANGE_RATES_SUCCESS: {
      return {
        ...state,
        fiatExchangeRatesTask: {
          status: "successful",
          data: action.fiatExchangeRates,
        },
      };
    }
    case GlobalActionTypes.LOAD_FIAT_EXCHANGE_RATES_FAILURE: {
      return {
        ...state,
        fiatExchangeRatesTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case GlobalActionTypes.OPEN_SNACKBAR: {
      return {
        ...state,
        snackbar: {
          status: "open",
          message: action.message,
        },
      };
    }
    case GlobalActionTypes.CLOSE_SNACKBAR: {
      return {
        ...state,
        snackbar: {
          status: "closed",
        },
      };
    }
    case GlobalActionTypes.CHANGE_NETWORK_STATUS: {
      return {
        ...state,
        networkStatus: action.networkStatus,
      };
    }
    case GlobalActionTypes.ADD_PENDING_WITHDRAW: {
      const chainIdPendingWithdraws = state.pendingWithdraws[action.chainId] || {};
      const accountPendingWithdraws = chainIdPendingWithdraws[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingWithdraws: {
          ...state.pendingWithdraws,
          [action.chainId]: {
            ...chainIdPendingWithdraws,
            [action.hermezEthereumAddress]: [...accountPendingWithdraws, action.pendingWithdraw],
          },
        },
      };
    }
    case GlobalActionTypes.REMOVE_PENDING_WITHDRAW: {
      const chainIdPendingWithdraws = state.pendingWithdraws[action.chainId] || {};
      const accountPendingWithdraws = chainIdPendingWithdraws[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingWithdraws: {
          ...state.pendingWithdraws,
          [action.chainId]: {
            ...chainIdPendingWithdraws,
            [action.hermezEthereumAddress]: accountPendingWithdraws.filter(
              (withdraw: PendingWithdraw) => withdraw.hash !== action.hash
            ),
          },
        },
      };
    }
    case GlobalActionTypes.ADD_PENDING_DELAYED_WITHDRAW: {
      const chainIdPendingDelayedWithdraws = state.pendingDelayedWithdraws[action.chainId] || {};
      const accountPendingDelayedWithdraws =
        chainIdPendingDelayedWithdraws[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingDelayedWithdraws: {
          ...state.pendingDelayedWithdraws,
          [action.chainId]: {
            ...chainIdPendingDelayedWithdraws,
            [action.hermezEthereumAddress]: [
              ...accountPendingDelayedWithdraws,
              action.pendingDelayedWithdraw,
            ],
          },
        },
      };
    }
    case GlobalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW: {
      const chainIdPendingDelayedWithdraws = state.pendingDelayedWithdraws[action.chainId] || {};
      const accountPendingDelayedWithdraws =
        chainIdPendingDelayedWithdraws[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingDelayedWithdraws: {
          ...state.pendingDelayedWithdraws,
          [action.chainId]: {
            ...chainIdPendingDelayedWithdraws,
            [action.hermezEthereumAddress]: accountPendingDelayedWithdraws.filter(
              (withdraw: PendingWithdraw) => withdraw.id !== action.pendingDelayedWithdrawId
            ),
          },
        },
      };
    }
    case GlobalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW_BY_HASH: {
      const chainIdPendingDelayedWithdraws = state.pendingDelayedWithdraws[action.chainId] || {};
      const accountPendingDelayedWithdraws =
        chainIdPendingDelayedWithdraws[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingDelayedWithdraws: {
          ...state.pendingDelayedWithdraws,
          [action.chainId]: {
            ...chainIdPendingDelayedWithdraws,
            [action.hermezEthereumAddress]: accountPendingDelayedWithdraws.filter(
              (withdraw: PendingWithdraw) => withdraw.hash !== action.pendingDelayedWithdrawHash
            ),
          },
        },
      };
    }
    case GlobalActionTypes.UPDATE_PENDING_DELAYED_WITHDRAW_DATE: {
      const chainIdPendingDelayedWithdraws = state.pendingDelayedWithdraws[action.chainId] || {};
      const accountPendingDelayedWithdraws =
        chainIdPendingDelayedWithdraws[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingDelayedWithdraws: {
          ...state.pendingDelayedWithdraws,
          [action.chainId]: {
            ...chainIdPendingDelayedWithdraws,
            [action.hermezEthereumAddress]: accountPendingDelayedWithdraws.map(
              (delayedWithdraw) => {
                if (delayedWithdraw.hash === action.transactionHash) {
                  return { ...delayedWithdraw, date: action.transactionDate };
                }
                return delayedWithdraw;
              }
            ),
          },
        },
      };
    }
    case GlobalActionTypes.CHECK_PENDING_DELAYED_WITHDRAWALS: {
      return {
        ...state,
        pendingDelayedWithdrawCheckTask: {
          status: "loading",
        },
      };
    }
    case GlobalActionTypes.CHECK_PENDING_DELAYED_WITHDRAWALS_SUCCESS: {
      return {
        ...state,
        pendingDelayedWithdrawCheckTask: {
          status: "successful",
          data: null,
        },
      };
    }
    case GlobalActionTypes.ADD_TIMER_WITHDRAW: {
      const chainIdTimerWithdraws = state.timerWithdraws[action.chainId] || {};
      const accountTimerWithdraws = chainIdTimerWithdraws[action.hermezEthereumAddress] || [];

      return {
        ...state,
        timerWithdraws: {
          ...state.timerWithdraws,
          [action.chainId]: {
            ...chainIdTimerWithdraws,
            [action.hermezEthereumAddress]: [...accountTimerWithdraws, action.timerWithdraw],
          },
        },
      };
    }
    case GlobalActionTypes.REMOVE_TIMER_WITHDRAW: {
      const chainIdTimerWithdraws = state.timerWithdraws[action.chainId] || {};
      const accountTimerWithdraws = chainIdTimerWithdraws[action.hermezEthereumAddress] || [];
      return {
        ...state,
        timerWithdraws: {
          ...state.timerWithdraws,
          [action.chainId]: {
            ...chainIdTimerWithdraws,
            [action.hermezEthereumAddress]: accountTimerWithdraws.filter(
              (withdraw: TimerWithdraw) => withdraw.id !== action.timerWithdrawId
            ),
          },
        },
      };
    }
    case GlobalActionTypes.CHECK_PENDING_WITHDRAWALS: {
      return {
        ...state,
        pendingWithdrawalsCheckTask: {
          status: "loading",
        },
      };
    }
    case GlobalActionTypes.CHECK_PENDING_WITHDRAWALS_SUCCESS: {
      return {
        ...state,
        pendingWithdrawalsCheckTask: {
          status: "successful",
          data: null,
        },
      };
    }
    case GlobalActionTypes.ADD_PENDING_DEPOSIT: {
      const chainIdPendingDeposits = state.pendingDeposits[action.chainId] || {};
      const accountPendingDeposits = chainIdPendingDeposits[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [action.chainId]: {
            ...chainIdPendingDeposits,
            [action.hermezEthereumAddress]: [...accountPendingDeposits, action.pendingDeposit],
          },
        },
      };
    }
    case GlobalActionTypes.REMOVE_PENDING_DEPOSIT_BY_HASH: {
      const chainIdPendingDeposits = state.pendingDeposits[action.chainId] || {};
      const accountPendingDeposits = chainIdPendingDeposits[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [action.chainId]: {
            ...chainIdPendingDeposits,
            [action.hermezEthereumAddress]: accountPendingDeposits.filter(
              (deposit) => deposit.hash !== action.hash
            ),
          },
        },
      };
    }
    case GlobalActionTypes.REMOVE_PENDING_DEPOSIT_BY_TRANSACTION_ID: {
      const chainIdPendingDeposits = state.pendingDeposits[action.chainId] || {};
      const accountPendingDeposits = chainIdPendingDeposits[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [action.chainId]: {
            ...chainIdPendingDeposits,
            [action.hermezEthereumAddress]: accountPendingDeposits.filter(
              (deposit) => deposit.transactionId && deposit.transactionId !== action.transactionId
            ),
          },
        },
      };
    }
    case GlobalActionTypes.UPDATE_PENDING_DEPOSIT_ID: {
      const chainIdPendingDeposits = state.pendingDeposits[action.chainId] || {};
      const accountPendingDeposits = chainIdPendingDeposits[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [action.chainId]: {
            ...chainIdPendingDeposits,
            [action.hermezEthereumAddress]: accountPendingDeposits.map((deposit) => {
              if (deposit.hash === action.transactionHash) {
                return { ...deposit, id: action.transactionId };
              }
              return deposit;
            }),
          },
        },
      };
    }
    case GlobalActionTypes.CHECK_PENDING_DEPOSITS: {
      return {
        ...state,
        pendingDepositsCheckTask: {
          status: "loading",
        },
      };
    }
    case GlobalActionTypes.CHECK_PENDING_DEPOSITS_SUCCESS: {
      return {
        ...state,
        pendingDepositsCheckTask: {
          status: "successful",
          data: null,
        },
      };
    }
    case GlobalActionTypes.LOAD_COORDINATOR_STATE: {
      if (state.coordinatorStateTask.status === "reloading") {
        return state;
      }

      return {
        ...state,
        coordinatorStateTask:
          state.coordinatorStateTask.status === "successful"
            ? { status: "reloading", data: state.coordinatorStateTask.data }
            : { status: "loading" },
      };
    }
    case GlobalActionTypes.LOAD_COORDINATOR_STATE_SUCCESS: {
      return {
        ...state,
        coordinatorStateTask: {
          status: "successful",
          data: action.coordinatorState,
        },
      };
    }
    case GlobalActionTypes.LOAD_COORDINATOR_STATE_FAILURE: {
      return {
        ...state,
        coordinatorStateTask: {
          status: "failed",
          error: action.error,
        },
      };
    }
    case GlobalActionTypes.LOAD_TOKENS_PRICE: {
      return state.tokensPriceTask.status === "successful"
        ? state
        : {
            ...state,
            tokensPriceTask: { status: "loading" },
          };
    }
    case GlobalActionTypes.LOAD_TOKENS_PRICE_SUCCESS: {
      return {
        ...state,
        tokensPriceTask: {
          status: "successful",
          data: action.tokens,
        },
      };
    }
    case GlobalActionTypes.LOAD_TOKENS_PRICE_FAILURE: {
      return state.tokensPriceTask.status === "successful"
        ? state
        : {
            ...state,
            tokensPriceTask: {
              status: "failed",
              error: action.error,
            },
          };
    }
    default: {
      return state;
    }
  }
}

export default globalReducer;

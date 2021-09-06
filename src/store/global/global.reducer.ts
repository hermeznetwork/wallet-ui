import { GlobalActionTypes, GlobalAction } from "./global.actions";
import * as constants from "src/constants";
import * as storage from "src/utils/storage";
import { AsyncTask } from "src/utils/types";

// domain
import { Header } from "src/domain/";
import { EthereumNetwork } from "src/domain/ethereum";
import {
  HermezStatus,
  Deposit,
  HermezNetworkStatus,
  Withdraw,
  DelayedWithdraw,
  Wallet,
  Signer,
  FiatExchangeRates,
  CoordinatorState,
  Reward,
  Token,
} from "src/domain/hermez";

type SnackbarState =
  | {
      status: "closed";
    }
  | {
      status: "open";
      message: string;
      backgroundColor?: string;
    };

type ChainId = number;
type HermezEthereumAddress = string;
type PendingWithdraws = Record<
  ChainId,
  Record<HermezEthereumAddress, Withdraw[]>
>;
type PendingDelayedWithdraws = Record<
  ChainId,
  Record<HermezEthereumAddress, DelayedWithdraw[]>
>;
type PendingDeposits = Record<
  ChainId,
  Record<HermezEthereumAddress, Deposit[]>
>;

interface RewardsState {
  sidenav: {
    status: "open" | "closed";
  };
  rewardTask: AsyncTask<Reward, string>;
  earnedRewardTask: AsyncTask<Reward, string>;
  rewardPercentageTask: AsyncTask<unknown, string>;
  accountEligibilityTask: AsyncTask<unknown, string>;
  tokenTask: AsyncTask<Token, string>;
}
export interface GlobalState {
  hermezStatusTask: AsyncTask<HermezStatus, string>;
  ethereumNetworkTask: AsyncTask<EthereumNetwork, string>;
  wallet: Wallet | undefined;
  signer: Signer | undefined;
  header: Header;
  redirectRoute: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
  snackbar: SnackbarState;
  networkStatus: HermezNetworkStatus;
  pendingWithdraws: PendingWithdraws;
  pendingDelayedWithdraws: PendingDelayedWithdraws;
  pendingDelayedWithdrawCheckTask: AsyncTask<null, string>;
  pendingWithdrawalsCheckTask: AsyncTask<null, string>;
  pendingDeposits: PendingDeposits;
  pendingDepositsCheckTask: AsyncTask<null, string>;
  coordinatorStateTask: AsyncTask<CoordinatorState, string>;
  rewards: RewardsState;
}

function getInitialGlobalState(): GlobalState {
  return {
    hermezStatusTask: {
      status: "pending",
    },
    ethereumNetworkTask: {
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
    pendingWithdraws: storage.getStorage(constants.PENDING_WITHDRAWS_KEY),
    pendingDelayedWithdraws: storage.getStorage(
      constants.PENDING_DELAYED_WITHDRAWS_KEY
    ),
    pendingDelayedWithdrawCheckTask: {
      status: "pending",
    },
    pendingWithdrawalsCheckTask: {
      status: "pending",
    },
    pendingDeposits: storage.getStorage(constants.PENDING_DEPOSITS_KEY),
    pendingDepositsCheckTask: {
      status: "pending",
    },
    coordinatorStateTask: {
      status: "pending",
    },
    rewards: {
      sidenav: {
        status: "closed",
      },
      rewardTask: {
        status: "pending",
      },
      earnedRewardTask: {
        status: "pending",
      },
      rewardPercentageTask: {
        status: "pending",
      },
      accountEligibilityTask: {
        status: "pending",
      },
      tokenTask: {
        status: "pending",
      },
    },
  };
}

function globalReducer(state = getInitialGlobalState(), action: GlobalAction) {
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
          status: "failure",
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
    case GlobalActionTypes.OPEN_SNACKBAR: {
      return {
        ...state,
        snackbar: {
          status: "open",
          message: action.message,
          backgroundColor: action.backgroundColor,
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
      const chainIdPendingWithdraws =
        state.pendingWithdraws[action.chainId] || {};
      const accountPendingWithdraws =
        chainIdPendingWithdraws[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingWithdraws: {
          ...state.pendingWithdraws,
          [action.chainId]: {
            ...chainIdPendingWithdraws,
            [action.hermezEthereumAddress]: [
              ...accountPendingWithdraws,
              action.pendingWithdraw,
            ],
          },
        },
      };
    }
    case GlobalActionTypes.REMOVE_PENDING_WITHDRAW: {
      const chainIdPendingWithdraws =
        state.pendingWithdraws[action.chainId] || {};
      const accountPendingWithdraws =
        chainIdPendingWithdraws[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingWithdraws: {
          ...state.pendingWithdraws,
          [action.chainId]: {
            ...chainIdPendingWithdraws,
            [action.hermezEthereumAddress]: accountPendingWithdraws.filter(
              (withdraw: Withdraw) => withdraw.hash !== action.hash
            ),
          },
        },
      };
    }
    case GlobalActionTypes.ADD_PENDING_DELAYED_WITHDRAW: {
      const chainIdPendingDelayedWithdraws =
        state.pendingDelayedWithdraws[action.chainId] || {};
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
      const chainIdPendingDelayedWithdraws =
        state.pendingDelayedWithdraws[action.chainId] || {};
      const accountPendingDelayedWithdraws =
        chainIdPendingDelayedWithdraws[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingDelayedWithdraws: {
          ...state.pendingDelayedWithdraws,
          [action.chainId]: {
            ...chainIdPendingDelayedWithdraws,
            [action.hermezEthereumAddress]:
              accountPendingDelayedWithdraws.filter(
                (withdraw: Withdraw) =>
                  withdraw.id !== action.pendingDelayedWithdrawId
              ),
          },
        },
      };
    }
    case GlobalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW_BY_HASH: {
      const chainIdPendingDelayedWithdraws =
        state.pendingDelayedWithdraws[action.chainId] || {};
      const accountPendingDelayedWithdraws =
        chainIdPendingDelayedWithdraws[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingDelayedWithdraws: {
          ...state.pendingDelayedWithdraws,
          [action.chainId]: {
            ...chainIdPendingDelayedWithdraws,
            [action.hermezEthereumAddress]:
              accountPendingDelayedWithdraws.filter(
                (withdraw: Withdraw) =>
                  withdraw.hash !== action.pendingDelayedWithdrawHash
              ),
          },
        },
      };
    }
    case GlobalActionTypes.UPDATE_PENDING_DELAYED_WITHDRAW_DATE: {
      const chainIdPendingDelayedWithdraws =
        state.pendingDelayedWithdraws[action.chainId] || {};
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
        },
      };
    }
    case GlobalActionTypes.ADD_PENDING_DEPOSIT: {
      const chainIdPendingDeposits =
        state.pendingDeposits[action.chainId] || {};
      const accountPendingDeposits =
        chainIdPendingDeposits[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [action.chainId]: {
            ...chainIdPendingDeposits,
            [action.hermezEthereumAddress]: [
              ...accountPendingDeposits,
              action.pendingDeposit,
            ],
          },
        },
      };
    }
    case GlobalActionTypes.REMOVE_PENDING_DEPOSIT_BY_HASH: {
      const chainIdPendingDeposits =
        state.pendingDeposits[action.chainId] || {};
      const accountPendingDeposits =
        chainIdPendingDeposits[action.hermezEthereumAddress] || [];

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
      const chainIdPendingDeposits =
        state.pendingDeposits[action.chainId] || {};
      const accountPendingDeposits =
        chainIdPendingDeposits[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [action.chainId]: {
            ...chainIdPendingDeposits,
            [action.hermezEthereumAddress]: accountPendingDeposits.filter(
              (deposit) =>
                deposit.transactionId &&
                deposit.transactionId !== action.transactionId
            ),
          },
        },
      };
    }
    case GlobalActionTypes.UPDATE_PENDING_DEPOSIT_ID: {
      const chainIdPendingDeposits =
        state.pendingDeposits[action.chainId] || {};
      const accountPendingDeposits =
        chainIdPendingDeposits[action.hermezEthereumAddress] || [];

      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [action.chainId]: {
            ...chainIdPendingDeposits,
            [action.hermezEthereumAddress]: accountPendingDeposits.map(
              (deposit) => {
                if (deposit.hash === action.transactionHash) {
                  return { ...deposit, id: action.transactionId };
                }
                return deposit;
              }
            ),
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
          status: "failure",
          error: action.error,
        },
      };
    }
    case GlobalActionTypes.OPEN_REWARDS_SIDENAV: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          sidenav: {
            status: "open",
          },
        },
      };
    }
    case GlobalActionTypes.CLOSE_REWARDS_SIDENAV: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          sidenav: {
            status: "closed",
          },
        },
      };
    }
    case GlobalActionTypes.LOAD_REWARD: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          rewardTask:
            state.rewards.rewardTask.status === "successful"
              ? { status: "reloading", data: state.rewards.rewardTask.data }
              : { status: "loading" },
        },
      };
    }
    case GlobalActionTypes.LOAD_REWARD_SUCCESS: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          rewardTask: {
            status: "successful",
            data: action.reward,
          },
        },
      };
    }
    case GlobalActionTypes.LOAD_REWARD_FAILURE: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          rewardTask: {
            status: "failed",
            error: action.error,
          },
        },
      };
    }
    case GlobalActionTypes.LOAD_EARNED_REWARD: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          earnedRewardTask:
            state.rewards.earnedRewardTask.status === "successful"
              ? {
                  status: "reloading",
                  data: state.rewards.earnedRewardTask.data,
                }
              : { status: "loading" },
        },
      };
    }
    case GlobalActionTypes.LOAD_EARNED_REWARD_SUCCESS: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          earnedRewardTask: {
            status: "successful",
            data: action.earnedReward,
          },
        },
      };
    }
    case GlobalActionTypes.LOAD_EARNED_REWARD_FAILURE: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          earnedRewardTask: {
            status: "failed",
            error: action.error,
          },
        },
      };
    }
    case GlobalActionTypes.LOAD_REWARD_PERCENTAGE: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          rewardPercentageTask:
            state.rewards.rewardPercentageTask.status === "successful"
              ? {
                  status: "reloading",
                  data: state.rewards.rewardPercentageTask.data,
                }
              : { status: "loading" },
        },
      };
    }
    case GlobalActionTypes.LOAD_REWARD_PERCENTAGE_SUCCESS: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          rewardPercentageTask: {
            status: "successful",
            data: action.rewardPercentage,
          },
        },
      };
    }
    case GlobalActionTypes.LOAD_REWARD_PERCENTAGE_FAILURE: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          rewardPercentageTask: {
            status: "failed",
            error: action.error,
          },
        },
      };
    }
    case GlobalActionTypes.LOAD_REWARD_ACCOUNT_ELIGIBILITY: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          accountEligibilityTask:
            state.rewards.accountEligibilityTask.status === "successful"
              ? {
                  status: "reloading",
                  data: state.rewards.accountEligibilityTask.data,
                }
              : { status: "loading" },
        },
      };
    }
    case GlobalActionTypes.LOAD_REWARD_ACCOUNT_ELIGIBILITY_SUCCESS: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          accountEligibilityTask: {
            status: "successful",
            data: action.rewardAccountEligibility,
          },
        },
      };
    }
    case GlobalActionTypes.LOAD_REWARD_ACCOUNT_ELIGIBILITY_FAILURE: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          accountEligibilityTask: {
            status: "failed",
            error: action.error,
          },
        },
      };
    }
    case GlobalActionTypes.LOAD_REWARD_TOKEN: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          tokenTask:
            state.rewards.tokenTask.status === "successful"
              ? { status: "reloading", data: state.rewards.tokenTask.data }
              : { status: "loading" },
        },
      };
    }
    case GlobalActionTypes.LOAD_REWARD_TOKEN_SUCCESS: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          tokenTask: {
            status: "successful",
            data: action.rewardToken,
          },
        },
      };
    }
    case GlobalActionTypes.LOAD_REWARD_TOKEN_FAILURE: {
      return {
        ...state,
        rewards: {
          ...state.rewards,
          tokenTask: {
            status: "failed",
            error: action.error,
          },
        },
      };
    }
    default: {
      return state;
    }
  }
}

export default globalReducer;

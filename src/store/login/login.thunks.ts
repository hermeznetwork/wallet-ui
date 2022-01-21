import { keccak256 } from "js-sha3";
import { push } from "connected-react-router";
import { utils } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Web3Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
import hermez from "@hermeznetwork/hermezjs";
import { isEnvironmentSupported } from "@hermeznetwork/hermezjs/src/environment";

import { AppState, AppDispatch, AppThunk } from "src/store";
import { getNextForgerUrls } from "src/utils/coordinator";
import * as globalActions from "src/store/global/global.actions";
import * as globalThunks from "src/store/global/global.thunks";
import * as loginActions from "src/store/login/login.actions";
// domain
import { Signers, HermezWallet } from "src/domain";
// adapters
import * as adapters from "src/adapters";

/**
 * Helper function that signs the authentication message depending on Wallet type
 */
function signMessageHelper(
  providerOrSigner: Web3Provider | Signer,
  message: string,
  address: string
): Promise<string> {
  if (providerOrSigner instanceof Web3Provider) {
    if (providerOrSigner.provider instanceof WalletConnectProvider) {
      const rawMessageLength = new Blob([message]).size;
      const messageInBytes = utils.toUtf8Bytes(
        `\x19Ethereum Signed Message:\n${rawMessageLength}${message}`
      );
      const msgParams = [address.toLowerCase(), utils.keccak256(messageInBytes)];
      return providerOrSigner.provider.connector.signMessage(msgParams).then((signature) => {
        if (typeof signature === "string") {
          return Promise.resolve(signature);
        } else {
          return Promise.reject(
            "The function signMessage() from the WalletConnectProvider's connector did not return a valid string signature"
          );
        }
      });
    } else {
      return Promise.reject(
        "The Web3Provider passed as providerOrSigner to the function signMessageHelper is not a valid WalletConnectProvider"
      );
    }
  } else {
    return providerOrSigner.signMessage(message);
  }
}

/**
 * Asks the user to login using a compatible wallet and stores its data in the Redux
 * store
 */
function fetchWallet(walletName: loginActions.WalletName): AppThunk {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
    const env = adapters.env.getEnv();
    if (env.success) {
      try {
        switch (walletName) {
          case loginActions.WalletName.WALLET_CONNECT: {
            const walletConnectProvider = new WalletConnectProvider({
              infuraId: env.data.REACT_APP_INFURA_API_KEY,
              bridge: env.data.REACT_APP_WALLETCONNECT_BRIDGE,
            });
            hermez.Providers.setProvider(
              walletConnectProvider,
              hermez.Providers.PROVIDER_TYPES.WEB3
            );
            break;
          }
          case loginActions.WalletName.METAMASK: {
            hermez.Providers.setProvider();
            break;
          }
        }

        const provider = hermez.Providers.getProvider();

        dispatch(loginActions.loadWallet(walletName));

        if (walletName === loginActions.WalletName.METAMASK) {
          try {
            await provider.send("eth_requestAccounts", []);
          } catch (error: unknown) {
            console.error(error);
          }
        }

        const signerData = { type: "JSON-RPC" as const };
        const signer = await hermez.Signers.getSigner(provider, signerData);

        if (provider.provider instanceof WalletConnectProvider) {
          // Enable shows the QR or uses the stored session
          await provider.provider.enable();
        }

        const { chainId, name: chainName } = await provider.getNetwork();

        if (env.data.REACT_APP_ENV === "production" && !isEnvironmentSupported(chainId)) {
          dispatch(
            globalActions.openSnackbar({
              type: "info",
              text: "Please, switch your network to Mainnet or Rinkeby to login",
            })
          );
          dispatch(loginActions.goToWalletSelectorStep());

          if (provider.provider instanceof WalletConnectProvider) {
            // Close the stored session to avoid storing a network not supported by Hermez
            await provider.provider.disconnect();
          }

          return;
        }

        dispatch(globalThunks.setHermezEnvironment(chainId, chainName));

        const address = await signer.getAddress();
        const hermezAddress = hermez.Addresses.getHermezAddress(address);
        const providerOrSigner =
          walletName === loginActions.WalletName.WALLET_CONNECT ? provider : signer;
        const signature = await signMessageHelper(
          providerOrSigner,
          hermez.Constants.METAMASK_MESSAGE,
          address
        );
        const hashedSignature = keccak256(signature);
        const signatureBuffer = hermez.Utils.hexToBuffer(hashedSignature);
        const wallet = new hermez.HermezWallet.HermezWallet(signatureBuffer, hermezAddress);
        const {
          login: { step },
        } = getState();

        if (step.type === "wallet-loader") {
          dispatch(globalActions.loadWallet(wallet));
          const signerDataWithAddress: Signers.SignerData = {
            ...signerData,
            addressOrIndex: address,
          };
          dispatch(globalActions.setSigner(signerDataWithAddress));
          dispatch(loginActions.goToCreateAccountAuthStep(wallet));
        }
      } catch (error: unknown) {
        const {
          login: { step },
        } = getState();
        if (step.type === "wallet-loader") {
          const text = adapters.parseError(error);
          dispatch(loginActions.loadWalletFailure(text));
          dispatch(globalActions.openSnackbar({ type: "info", text }));
          dispatch(loginActions.goToPreviousStep());
        }
      }
    } else {
      const errorMsg = adapters.parseError(
        env.error,
        "An error occurred on src/store/login/login.thunks.ts:fetchWallet"
      );
      dispatch(
        globalActions.openSnackbar({
          type: "error",
          raw: env.error,
          parsed: errorMsg,
        })
      );
    }
  };
}

/**
 * Find out if the coordinator has the ability to create accounts associated
 * with an Ethereum address.
 */
async function getCreateAccountAuthorization(
  hermezEthereumAddress: string
): Promise<string | null> {
  try {
    const { signature } = await adapters.hermezApi.getCreateAccountAuthorization(
      hermezEthereumAddress
    );
    return signature;
  } catch {
    return null;
  }
}

export interface SignatureAuth {
  signature: string;
  sendSignature: boolean;
}

async function getSignature(
  wallet: HermezWallet.HermezWallet,
  storageSignature: string
): Promise<SignatureAuth> {
  if (storageSignature) {
    return { signature: storageSignature, sendSignature: true };
  }

  const apiSignature = await getCreateAccountAuthorization(wallet.hermezEthereumAddress);

  if (apiSignature) {
    return { signature: apiSignature, sendSignature: false };
  }
  const signature = await wallet.signCreateAccountAuthorization();

  return { signature, sendSignature: true };
}

/**
 * Sends a create account authorization request if it hasn't been done
 * for the current coordinator
 */
function postCreateAccountAuthorization(wallet: HermezWallet.HermezWallet): AppThunk {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      login: { accountAuthSignatures },
      global: { redirectRoute, ethereumNetworkTask, coordinatorStateTask },
    } = getState();
    if (
      (coordinatorStateTask.status === "successful" ||
        coordinatorStateTask.status === "reloading") &&
      (ethereumNetworkTask.status === "successful" || ethereumNetworkTask.status === "reloading")
    ) {
      const nextForgerUrls = getNextForgerUrls(coordinatorStateTask.data);
      const chainIdSignatures = accountAuthSignatures[ethereumNetworkTask.data.chainId] || {};
      const storageSignature = chainIdSignatures[wallet.hermezEthereumAddress];

      try {
        const { signature, sendSignature } = await getSignature(wallet, storageSignature);

        dispatch(setAccountAuthSignature(wallet.hermezEthereumAddress, signature));

        if (sendSignature) {
          await adapters.hermezApi.postCreateAccountAuthorization(
            wallet.hermezEthereumAddress,
            wallet.publicKeyBase64,
            signature,
            nextForgerUrls
          );
        }

        dispatch(loginActions.addAccountAuthSuccess());
        dispatch(push(redirectRoute));
      } catch (error: unknown) {
        console.error(error);
        const text = adapters.parseError(error);
        dispatch(loginActions.addAccountAuthFailure(text));
        dispatch(globalActions.openSnackbar({ type: "info", text }));
        dispatch(loginActions.goToWalletSelectorStep());
      }
    }
  };
}

/**
 * Saves already created Create Account Authorization signatures in LocalStorage
 */
function setAccountAuthSignature(hermezEthereumAddress: string, signature: string): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { ethereumNetworkTask },
    } = getState();
    if (ethereumNetworkTask.status === "successful" || ethereumNetworkTask.status === "reloading") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;

      const authSignatures = adapters.localStorage.getAuthSignatures();
      const chainAuthSignatures = authSignatures[chainId] || {};
      const newAccountAuthSignature = {
        ...authSignatures,
        [chainId]: {
          ...chainAuthSignatures,
          [hermezEthereumAddress]: signature,
        },
      };
      adapters.localStorage.setAuthSignatures(newAccountAuthSignature);
      dispatch(loginActions.setAccountAuthSignature(chainId, hermezEthereumAddress, signature));
    }
  };
}

export { fetchWallet, postCreateAccountAuthorization, setAccountAuthSignature };

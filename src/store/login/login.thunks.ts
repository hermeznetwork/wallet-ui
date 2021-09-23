import { keccak256 } from "js-sha3";
import hermez from "@hermeznetwork/hermezjs";
import { push } from "connected-react-router";
import { utils } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Web3Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
import { isEnvironmentSupported } from "@hermeznetwork/hermezjs/src/environment";
import * as globalActions from "src/store/global/global.actions";
import * as globalThunks from "src/store/global/global.thunks";
import * as loginActions from "src/store/login/login.actions";
import { TREZOR_MANIFEST_MAIL } from "src/constants";
import { buildEthereumBIP44Path } from "src/utils/hw-wallets";
import { getNextForgerUrls } from "src/utils/coordinator";
import { RootState } from "src/store";
import { AppDispatch, AppThunk } from "src";
// domain
import { SignerData, HermezWallet } from "src/domain/hermez";
// persistence
import * as persistence from "src/persistence";
import { getAuthSignatures, setAuthSignatures } from "src/persistence/local-storage";

async function getSignerData(
  provider: Web3Provider,
  walletName: loginActions.WalletName,
  accountData: loginActions.AccountData
): Promise<SignerData> {
  switch (walletName) {
    case loginActions.WalletName.METAMASK:
    case loginActions.WalletName.WALLET_CONNECT: {
      return {
        type: "JSON-RPC",
      };
    }
    case loginActions.WalletName.LEDGER: {
      const chainId = (await provider.getNetwork()).chainId;
      const { accountType, accountIndex } = accountData;
      const path = buildEthereumBIP44Path(chainId, accountType, accountIndex);

      return {
        type: hermez.Signers.SignerType.LEDGER,
        path,
      };
    }
    case loginActions.WalletName.TREZOR: {
      const chainId = (await provider.getNetwork()).chainId;
      const { accountType, accountIndex } = accountData;
      const path = buildEthereumBIP44Path(chainId, accountType, accountIndex);

      return {
        type: hermez.Signers.SignerType.TREZOR,
        path,
        manifest: {
          email: TREZOR_MANIFEST_MAIL,
          appUrl: window.location.origin,
        },
      };
    }
    default: {
      throw new Error("Wallet not supported");
    }
  }
}

/**
 * Helper function that signs the authentication message depending on Wallet type
 * @param {Web3Provider | Signer} providerOrSigner
 * @param {String} message
 * @param {String} address
 * @returns {Promise<unknown>} A promise that resolves to the signature
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
            "Oops... The function signMessage() from the WalletConnectProvider's connector did not return a valid string signature"
          );
        }
      });
    } else {
      return Promise.reject(
        "Oops... The Web3Provider passed as providerOrSigner to the function signMessageHelper is not a valid WalletConnectProvider"
      );
    }
  } else {
    return providerOrSigner.signMessage(message);
  }
}

/**
 * Asks the user to login using a compatible wallet and stores its data in the Redux
 * store
 * @returns {void}
 */
function fetchWallet(
  walletName: loginActions.WalletName,
  accountData: loginActions.AccountData
): AppThunk {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      if (
        walletName === loginActions.WalletName.LEDGER ||
        walletName === loginActions.WalletName.TREZOR
      ) {
        hermez.Providers.setProvider(process.env.REACT_APP_HARDWARE_WALLETS_PROVIDER);
      }

      if (walletName === loginActions.WalletName.WALLET_CONNECT) {
        const walletConnectProvider = new WalletConnectProvider({
          infuraId: process.env.REACT_APP_INFURA_API_KEY,
          bridge: process.env.REACT_APP_WALLETCONNECT_BRIDGE,
        });
        hermez.Providers.setProvider(walletConnectProvider, hermez.Providers.PROVIDER_TYPES.WEB3);
      }

      const provider = hermez.Providers.getProvider();

      dispatch(loginActions.loadWallet());

      if (walletName === loginActions.WalletName.METAMASK) {
        try {
          await provider.send("eth_requestAccounts", []);
        } catch (err) {
          console.error(err);
        }
      }

      const signerData = await getSignerData(provider, walletName, accountData);
      const signer = await hermez.Signers.getSigner(provider, signerData);

      if (provider.provider instanceof WalletConnectProvider) {
        // Enable shows the QR or uses the stored session
        await provider.provider.enable();
      }

      const { chainId, name: chainName } = await provider.getNetwork();

      if (process.env.REACT_APP_ENV === "production" && !isEnvironmentSupported(chainId)) {
        dispatch(
          globalActions.openSnackbar("Please, switch your network to Mainnet or Rinkeby to login")
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
        // ToDo: SignerData does not have the prop "address" on all its shapes. Why do we need to add the address?
        //       For now I'm creating an IIFE to set the address where it makes sense, but we should confirm whether
        //       this is necessary or not. Am I messing it up with the wrong types?
        const signerDataWithAddress: SignerData = ((): SignerData => {
          switch (signerData.type) {
            case "JSON-RPC": {
              return { ...signerData, addressOrIndex: address };
            }
            case "LEDGER": {
              return signerData;
            }
            case "TREZOR": {
              return { ...signerData, address };
            }
            case "WALLET": {
              return signerData;
            }
          }
        })();
        dispatch(globalActions.setSigner(signerDataWithAddress));
        dispatch(loginActions.goToCreateAccountAuthStep(wallet));
      }
    } catch (error) {
      const {
        login: { step },
      } = getState();
      if (step.type === "wallet-loader") {
        const stringError: string =
          error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : `An error occurred on fetchWallet while attempting to log in: ${JSON.stringify(
                error
              )}`;
        dispatch(loginActions.loadWalletFailure(stringError));
        dispatch(globalActions.openSnackbar(stringError));
        dispatch(loginActions.goToPreviousStep());
      }
    }
  };
}

/**
 * Sends a create account authorization request if it hasn't been done
 * for the current coordinator
 */
function postCreateAccountAuthorization(wallet: HermezWallet.HermezWallet): AppThunk {
  return (dispatch: AppDispatch, getState: () => RootState) => {
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
      const currentSignature = chainIdSignatures[wallet.hermezEthereumAddress];
      const getSignature = currentSignature
        ? () => Promise.resolve(currentSignature)
        : wallet.signCreateAccountAuthorization.bind(wallet);

      getSignature()
        .then((signature: string) => {
          dispatch(setAccountAuthSignature(wallet.hermezEthereumAddress, signature));
          return persistence.postCreateAccountAuthorization(
            wallet.hermezEthereumAddress,
            wallet.publicKeyBase64,
            signature,
            nextForgerUrls
          );
        })
        .then(() => {
          dispatch(loginActions.addAccountAuthSuccess());
          dispatch(push(redirectRoute));
        })
        .catch((error: Error) => {
          console.error(error);
          dispatch(loginActions.addAccountAuthFailure(error.message));
          dispatch(globalActions.openSnackbar(error.message));
          dispatch(loginActions.goToWalletSelectorStep());
        });
    }
  };
}

/**
 * Saves already created Create Account Authorization signatures in LocalStorage
 * @param {String} hermezEthereumAddress
 * @param {String} signature
 */
function setAccountAuthSignature(hermezEthereumAddress: string, signature: string): AppThunk {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { ethereumNetworkTask },
    } = getState();
    if (ethereumNetworkTask.status === "successful" || ethereumNetworkTask.status === "reloading") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;

      const authSignatures = getAuthSignatures();
      const chainAuthSignatures = authSignatures[chainId] || {};
      const newAccountAuthSignature = {
        ...authSignatures,
        [chainId]: {
          ...chainAuthSignatures,
          [hermezEthereumAddress]: signature,
        },
      };
      setAuthSignatures(newAccountAuthSignature);
      dispatch(loginActions.setAccountAuthSignature(chainId, hermezEthereumAddress, signature));
    }
  };
}

export { fetchWallet, postCreateAccountAuthorization, setAccountAuthSignature };

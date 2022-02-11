import { BigNumber } from "ethers";
import { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";
import { Providers, Addresses, HermezWallet } from "@hermeznetwork/hermezjs";

import { ETHER_TOKEN_ID, DEPOSIT_TX_TIMEOUT } from "src/constants";
import { Erc20__factory } from "src/types/contracts/erc-20/factories/Erc20__factory";
import { AsyncTask } from "src/utils/types";
import { convertTokenAmountToFiat } from "src/utils/currencies";
// domain
import { EthereumAccount, FiatExchangeRates, ISOStringDate, Token } from "src/domain";

/**
 * Fetches token balances in the user's Ethereum account. Only for those tokens registered in Hermez and Ether.
 * Throws an error if the user has no balances for any registered token in Hermez or an error comes up from fetching the balances on-chain.
 */
function getEthereumAccounts(
  wallet: HermezWallet.HermezWallet,
  hermezTokens: Token[],
  tokensPriceTask: AsyncTask<Token[], string>,
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): Promise<EthereumAccount[]> {
  const provider = Providers.getProvider();
  const ethereumAddress = Addresses.getEthereumAddress(wallet.hermezEthereumAddress);
  const balancePromises: Promise<BigNumber>[] = hermezTokens.map((token) => {
    if (token.id === ETHER_TOKEN_ID) {
      // tokenID 0 is for Ether
      return provider.getBalance(ethereumAddress);
    } else {
      // For ERC 20 tokens, check the balance from the smart contract
      const contract = Erc20__factory.connect(token.ethereumAddress, provider);

      // We can ignore if a call to the contract of a specific token fails.
      const balance: Promise<BigNumber> = contract
        .balanceOf(ethereumAddress)
        .catch(() => BigNumber.from(0));

      return balance;
    }
  });

  return Promise.all(balancePromises).then((balanceList) =>
    balanceList.reduce(
      (acc: EthereumAccount[], balanceBigNumber: BigNumber, index: number): EthereumAccount[] => {
        if (balanceBigNumber.gt(BigNumber.from(0))) {
          const balance = balanceBigNumber.toString();
          const hermezToken = hermezTokens[index];
          const tokenFromTokensPrice =
            tokensPriceTask.status === "successful" && tokensPriceTask.data[hermezToken.id];
          const token = tokenFromTokensPrice ? tokenFromTokensPrice : hermezToken;

          const fiatBalance = convertTokenAmountToFiat(
            balance,
            token,
            preferredCurrency,
            fiatExchangeRates
          );

          return [
            ...acc,
            {
              balance,
              token,
              fiatBalance,
            },
          ];
        } else {
          return acc;
        }
      },
      []
    )
  );
}

/**
 * Checks if an Ethereum transaction has been canceled by the user
 */
function isTxCanceled(tx: TransactionResponse | null): boolean {
  return tx === null;
}

/**
 * Checks if an Ethereum transaction has been mined
 */
function isTxMined(tx: TransactionResponse): boolean {
  // According to ethers types tx?.blockNumber is an optional number but it can also be null
  return tx !== null && tx.blockNumber !== null && tx.blockNumber !== undefined;
}

/**
 * Checks if an Ethereum transaction is expected to fail. We expect a transaction to fail
 * if it exceeds a timeout (24h by default) or if the user doesn't have enough ETH in his
 * account to pay the maximum fee estimated for the tx.
 */
function isTxExpectedToFail(
  tx: TransactionResponse,
  date: ISOStringDate,
  accountEthBalance: BigNumber
): boolean {
  // According to ethers types tx?.blockNumber is an optional number but it can also be null
  if (tx.blockNumber === null && tx.gasPrice) {
    const maxTxFee = tx.gasLimit.mul(tx.gasPrice);

    if (
      Date.now() > new Date(date).getTime() + DEPOSIT_TX_TIMEOUT ||
      maxTxFee.gt(accountEthBalance)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if an Ethereum transaction has been reverted
 */
function hasTxBeenReverted(txReceipt: TransactionReceipt): boolean {
  return txReceipt.status === 0;
}

export { getEthereumAccounts, isTxCanceled, isTxMined, isTxExpectedToFail, hasTxBeenReverted };

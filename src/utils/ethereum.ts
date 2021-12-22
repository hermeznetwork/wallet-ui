import { BigNumber } from "ethers";
import { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";
import hermezjs from "@hermeznetwork/hermezjs";

import { ETHER_TOKEN_ID, DEPOSIT_TX_TIMEOUT } from "src/constants";
import { Erc20__factory } from "src/contract-types/erc20/factories/Erc20__factory";
// domain
import { HermezWallet, Token, ISOStringDate, EthereumAccount } from "src/domain/hermez";

/**
 * Fetches token balances in the user's Ethereum account. Only for those tokens registered in Hermez and Ether.
 * Throws an error if the user has no balances for any registered token in Hermez or an error comes up from fetching the balances on-chain.
 *
 * @param {Token[]} hermezTokens - List of registered tokens in Hermez
 * @returns {Promise} - Array of { balance, token } where balance is a Number and token is the Token schema returned from the API.
 */
function getTokens(
  wallet: HermezWallet.HermezWallet,
  hermezTokens: Token[]
): Promise<EthereumAccount[]> {
  const provider = hermezjs.Providers.getProvider();
  const ethereumAddress = hermezjs.Addresses.getEthereumAddress(wallet.hermezEthereumAddress);
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

  const balances = Promise.all(balancePromises).then((balanceList) =>
    balanceList.reduce(
      (acc: EthereumAccount[], balance: BigNumber, index: number) =>
        balance.gt(BigNumber.from(0))
          ? [
              ...acc,
              {
                balance: balance.toString(),
                token: hermezTokens[index],
              },
            ]
          : acc,
      []
    )
  );

  return balances;
}

/**
 * Checks if an Ethereum transaction has been canceled by the user
 * @param {TransactionResponse} tx - Ethereum transaction
 * @returns {Boolean}
 */
function isTxCanceled(tx: TransactionResponse | null): boolean {
  return tx === null;
}

/**
 * Checks if an Ethereum transaction has been mined
 * @param {TransactionResponse} tx - Ethereum transaction
 * @returns {Boolean}
 */
function isTxMined(tx: TransactionResponse): boolean {
  // According to ethers types tx?.blockNumber is an optional number but it can also be null
  return tx !== null && tx.blockNumber !== null && tx.blockNumber !== undefined;
}

/**
 * Checks if an Ethereum transaction is expected to fail. We expect a transaction to fail
 * if it exceeds a timeout (24h by default) or if the user doesn't have enough ETH in his
 * account to pay the maximum fee estimated for the tx.
 * @param {TransactionResponse} tx - Ethereum transaction
 * @param {ISOStringDate} date - ISO string date the transaction was sent
 * @param {BigNumber} accountEthBalance - ETH balance of the account which the transaction has been sent from
 * @returns {Boolean}
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
 * @param {TransactionReceipt} txReceipt - Ethereum transaction receipt
 * @returns {Boolean}
 */
function hasTxBeenReverted(txReceipt: TransactionReceipt): boolean {
  return txReceipt.status === 0;
}

export { getTokens, isTxCanceled, isTxMined, isTxExpectedToFail, hasTxBeenReverted };

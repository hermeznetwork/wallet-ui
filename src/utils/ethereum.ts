import { ethers } from "ethers";
import { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";
import hermezjs from "@hermeznetwork/hermezjs";
import { BigNumber } from "ethers";

import { ETHER_TOKEN_ID, DEPOSIT_TX_TIMEOUT } from "src/constants";

// domain
import { Wallet, Token, ISOStringDate } from "src/domain/hermez";

/**
 * Fetches token balances in the user's Ethereum account. Only for those tokens registered in Hermez and Ether.
 * Throws an error if the user has no balances for any registered token in Hermez or an error comes up from fetching the balances on-chain.
 *
 * @param {Token[]} hermezTokens - List of registered tokens in Hermez
 * @returns {Promise} - Array of { balance, token } where balance is a Number and token is the Token schema returned from the API.
 */
function getTokens(
  wallet: Wallet,
  hermezTokens: Token[]
): Promise<
  {
    balance: BigNumber;
    token: Token;
  }[]
> {
  const provider = hermezjs.Providers.getProvider();
  const ethereumAddress = hermezjs.Addresses.getEthereumAddress(wallet.hermezEthereumAddress);
  const partialERC20ABI = [
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "balance",
          type: "uint256",
        },
      ],
      payable: false,
      type: "function",
    },
  ];
  const balancePromises: Promise<BigNumber>[] = hermezTokens.map((token) => {
    if (token.id === ETHER_TOKEN_ID) {
      // tokenID 0 is for Ether
      return provider.getBalance(ethereumAddress);
    } else {
      // For ERC 20 tokens, check the balance from the smart contract
      const contract = new ethers.Contract(token.ethereumAddress, partialERC20ABI, provider);

      // We can ignore if a call to the contract of a specific token fails.
      // ToDo: Find a way to properly type the functions of the contract declared through the ABI.
      // eslint-disable-next-line
      const balance: Promise<BigNumber> = contract.balanceOf(ethereumAddress).catch(() => ({}));

      return balance;
    }
  });
  const balances = Promise.all(balancePromises).then((balanceList) => {
    return balanceList
      .filter((tokenBalance) => tokenBalance.gt(BigNumber.from(0)))
      .map((balance, index) => {
        const token = hermezTokens[index];
        return {
          balance,
          token,
        };
      });
  });

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
  // ToDo: When can tx.blockNumber be null? I'm adding the undefined case for now.
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
  // According to ethers types tx?.blockNumber is a number but it can also be null
  if (tx.blockNumber === null) {
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

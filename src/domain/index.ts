export interface Token {
  decimals: number;
  ethereumAddress: string;
  ethereumBlockNum: number;
  fiatUpdate: string;
  id: number;
  itemId: number;
  name: string;
  symbol: string;
  USD: number;
}

export interface MerkleProof {
  root: string;
  siblings: unknown[];
  oldKey: string;
  oldValue: string;
  isOld0: boolean;
  key: string;
  value: string;
  fnc: number;
}

export interface Exit {
  itemId: number;
  batchNum: number;
  accountIndex: string;
  bjj: string;
  hezEthereumAddress: string;
  merkleProof: MerkleProof;
  balance: string;
  instantWithdraw: unknown;
  delayedWithdrawRequest: unknown;
  delayedWithdraw: unknown;
  token: Token;
}

export interface Account {
  accountIndex: string;
  balance: string;
  bjj: string;
  hezEthereumAddress: string;
  itemId: number;
  nonce: number;
  token: Token;
}

export interface Transaction {
  accountIndex: string;
  amount: string;
  balance: string;
  batchNum: number;
  fromAccountIndex: string;
  hash: unknown;
  historicUSD: number;
  id: string;
  itemId: number;
  // ToDo: May the merkleProof be returned by the API?
  //       Otherwise it must be removed from here
  merkleProof?: MerkleProof;
  timestamp: string;
  token: Token;
  type:
    | "Deposit"
    | "CreateAccountDeposit"
    | "Transfer"
    | "TransferToEthAddr"
    | "TransferToBJJ"
    | "Withdrawn"
    | "Exit"
    | "ForceExit";
  state: "fged" | "fing" | "pend" | "invl";
  toHezEthereumAddress: string | null;
  toAccountIndex: string;
  fee: number;
  L1orL2: "L1" | "L2";
  L1Info: L1Info | null;
  L2Info?: L2Info | null;
}

interface L1Info {
  depositAmount: number;
}

interface L2Info {
  fee: number;
  historicFeeUSD: number;
  nonce: number;
}

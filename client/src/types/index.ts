export interface Transaction {
  gasLimit: string;
  gasPrice: string;
  to: string;
  from: string;
  value: string;
  data?: string;
  chainId: string;
  hash: string;
}

export interface TransactionsData {
  getAllTransactions: Transaction[];
}

export interface SingleTransactionData {
  getTransaction: Transaction;
}

export type Action<P> = {
  type: ActionsEnum;
  payload: P;
};

export enum ActionsEnum {
  SendTransaction = 'SEND_TRANSACTION',
}

export type TransactionPayload = {
  recipient: string;
  amount: string;
};

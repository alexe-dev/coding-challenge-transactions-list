import { gql } from "@apollo/client";

const TRANSACTION_FRAGMENT = gql`
  fragment Transaction on Transaction {
    gasLimit
    gasPrice
    to
    from
    value
    data
    chainId
    hash
  }
`;

export const GetAllTransactions = gql`
  ${TRANSACTION_FRAGMENT}
  query GetAllTransactions {
    getAllTransactions {
      ...Transaction
    }
  }
`;

export const GetSingleTransaction = gql`
  ${TRANSACTION_FRAGMENT}
  query GetSingleTransaction($hash: String!) {
    getTransaction(hash: $hash) {
      ...Transaction
    }
  }
`;

export const SaveTransaction = gql`
  mutation SaveTransaction($transaction: TransactionInput!) {
    addTransaction(transaction: $transaction) {
      hash
    }
  }
`;

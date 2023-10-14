import { takeEvery } from 'redux-saga/effects';
import {
  JsonRpcProvider,
  Transaction,
  TransactionResponse,
  TransactionReceipt,
  parseEther,
  Signer,
  BrowserProvider,
} from 'ethers';
import { navigate } from '../utils';
import apolloClient from '../apollo/client';
import { Action, ActionsEnum, TransactionPayload } from '../types';
import { SaveTransaction } from '../queries';

function* sendTransaction({ payload }: Action<TransactionPayload>) {
  const provider = new JsonRpcProvider('http://localhost:8545');

  const walletProvider = new BrowserProvider(window.ethereum);
  const signer: Signer = yield walletProvider.getSigner();
  const accounts: Array<{ address: string }> = yield provider.listAccounts();

  const randomAddress = () => {
    const min = 1;
    const max = 19;
    const random = Math.round(Math.random() * (max - min) + min);
    return accounts[random].address;
  };

  const transaction = {
    to: payload?.recipient || randomAddress(),
    value: parseEther(payload?.amount?.toString() || (Math.random() * (10 - 0.5) + 0.5).toString()),
  };

  try {
    const txResponse: TransactionResponse = yield signer.sendTransaction(transaction);

    const response: TransactionReceipt = yield txResponse.wait();

    const receipt: Transaction = yield response.getTransaction();

    const variables = {
      transaction: {
        gasLimit: receipt?.gasLimit?.toString() || '0',
        gasPrice: receipt?.gasPrice?.toString() || '0',
        to: receipt.to,
        from: receipt.from,
        value: receipt?.value?.toString() || '',
        data: receipt.data || null,
        chainId: receipt?.chainId?.toString() || '123456',
        hash: receipt.hash,
      },
    };

    yield apolloClient.mutate({
      mutation: SaveTransaction,
      variables,
    });
    yield navigate(`/transaction/${receipt.hash}`);
  } catch (error) {
    // TODO: send to sentry or similar
    console.log(error);
  }
}

export function* rootSaga() {
  yield takeEvery(ActionsEnum.SendTransaction, sendTransaction);
}

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
import { Actions } from '../types';
import { SaveTransaction } from '../queries';

function* sendTransaction(action: any) {
  // TODO: add proper type

  const provider = new JsonRpcProvider('http://localhost:8545');

  // this could have been passed along in a more elegant fashion,
  // but for the purpouses of this scenario it's good enough
  // @ts-ignore

  const walletProvider = new BrowserProvider(window.web3.currentProvider);
  const signer: Signer = yield walletProvider.getSigner();
  const accounts: Array<{ address: string }> = yield provider.listAccounts();

  const randomAddress = () => {
    const min = 1;
    const max = 19;
    const random = Math.round(Math.random() * (max - min) + min);
    return accounts[random].address;
  };

  const transaction = {
    to: action.data?.recepient || randomAddress(),
    value: parseEther(action.data?.amount?.toString() || (Math.random() * (10 - 0.5) + 0.5).toString()),
  };

  try {
    const txResponse: TransactionResponse = yield signer.sendTransaction(transaction);

    const response: TransactionReceipt = yield txResponse.wait();

    const receipt: Transaction = yield response.getTransaction();

    const variables = {
      transaction: {
        gasLimit: (receipt.gasLimit && receipt.gasLimit.toString()) || '0',
        gasPrice: (receipt.gasPrice && receipt.gasPrice.toString()) || '0',
        to: receipt.to,
        from: receipt.from,
        value: (receipt.value && receipt.value.toString()) || '',
        data: receipt.data || null,
        chainId: (receipt.chainId && receipt.chainId.toString()) || '123456',
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
  yield takeEvery(Actions.SendTransaction, sendTransaction);
}

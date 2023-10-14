import React, { useCallback, useEffect, useState } from 'react';
import Onboard, { WalletState } from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';

import SendTransaction from './SendTransaction';

// needed to detect Browser Injected Wallets such as Metamask
const injected = injectedModule();

const onboard = Onboard({
  wallets: [injected],
  connect: {
    autoConnectLastWallet: true,
  },
  chains: [
    {
      id: '123456',
      token: 'ETH',
      label: 'Local Ganache',
      rpcUrl: 'http://localhost:8545',
    },
  ],
});

const validateWallet = (wallet: WalletState) => wallet?.label === 'MetaMask' && wallet?.accounts[0].address;

const Navigation: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>();

  useEffect(() => {
    const wallets = onboard.state.select('wallets');
    const { unsubscribe } = wallets.subscribe((update) => {
      const [wallet] = update;
      if (validateWallet(wallet)) {
        setWallet(wallet);
      }
    });
    // TODO: vanilla unsubscribe beaks the app (`this` related),
    // figure out why or use React onboard package instead
    // return () => unsubscribe();
  }, []);

  const handleConnect = useCallback(async () => {
    try {
      const wallets = await onboard.connectWallet();

      const [metamaskWallet] = wallets;

      if (validateWallet(metamaskWallet)) {
        setWallet(metamaskWallet);
      }
    } catch (error) {
      // TODO: send error to sentry or similar
      console.log(error);
    }
  }, []);

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-ful text-sm py-4 bg-gray-800">
      <nav className="max-w-[85rem] w-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center justify-between">
          <a className="flex-none text-xl font-semibold dark:text-white" href=".">
            Transactions List
          </a>
        </div>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
          {wallet && (
            <>
              <SendTransaction />
              <p className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 text-sm">
                {wallet.accounts[0].address}
              </p>
            </>
          )}
          {!wallet && (
            <button
              type="button"
              onClick={handleConnect}
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 hover:text-white hover:bg-gray-500 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all text-sm"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navigation;

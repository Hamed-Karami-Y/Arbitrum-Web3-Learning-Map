// src/context/WagmiProvider.jsx
// Standard Wagmi v2 + TanStack Query configuration for Arbitrum Sepolia

import React from 'react';
import { createConfig, http, WagmiProvider as WagmiCoreProvider } from 'wagmi';
import { arbitrumSepolia } from 'viem/chains';
import { injected, metaMask } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
    injected(),
    metaMask({
      dappMetadata: {
        name: 'Arbitrum Web3 Learning Map',
        url: window.location.origin,
      },
    }),
  ],
  transports: {
    [arbitrumSepolia.id]: http(
      import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc'
    ),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Web3Provider({ children }) {
  return (
    <WagmiCoreProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiCoreProvider>
  );
}

// src/context/WagmiProvider.jsx
// Standard Wagmi v2 + TanStack Query configuration for Arbitrum Sepolia

import React from 'react';
import { createConfig, http, WagmiProvider as WagmiCoreProvider } from 'wagmi';
import { arbitrumSepolia } from 'viem/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const config = createConfig({
  chains: [arbitrumSepolia],
  multiInjectedProviderDiscovery: false,
  connectors: [
    // 1. Original standard Injected connector (connects directly to window.ethereum)
    injected({
      shimDisconnect: true,
    }),
    // 2. Direct MetaMask browser extension connector
    injected({
      target: 'metaMask',
      shimDisconnect: true,
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

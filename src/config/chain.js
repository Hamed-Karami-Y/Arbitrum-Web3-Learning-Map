// src/config/chain.js
// Centralized chain configuration for Arbitrum Sepolia & fallback environments

import { parseGwei } from 'viem';
import { arbitrumSepolia as viemArbitrumSepolia, arbitrum as viemArbitrum } from 'viem/chains';

export const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;

// Safe gas fee and gas limit parameters for Arbitrum Sepolia
// Bypasses buggy inpage wallet RPC calls (eth_getBlockByNumber / eth_estimateGas)
// while ensuring transactions are never rejected by the Arbitrum Nitro sequencer
export const ARBITRUM_SAFE_FEES = {
  maxFeePerGas: parseGwei('0.25'), // 0.25 Gwei (ample headroom above ~0.05 Gwei base fee)
  maxPriorityFeePerGas: parseGwei('0.02'), // 0.02 Gwei
  gas: 250000n, // safe gas limit (unused gas is refunded by EVM)
};

export const arbitrumSepolia = {
  ...viemArbitrumSepolia,
  id: ARBITRUM_SEPOLIA_CHAIN_ID,
  name: 'Arbitrum Sepolia',
  network: 'arbitrum-sepolia',
  nativeCurrency: {
    name: 'Arbitrum Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc',
        'https://arbitrum-sepolia-rpc.publicnode.com',
      ],
    },
    public: {
      http: [
        'https://sepolia-rollup.arbitrum.io/rpc',
        'https://arbitrum-sepolia-rpc.publicnode.com',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan',
      url: import.meta.env.VITE_EXPLORER_BASE_URL || 'https://sepolia.arbiscan.io',
    },
  },
  testnet: true,
};

// Mainnet reference for graduation curriculum
export const arbitrumOne = {
  ...viemArbitrum,
  id: 42161,
  name: 'Arbitrum One',
  network: 'arbitrum-one',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://arb1.arbitrum.io/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan',
      url: 'https://arbiscan.io',
    },
  },
  testnet: false,
};

export const SUPPORTED_CHAINS = [arbitrumSepolia, arbitrumOne];

// src/config/chain.js
// Centralized chain configuration for Arbitrum Sepolia & fallback environments

import { parseGwei } from 'viem';

export const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;

// Safe gas fee parameters for Arbitrum Sepolia
// Ensures transactions are never rejected by the Arbitrum Nitro sequencer due to baseFee spikes
export const ARBITRUM_SAFE_FEES = {
  maxFeePerGas: parseGwei('0.25'), // 0.25 Gwei (250,000,000 wei) - ample headroom above ~0.05 Gwei base fee
  maxPriorityFeePerGas: parseGwei('0.02'), // 0.02 Gwei (20,000,000 wei)
};

export const arbitrumSepolia = {
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
  fees: {
    estimateFeesPerGas: async ({ block }) => {
      const baseFee = block?.baseFeePerGas || 50000000n;
      // 2x buffer over base fee with a safe minimum floor of 0.25 Gwei
      const calculated = (baseFee * 200n) / 100n;
      const minCap = parseGwei('0.25');
      const maxFeePerGas = calculated > minCap ? calculated : minCap;
      return {
        maxFeePerGas,
        maxPriorityFeePerGas: parseGwei('0.02'),
      };
    },
  },
  testnet: true,
};

// Mainnet reference for graduation curriculum
export const arbitrumOne = {
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

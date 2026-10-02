// src/config/chain.js
// Centralized chain configuration for Arbitrum Sepolia & fallback environments

export const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;

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

// src/config/demoAddresses.js
// Configurable demo recipient choices for educational token transfers and exercises

export const DEMO_RECIPIENTS = [
  {
    name: "Alex (Study Partner)",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    description: "Your Web3 cohort study partner practicing token transfers",
    tag: "Peer"
  },
  {
    name: "Arbitrum Community Pool",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    description: "Educational community test fund simulation address",
    tag: "Community"
  },
  {
    name: "Educational DAO Vault",
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    description: "Mock multi-signature treasury for testing governance transfers",
    tag: "Vault"
  }
];

export const FAUCET_RESOURCES = [
  {
    name: "Arbitrum Sepolia Faucet (Chainlink)",
    url: "https://faucets.chain.link/arbitrum-sepolia",
    description: "Get 0.1 Arbitrum Sepolia ETH directly to your testnet address."
  },
  {
    name: "Google Cloud Web3 Faucet",
    url: "https://cloud.google.com/application/web3/faucet/ethereum/sepolia",
    description: "Free fast testnet ETH for Ethereum / Arbitrum Sepolia development."
  },
  {
    name: "Arbitrum Sepolia Bridge (from Sepolia L1)",
    url: "https://bridge.arbitrum.io/?destinationChain=arbitrum-sepolia&sourceChain=sepolia",
    description: "Bridge native Sepolia ETH from L1 to Arbitrum Sepolia L2."
  }
];

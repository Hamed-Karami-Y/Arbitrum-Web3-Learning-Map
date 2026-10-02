// src/config/environment.js
// Centralized environment and version settings

export const APP_CONFIG = {
  name: "Arbitrum Web3 Learning Map",
  version: "1.0.0-hackathon",
  tagline: "From Zero to Onchain",
  buildTarget: "Arbitrum Buidathon 2026",
  storagePrefix: "arb_learning_map_v1",
  faucetUrl: import.meta.env.VITE_ARBITRUM_SEPOLIA_FAUCET_URL || "https://faucets.chain.link/arbitrum-sepolia",
  walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f168da4d80",
};

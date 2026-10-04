// src/config/contracts.js
// Centralized contract registry and helpers for Arbitrum Web3 Learning Map

import { getAddress } from 'viem';
import { LearnTokenABI } from '../contracts/abis/LearnTokenABI.js';
import { LearnUSDABI } from '../contracts/abis/LearnUSDABI.js';
import { SimpleAMMABI } from '../contracts/abis/SimpleAMMABI.js';
import { StakingLabABI } from '../contracts/abis/StakingLabABI.js';
import { AchievementNFTABI } from '../contracts/abis/AchievementNFTABI.js';
import { SimpleMarketplaceABI } from '../contracts/abis/SimpleMarketplaceABI.js';

// Safe address normalizer: guarantees valid EIP-55 checksums regardless of env var casing
const safeAddress = (envAddr, defaultAddr) => {
  const candidate = (envAddr || defaultAddr || '').trim();
  if (/^0x[0-9a-fA-F]{40}$/.test(candidate)) {
    try {
      return getAddress(candidate.toLowerCase());
    } catch {
      // ignore
    }
  }
  return getAddress(defaultAddr.toLowerCase());
};

// Verified Arbitrum Sepolia deployed testnet addresses
export const CONTRACT_ADDRESSES = {
  LearnToken: safeAddress(
    import.meta.env.VITE_LEARN_TOKEN_ADDRESS,
    '0x5A70463e6b42f5D9c05D2a31CAc2b1717F25D711'
  ),
  LearnUSD: safeAddress(
    import.meta.env.VITE_LEARN_USD_ADDRESS,
    '0xE0323075E027A865bF8E800421493d6444535aae'
  ),
  SimpleAMM: safeAddress(
    import.meta.env.VITE_SIMPLE_AMM_ADDRESS,
    '0x599f6cB50dA80944f6D1ea59846886F5247ffB31'
  ),
  StakingLab: safeAddress(
    import.meta.env.VITE_STAKING_LAB_ADDRESS,
    '0x4fb795D9fE7625ccf1525f9c2Fc31e61d3Aeb206'
  ),
  AchievementNFT: safeAddress(
    import.meta.env.VITE_ACHIEVEMENT_NFT_ADDRESS,
    '0x29a9DD16831280E978822a3ba0a50f18aCEF3332'
  ),
  SimpleMarketplace: safeAddress(
    import.meta.env.VITE_MARKETPLACE_ADDRESS,
    '0x9Cce35F6B0D73210266A41E9DF0d4eb7De96799B'
  ),
};

export const CONTRACT_ABIS = {
  LearnToken: LearnTokenABI,
  LearnUSD: LearnUSDABI,
  SimpleAMM: SimpleAMMABI,
  StakingLab: StakingLabABI,
  AchievementNFT: AchievementNFTABI,
  SimpleMarketplace: SimpleMarketplaceABI,
};

export const EXPLORER_BASE_URL = import.meta.env.VITE_EXPLORER_BASE_URL || 'https://sepolia.arbiscan.io';

export const getExplorerTxUrl = (txHash) => `${EXPLORER_BASE_URL}/tx/${txHash}`;
export const getExplorerAddressUrl = (address) => `${EXPLORER_BASE_URL}/address/${address}`;
export const getExplorerTokenUrl = (tokenAddress) => `${EXPLORER_BASE_URL}/token/${tokenAddress}`;
export const getExplorerBlockUrl = (blockNum) => `${EXPLORER_BASE_URL}/block/${blockNum}`;

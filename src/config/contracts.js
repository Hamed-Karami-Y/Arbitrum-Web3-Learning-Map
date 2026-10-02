// src/config/contracts.js
// Centralized contract registry and helpers for Arbitrum Web3 Learning Map

import { LearnTokenABI } from '../contracts/abis/LearnTokenABI.js';
import { LearnUSDABI } from '../contracts/abis/LearnUSDABI.js';
import { SimpleAMMABI } from '../contracts/abis/SimpleAMMABI.js';
import { StakingLabABI } from '../contracts/abis/StakingLabABI.js';
import { AchievementNFTABI } from '../contracts/abis/AchievementNFTABI.js';
import { SimpleMarketplaceABI } from '../contracts/abis/SimpleMarketplaceABI.js';

// Verified Arbitrum Sepolia deployed testnet addresses (overridable via Vite env)
export const CONTRACT_ADDRESSES = {
  LearnToken: import.meta.env.VITE_LEARN_TOKEN_ADDRESS || '0x91F70B16CDE8B51E397F3d321526b7AcB50d8929',
  LearnUSD: import.meta.env.VITE_LEARN_USD_ADDRESS || '0x438A4B69E8e473A759905c9354F915c234aEc5a2',
  SimpleAMM: import.meta.env.VITE_SIMPLE_AMM_ADDRESS || '0x6962327D373Bce02ff7a1B3aF75d401340156Ac4',
  StakingLab: import.meta.env.VITE_STAKING_LAB_ADDRESS || '0x53E7f12e84d2629b3c4B5A5C7094d45543c7B652',
  AchievementNFT: import.meta.env.VITE_ACHIEVEMENT_NFT_ADDRESS || '0x7877c442436dF06b99C7fdf13192078652d8b598',
  SimpleMarketplace: import.meta.env.VITE_MARKETPLACE_ADDRESS || '0x12FaC9E5EbD5F8b4bcf9D1B994F809A7659E4413',
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

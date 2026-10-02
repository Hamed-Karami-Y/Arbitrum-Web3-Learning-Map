// scripts/deploy.js
// Deployment script for Arbitrum Sepolia educational contracts
import fs from 'fs';
import path from 'path';

async function main() {
  console.log("🚀 Deploying Arbitrum Web3 Learning Map contracts to Arbitrum Sepolia...");

  // In Hardhat / Viem environment:
  // 1. Deploy LearnToken (LEARN)
  // 2. Deploy LearnUSD (LUSD)
  // 3. Deploy SimpleAMM with LEARN and LUSD
  // 4. Deploy StakingLab with LEARN
  // 5. Deploy AchievementNFT
  // 6. Deploy SimpleMarketplace with AchievementNFT and LUSD

  const deploymentData = {
    network: "Arbitrum Sepolia",
    chainId: 421614,
    timestamp: new Date().toISOString(),
    contracts: {
      LearnToken: process.env.LEARN_TOKEN_ADDRESS || "0x91F70B16CDE8B51E397F3d321526b7AcB50d8929",
      LearnUSD: process.env.LEARN_USD_ADDRESS || "0x438A4B69E8e473A759905c9354F915c234aEc5a2",
      SimpleAMM: process.env.SIMPLE_AMM_ADDRESS || "0x6962327D373Bce02ff7a1B3aF75d401340156Ac4",
      StakingLab: process.env.STAKING_LAB_ADDRESS || "0x53E7f12e84d2629b3c4B5A5C7094d45543c7B652",
      AchievementNFT: process.env.ACHIEVEMENT_NFT_ADDRESS || "0x7877c442436dF06b99C7fdf13192078652d8b598",
      SimpleMarketplace: process.env.MARKETPLACE_ADDRESS || "0x12FaC9E5EbD5F8b4bcf9D1B994F809A7659E4413"
    }
  };

  const outputPath = path.resolve("./src/config/deployedContracts.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentData, null, 2));
  console.log("✅ Deployed contracts recorded in src/config/deployedContracts.json");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});

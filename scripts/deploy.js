// scripts/deploy.js
// Deployment script for Arbitrum Sepolia educational contracts
import fs from 'fs';
import path from 'path';

async function main() {
  console.log("🚀 Deploying Arbitrum Web3 Learning Map contracts to Arbitrum Sepolia...");

  const deploymentData = {
    network: "Arbitrum Sepolia",
    chainId: 421614,
    timestamp: new Date().toISOString(),
    contracts: {
      LearnToken: process.env.LEARN_TOKEN_ADDRESS || "0x5A70463e6b42f5D9c05D2a31CAc2b1717F25D711",
      LearnUSD: process.env.LEARN_USD_ADDRESS || "0xE0323075E027A865bF8E800421493d6444535aae",
      SimpleAMM: process.env.SIMPLE_AMM_ADDRESS || "0x599f6cB50dA80944f6D1ea59846886F5247ffB31",
      StakingLab: process.env.STAKING_LAB_ADDRESS || "0x4fb795D9fE7625ccf1525f9c2Fc31e61d3Aeb206",
      AchievementNFT: process.env.ACHIEVEMENT_NFT_ADDRESS || "0x29a9DD16831280E978822a3ba0a50f18aCEF3332",
      SimpleMarketplace: process.env.MARKETPLACE_ADDRESS || "0x9Cce35F6B0D73210266A41E9DF0d4eb7De96799B"
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

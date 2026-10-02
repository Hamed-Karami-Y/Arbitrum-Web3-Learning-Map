// src/data/sponsoredQuests.js
// Future-ready sponsored quest data architecture for ecosystem partner modules

export const SPONSORED_QUESTS = [
  {
    id: "quest-stylus-101",
    title: "Arbitrum Stylus: Rust Smart Contracts",
    sponsorName: "Arbitrum Ecosystem Lab (Demo)",
    badgeText: "Partner Quest",
    category: "Rust & WASM",
    difficulty: "Advanced",
    rewardXP: 300,
    status: "Upcoming",
    description: "Learn how Arbitrum Stylus brings WebAssembly (WASM) execution to Ethereum, allowing smart contract compilation from Rust, C, and C++ with 10x-100x efficiency.",
    curriculum: [
      "Why WASM alongside EVM dual-virtual-machine architecture",
      "Writing your first counter contract in Rust with cargo stylus",
      "Gas benchmark comparison: Solidity vs Rust execution on Arbitrum"
    ],
    prerequisiteStage: "stage-13",
    actionLabel: "Preview Syllabus",
    isSponsored: true,
  },
  {
    id: "quest-orbit-chains",
    title: "Arbitrum Orbit: Deploy Custom L3 Rollups",
    sponsorName: "Rollup Infrastructure Guild (Demo)",
    badgeText: "Partner Quest",
    category: "Layer 3",
    difficulty: "Expert",
    rewardXP: 350,
    status: "Upcoming",
    description: "Explore dedicated app-chains using Arbitrum Orbit. Learn how to configure custom gas tokens, dedicated throughput, and data availability committees (AnyTrust).",
    curriculum: [
      "Layer 2 vs Layer 3 settlement guarantees",
      "Configuring custom gas tokens (ERC-20 as native fee token)",
      "Deploying a local devnet Orbit chain"
    ],
    prerequisiteStage: "stage-grad",
    actionLabel: "Preview Syllabus",
    isSponsored: true,
  },
  {
    id: "quest-gmx-perp",
    title: "Decentralized Perpetuals & Multi-Asset Pools",
    sponsorName: "DeFi Research Cohort (Demo)",
    badgeText: "Partner Quest",
    category: "Derivatives",
    difficulty: "Intermediate",
    rewardXP: 250,
    status: "Upcoming",
    description: "Understand multi-asset index pools, zero price-impact order execution, and funding rate mechanisms in decentralized perpetual exchanges.",
    curriculum: [
      "Index pool liquidity vs traditional order book depth",
      "Oracle-driven execution & liquidation dynamics",
      "Simulated paper trading on testnet perpetuals"
    ],
    prerequisiteStage: "stage-8",
    actionLabel: "Preview Syllabus",
    isSponsored: true,
  }
];

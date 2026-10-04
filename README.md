# Arbitrum Web3 Learning Map

> **From Zero to Onchain**  
> An interactive onchain learning journey built for the **Arbitrum Buidathon 2026**.

---

## 🌟 Overview

**Arbitrum Web3 Learning Map** is a gamified, interactive educational platform that guides complete beginners from having zero Web3 knowledge to confidently executing verified onchain actions on Arbitrum Sepolia.

Instead of passive video lectures or generic documentation, learners progress through an interconnected world map of learning nodes following the core product loop:

$$\text{Learn} \longrightarrow \text{Practice} \longrightarrow \text{Perform} \longrightarrow \text{Verify} \longrightarrow \text{Earn XP} \longrightarrow \text{Unlock}$$

The curriculum progresses systematically through:
1. **The Sandbox (Zone 0)**: 100% zero-risk local simulation of cryptographic keypairs, message signing, and transactions.
2. **Arbitrum Sepolia Testnet (Zones 1-4)**: Real non-custodial wallet connection, gas mechanics, token claims, DEX swaps, liquidity provision, staking, and NFT minting.
3. **Security Lab (Zone 5)**: Hands-on defense against phishing, malicious approvals, and seed phrase compromise.
4. **Mainnet Readiness (Zone 7)**: Verified checklist and conscious graduation to Arbitrum One.

---

## 🛠️ Architecture

```text
React (ESM + JSX) + Vite + Tailwind CSS
                  ↓
          Wagmi v2 + Viem
                  ↓
    Non-Custodial External Wallet (MetaMask / EIP-1193)
                  ↓
       Arbitrum Sepolia (Nitro L2)
                  ↓
      Educational Smart Contracts
  ├── LearnToken.sol (ERC-20)
  ├── LearnUSD.sol (ERC-20 Stablecoin)
  ├── SimpleAMM.sol (Constant Product x*y=k)
  ├── StakingLab.sol (Yield & Lock Timers)
  ├── AchievementNFT.sol (ERC-721 SVG Badge)
  └── SimpleMarketplace.sol (Escrow & Atomic Trades)
```

- **Pure Frontend Architecture**: No backend server, no custodial wallet, no cloud databases.
- **Client Persistence**: Versioned `localStorage` handles XP, stage completion, and transaction history.
- **Onchain Verification**: Blockchain state is read directly from Arbitrum Sepolia via Wagmi/Viem and verified on Arbiscan.

---

## 📜 Smart Contracts

All smart contracts are located in `/contracts` and built using OpenZeppelin standards:

| Contract | Standard / Type | Description |
| :--- | :--- | :--- |
| **`LearnToken.sol`** | ERC-20 (`LEARN`) | Educational testnet token. Includes 1-time `claimFaucet()` of 1,000 LEARN per address. |
| **`LearnUSD.sol`** | ERC-20 (`LUSD`) | Educational simulated USD token for DEX swaps and NFT purchases. |
| **`SimpleAMM.sol`** | Constant-Product DEX ($x \cdot y = k$) | Demonstrates automated market making, reserves, LP minting, 0.3% fees, and slippage protection. |
| **`StakingLab.sol`** | DeFi Staking Vault | Demonstrates time-locked token staking (60s demo lock), educational reward distribution, and reentrancy protection. |
| **`AchievementNFT.sol`** | ERC-721 Badge (`AW3F`) | Mints the verified "Arbitrum Web3 Foundations" badge with onchain vector SVG artwork. 1 per address. |
| **`SimpleMarketplace.sol`** | NFT Escrow Market | Facilitates fixed-price listing and atomic purchase of Achievement NFTs using LearnUSD. |

---

## 🗺️ Curriculum Map & Zones

- **Zone 0: The Sandbox** (Stage 00: Web3 Wallet Basics - Simulated keypairs & signatures)
- **Zone 1: Arbitrum Foundations** (Stage 01: Connect Wallet, Stage 02: Network & Nitro Architecture, Stage 03: Gas & Nitro Efficiency, Stage 04: First Onchain Transaction)
- **Zone 2: Token Lab** (Stage 05: ERC-20 Fungible Tokens, Stage 06: Token Transfers & State, Stage 07: Approval & Allowance Lifecycle)
- **Zone 3: DeFi Lab** (Stage 08: Decentralized Exchange & AMM, Stage 09: Liquidity Provision, Stage 10: Staking & Yield Mechanics)
- **Zone 4: Digital Ownership** (Stage 11: NFTs & Provable Ownership, Stage 12: NFT Marketplace & Escrow)
- **Zone 5: Security Lab** (Stage 13: Security Mastery: Phishing Detector, Approval Risk Analyzer, Seed Hygiene)
- **Zone 6: Advanced Web3 (Preview)** (Stage 14: Lending & Money Markets, Stage 15: Nitro Bridge & Outbox)
- **Zone 7: Mainnet Graduation** (Stage ★: Mainnet Readiness Checklist & Arbitrum One Transition)

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Contract Tests
```bash
npm test
```

### 5. Build for Production
```bash
npm run build
```

---

## 🔒 Security & Disclaimers

1. **Test Tokens Have Zero Value**: LearnToken (LEARN) and LearnUSD (LUSD) are educational testnet tokens with no financial value.
2. **Non-Custodial**: This application never generates, requests, or stores private keys or seed phrases.
3. **Educational MVP**: Contracts are built for hackathon demonstration and educational practice; they are not audited for real-money production use.
4. **Mainnet Transition**: Mainnet is presented solely as a graduation readiness checklist; no real-money transactions are requested or incentivized.

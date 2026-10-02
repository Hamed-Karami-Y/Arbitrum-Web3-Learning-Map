// src/data/stages.js
// Data-driven quest and stage registry for Arbitrum Web3 Learning Map

export const ZONES = [
  {
    id: 0,
    name: "Zone 0",
    title: "The Sandbox",
    subtitle: "Safe Zero-Risk Simulation",
    badge: "Sandbox",
    accentColor: "from-emerald-500/20 to-teal-500/5",
    borderHighlight: "border-emerald-500/30",
    glowColor: "glow-green",
    description: "Learn Web3 mechanics in a completely safe, local simulation before touching real blockchain networks.",
  },
  {
    id: 1,
    name: "Zone 1",
    title: "Arbitrum Foundations",
    subtitle: "Network, Gas & First Tx",
    badge: "Foundations",
    accentColor: "from-blue-600/20 to-indigo-600/5",
    borderHighlight: "border-blue-500/30",
    glowColor: "glow-blue",
    description: "Connect your non-custodial wallet, inspect Arbitrum Nitro architecture, get test ETH, and submit your first verified onchain transaction.",
  },
  {
    id: 2,
    name: "Zone 2",
    title: "Token Lab",
    subtitle: "ERC-20 Fungible Assets",
    badge: "Tokens",
    accentColor: "from-cyan-500/20 to-blue-500/5",
    borderHighlight: "border-cyan-500/30",
    glowColor: "glow-cyan",
    description: "Claim educational LEARN tokens, execute onchain transfers, inspect allowances, and master smart contract approvals.",
  },
  {
    id: 3,
    name: "Zone 3",
    title: "DeFi Lab",
    subtitle: "Automated Markets & Yield",
    badge: "DeFi",
    accentColor: "from-violet-600/20 to-purple-600/5",
    borderHighlight: "border-purple-500/30",
    glowColor: "glow-blue",
    description: "Experience decentralized finance hands-on: swap tokens on an educational AMM, provide liquidity, and stake for rewards.",
  },
  {
    id: 4,
    name: "Zone 4",
    title: "Digital Ownership",
    subtitle: "ERC-721 NFTs & Marketplace",
    badge: "NFTs",
    accentColor: "from-pink-500/20 to-rose-500/5",
    borderHighlight: "border-pink-500/30",
    glowColor: "glow-amber",
    description: "Mint your verified educational achievement badge onchain and test atomic NFT listing and purchasing in an escrow marketplace.",
  },
  {
    id: 5,
    name: "Zone 5",
    title: "Security Lab",
    subtitle: "Threats, Phishing & Revoke",
    badge: "Security",
    accentColor: "from-amber-500/20 to-orange-500/5",
    borderHighlight: "border-amber-500/30",
    glowColor: "glow-amber",
    description: "Protect your assets. Learn to spot phishing signatures, analyze malicious token approvals, and revoke dangerous permissions.",
  },
  {
    id: 6,
    name: "Zone 6",
    title: "Advanced Web3",
    subtitle: "Protocols, Bridges & DAOs",
    badge: "Advanced",
    accentColor: "from-slate-600/20 to-slate-800/5",
    borderHighlight: "border-slate-600/30",
    glowColor: "",
    description: "Preview advanced topics: cross-chain Nitro bridges, lending money markets, stablecoins, and decentralized governance.",
  },
  {
    id: 7,
    name: "Graduation",
    title: "Mainnet Readiness",
    subtitle: "From Zero to Confident",
    badge: "Mainnet",
    accentColor: "from-sky-400/25 to-blue-600/10",
    borderHighlight: "border-sky-400/40",
    glowColor: "glow-cyan",
    description: "Review your completed skills checklist and prepare for conscious, secure exploration of Arbitrum One.",
  }
];

export const STAGES = [
  // ZONE 0
  {
    id: "stage-0",
    zone: 0,
    stageNumber: "00",
    title: "Web3 Wallet Basics",
    tagline: "Cryptographic identities, keys & signatures without risk",
    category: "Sandbox",
    difficulty: "Beginner",
    xp: 50,
    prerequisites: [],
    type: "sandbox",
    description: "Understand public keys, private keys, seed phrases, and cryptographic signatures in a safe sandbox simulation before touching real blockchain networks.",
    lesson: {
      summary: "In Web3, your wallet is not a cloud account with a username and password. It is a cryptographic keypair managed on your device.",
      keyConcepts: [
        { term: "Public Address", def: "Your public account identifier (like an email address or bank IBAN). Safe to share." },
        { term: "Private Key", def: "A 256-bit secret number that signs transactions. Anyone with this key controls all funds. NEVER share it." },
        { term: "Seed Phrase", def: "A 12 or 24 word mnemonic that generates all your private keys. Store offline on paper/metal. NEVER enter on any website." },
        { term: "Digital Signature", def: "Mathematical proof using your private key that proves you authorized a specific message or transaction." }
      ]
    },
    task: "Generate a simulated sandbox keypair, sign a test message, and execute a simulated transaction.",
    isCore: true,
  },

  // ZONE 1
  {
    id: "stage-1",
    zone: 1,
    stageNumber: "01",
    title: "Connect Wallet",
    tagline: "Link your non-custodial browser wallet to Arbitrum",
    category: "Onchain",
    difficulty: "Beginner",
    xp: 50,
    prerequisites: ["stage-0"],
    type: "onchain",
    description: "Connect MetaMask or any EIP-1193 browser wallet to the application using standard wagmi and viem Web3 libraries.",
    lesson: {
      summary: "Connecting your wallet does NOT expose your private keys or give the application permission to spend your funds. It only shares your public address and requests network details.",
      keyConcepts: [
        { term: "Non-Custodial", def: "You retain 100% control over your assets. The website cannot move funds without explicit wallet confirmation." },
        { term: "EIP-1193 Provider", def: "The standard browser JavaScript bridge (window.ethereum) used by wallets like MetaMask, Rabby, and Coinbase Wallet." }
      ]
    },
    task: "Connect your wallet and ensure you are connected to Arbitrum Sepolia.",
    isCore: true,
  },
  {
    id: "stage-2",
    zone: 1,
    stageNumber: "02",
    title: "Network & Nitro Architecture",
    tagline: "Understand L2 rollups, Chain ID, RPC, and Arbiscan",
    category: "Foundations",
    difficulty: "Beginner",
    xp: 75,
    prerequisites: ["stage-1"],
    type: "lesson",
    description: "Learn how Arbitrum Layer 2 executes transactions with sub-second finality while inheriting Ethereum's robust security.",
    lesson: {
      summary: "Arbitrum is an Optimistic Rollup (L2) powered by the Nitro tech stack. It handles computation and execution off-chain at high speed, then batches and posts cryptographic fraud proofs to Ethereum Layer 1.",
      keyConcepts: [
        { term: "Chain ID 421614", def: "The unique network identifier for Arbitrum Sepolia. Prevents transaction replay attacks between chains." },
        { term: "RPC Endpoint", def: "Remote Procedure Call server that broadcasts transactions and queries blockchain state." },
        { term: "Arbiscan", def: "The premier block explorer for Arbitrum. Lets you independently inspect blocks, transactions, contracts, and gas metrics." }
      ]
    },
    task: "Verify that your wallet RPC matches Arbitrum Sepolia Chain ID (421614) and explore Arbiscan.",
    isCore: true,
  },
  {
    id: "stage-3",
    zone: 1,
    stageNumber: "03",
    title: "Gas & Nitro Efficiency",
    tagline: "Why gas exists and how Arbitrum reduces fees by 95%+",
    category: "Foundations",
    difficulty: "Beginner",
    xp: 50,
    prerequisites: ["stage-2"],
    type: "onchain",
    description: "Understand gas units, base fees, and how Arbitrum separates L1 calldata posting costs from L2 computation fees. Obtain free testnet ETH.",
    lesson: {
      summary: "Every transaction requires computation and storage on hundreds of nodes. Gas is the fee paid in native ETH to compensate the network and prevent denial-of-service spam.",
      keyConcepts: [
        { term: "Gas Units", def: "The amount of computational effort a transaction takes (e.g. 21,000 gas for a simple ETH transfer)." },
        { term: "L1 Calldata Cost", def: "The cost of posting compressed transaction data to Ethereum Layer 1 for permanent availability." },
        { term: "Testnet Faucet", def: "A free automated dispenser that distributes test ETH for educational and developer testing." }
      ]
    },
    task: "Acquire free test ETH from the official Arbitrum Sepolia faucet and verify your test balance.",
    isCore: true,
  },
  {
    id: "stage-4",
    zone: 1,
    stageNumber: "04",
    title: "First Onchain Transaction",
    tagline: "Execute, broadcast, and verify your first real testnet tx",
    category: "Onchain",
    difficulty: "Intermediate",
    xp: 150,
    prerequisites: ["stage-3"],
    type: "onchain",
    description: "Experience the full transaction lifecycle: Prepare → Review → Sign in Wallet → Broadcast → Confirmed on Arbiscan.",
    lesson: {
      summary: "You are about to write your first immutable record to the Arbitrum Sepolia blockchain. Once confirmed, it is permanently verifiable worldwide.",
      keyConcepts: [
        { term: "Transaction Hash", def: "A unique 64-character hexadecimal SHA-256 identifier generated for every broadcast transaction." },
        { term: "Nonce", def: "Sequential counter tracking how many transactions your address has sent. Prevents double-spending." },
        { term: "Receipt & Gas Used", def: "The finalized proof of execution containing exact gas consumed, block number, and emitted events." }
      ]
    },
    task: "Send 0.0001 test ETH (to yourself or demo peer) and inspect your finalized transaction on Arbiscan.",
    isCore: true,
  },

  // ZONE 2
  {
    id: "stage-5",
    zone: 2,
    stageNumber: "05",
    title: "ERC-20 Fungible Tokens",
    tagline: "The foundation of tokens: balance, decimals, and supply",
    category: "Tokens",
    difficulty: "Intermediate",
    xp: 100,
    prerequisites: ["stage-4"],
    type: "onchain",
    description: "Learn how ERC-20 smart contracts manage token balances, minting, and transfer logic. Claim 1,000 educational LEARN tokens.",
    lesson: {
      summary: "ERC-20 is the universal technical standard for fungible tokens on EVM blockchains. Each token is identical and interchangeable.",
      keyConcepts: [
        { term: "Decimals (18)", def: "Tokens represent fractions using integers. 1 LEARN = 1,000,000,000,000,000,000 base units (10^18)." },
        { term: "balanceOf(address)", def: "A public view function that returns how many tokens an address holds in the contract's internal ledger." },
        { term: "Testnet Token", def: "LearnToken (LEARN) has zero monetary value and exists strictly for educational practice." }
      ]
    },
    task: "Call claimFaucet() on the LearnToken contract to receive 1,000 LEARN tokens.",
    isCore: true,
  },
  {
    id: "stage-6",
    zone: 2,
    stageNumber: "06",
    title: "Token Transfer & State Changes",
    tagline: "Send tokens and inspect emitted Transfer events",
    category: "Tokens",
    difficulty: "Intermediate",
    xp: 100,
    prerequisites: ["stage-5"],
    type: "onchain",
    description: "Transfer LEARN tokens to a peer or demo recipient and analyze the emitted Transfer(from, to, value) event on Arbiscan.",
    lesson: {
      summary: "When you transfer tokens, the contract checks that you have sufficient balance, decreases your balance, increases the recipient's balance, and emits an event log.",
      keyConcepts: [
        { term: "Event Logs", def: "Indexed blockchain messages that frontends and indexers listen to for real-time state updates." },
        { term: "State Mutation", def: "Writing new values to the smart contract's persistent storage slots on the blockchain." }
      ]
    },
    task: "Send 50 LEARN to a study partner or demo recipient and review the receipt.",
    isCore: true,
  },
  {
    id: "stage-7",
    zone: 2,
    stageNumber: "07",
    title: "Approval & Allowance Lifecycle",
    tagline: "Understand approvals, transferFrom, and revoking permissions",
    category: "Tokens",
    difficulty: "Intermediate",
    xp: 100,
    prerequisites: ["stage-6"],
    type: "onchain",
    description: "Master the approval mechanism: why smart contracts need permission to move your tokens, how allowance works, and how to revoke.",
    lesson: {
      summary: "Smart contracts cannot take tokens from your wallet without your explicit prior permission. approve(spender, amount) sets an allowance, enabling transferFrom().",
      keyConcepts: [
        { term: "approve()", def: "Authorizes a spender contract (e.g. AMM or Staking) to withdraw up to a specified maximum of your tokens." },
        { term: "allowance()", def: "Checks remaining approved spend limit. Decreases as the contract spends your tokens." },
        { term: "Revoke", def: "Resetting allowance to 0. Essential Web3 security hygiene when you finish interacting with a dApp." }
      ]
    },
    task: "Approve 100 LEARN to the educational SimpleAMM contract, check the allowance, and test revoking.",
    isCore: true,
  },

  // ZONE 3
  {
    id: "stage-8",
    zone: 3,
    stageNumber: "08",
    title: "Decentralized Exchange & AMM",
    tagline: "Constant-product market making: swap LEARN for LearnUSD",
    category: "DeFi",
    difficulty: "Intermediate",
    xp: 200,
    prerequisites: ["stage-7"],
    type: "onchain",
    description: "Interact with an educational constant-product Automated Market Maker (x * y = k). Swap LEARN for LearnUSD with slippage protection.",
    lesson: {
      summary: "Traditional exchanges use centralized order books with market makers. AMMs use mathematical liquidity pools that allow automated, permissionless swaps 24/7.",
      keyConcepts: [
        { term: "x * y = k", def: "The constant-product formula invented by Uniswap. The product of both token reserves must remain constant before fees." },
        { term: "Price Impact", def: "The percentage price shift caused by the size of your trade relative to the pool reserves." },
        { term: "Slippage Tolerance", def: "The maximum price change you are willing to accept before the transaction reverts (protects against frontrunning)." }
      ]
    },
    task: "Perform an educational swap of 25 LEARN for LearnUSD on the SimpleAMM contract.",
    isCore: true,
  },
  {
    id: "stage-9",
    zone: 3,
    stageNumber: "09",
    title: "Liquidity Provision & LP Shares",
    tagline: "Deposit token pairs, earn swap fees, understand Impermanent Loss",
    category: "DeFi",
    difficulty: "Advanced",
    xp: 150,
    prerequisites: ["stage-8"],
    type: "onchain",
    description: "Deposit paired assets into the liquidity pool to become a liquidity provider (LP). Track pool shares and understand Impermanent Loss.",
    lesson: {
      summary: "Liquidity providers deposit proportional amounts of both tokens into the pool. In return, they receive LP shares representing their ownership percentage and earn 0.3% fees on every swap.",
      keyConcepts: [
        { term: "LP Shares", def: "Cryptographic receipts proving your proportional claim on the underlying token reserves." },
        { term: "Impermanent Loss (IL)", def: "The difference in portfolio value between holding tokens versus providing liquidity when prices diverge." }
      ]
    },
    task: "Deposit 50 LEARN and 50 LUSD into the SimpleAMM pool to mint LP shares.",
    isCore: true,
  },
  {
    id: "stage-10",
    zone: 3,
    stageNumber: "10",
    title: "Staking & Yield Mechanics",
    tagline: "Lock tokens, track reward accumulation, and claim yield safely",
    category: "DeFi",
    difficulty: "Advanced",
    xp: 200,
    prerequisites: ["stage-9"],
    type: "onchain",
    description: "Stake LEARN tokens in the StakingLab contract. Experience lock periods, reward rate accumulation, and safe unstaking.",
    lesson: {
      summary: "Staking locks tokens in a contract to provide utility or security, distributing rewards over time based on duration and amount staked.",
      keyConcepts: [
        { term: "Lock Period", def: "A time lock during which principal cannot be withdrawn (demonstrated here with a fast 60s demo lock)." },
        { term: "Reentrancy Guard", def: "Security protection preventing attackers from re-calling the withdraw function before balance updates." }
      ]
    },
    task: "Stake 50 LEARN, wait for the educational lock, claim your test rewards, and unstake.",
    isCore: true,
  },

  // ZONE 4
  {
    id: "stage-11",
    zone: 4,
    stageNumber: "11",
    title: "NFTs & Provable Ownership",
    tagline: "Mint your onchain 'Arbitrum Web3 Foundations' badge",
    category: "Ownership",
    difficulty: "Intermediate",
    xp: 250,
    prerequisites: ["stage-10"],
    type: "onchain",
    description: "Learn ERC-721 non-fungible token mechanics, unique token IDs, and onchain SVG metadata. Mint your milestone badge.",
    lesson: {
      summary: "Unlike ERC-20 tokens where every unit is identical, ERC-721 tokens represent unique digital assets with individual token IDs and metadata.",
      keyConcepts: [
        { term: "ERC-721", def: "The gold standard for unique digital collectibles, certificates, domain names, and gaming items." },
        { term: "tokenURI", def: "A function that returns JSON metadata describing the name, image URL, and attributes of each token." },
        { term: "Onchain SVG", def: "Vector graphics stored directly inside contract bytecode for 100% censorship-resistant permanence." }
      ]
    },
    task: "Mint the verified 'Arbitrum Web3 Foundations' NFT badge directly to your connected address.",
    isCore: true,
  },
  {
    id: "stage-12",
    zone: 4,
    stageNumber: "12",
    title: "NFT Marketplace & Escrow",
    tagline: "List, buy, and execute safe atomic asset trades",
    category: "Ownership",
    difficulty: "Advanced",
    xp: 250,
    prerequisites: ["stage-11"],
    type: "onchain",
    description: "Experience how decentralized marketplaces facilitate atomic swaps of NFTs for payment tokens using smart contract escrow.",
    lesson: {
      summary: "Decentralized marketplaces eliminate counterparty risk: the buyer pays tokens, the seller delivers the NFT, and the smart contract swaps both simultaneously in a single atomic transaction.",
      keyConcepts: [
        { term: "Atomic Swap", def: "Both sides of the trade either execute together or revert entirely if any condition fails." },
        { term: "Fixed-Price Listing", def: "The seller specifies an exact price in payment tokens (LUSD) for anyone to purchase instantly." }
      ]
    },
    task: "Create an active listing or purchase an educational badge on the SimpleMarketplace contract.",
    isCore: true,
  },

  // ZONE 5
  {
    id: "stage-13",
    zone: 5,
    stageNumber: "13",
    title: "Security Mastery & Threat Lab",
    tagline: "Phishing, signature inspection, approval drains & revoke",
    category: "Security",
    difficulty: "Mastery",
    xp: 300,
    prerequisites: ["stage-12"],
    type: "security",
    description: "Complete hands-on defense simulations: detect phishing signing requests, spot malicious unlimited allowances, and master wallet hygiene.",
    lesson: {
      summary: "In Web3, you are your own bank. Understanding common attack vectors—such as deceptive permit signatures and malicious drainer sites—is essential.",
      keyConcepts: [
        { term: "Blind Signing", def: "Signing a transaction or permit whose decoded data you cannot verify. Top cause of wallet drains." },
        { term: "Unlimited Allowance Drainer", def: "Malicious contracts prompting you to approve Max Uint256 tokens, allowing them to steal your funds later." },
        { term: "Revoke.cash", def: "A popular security tool used to audit and revoke active allowances across all EVM networks." }
      ]
    },
    task: "Complete the 4-part Threat Simulator and achieve 100% security score.",
    isCore: true,
  },

  // ZONE 6 (Preview / Advanced)
  {
    id: "stage-14",
    zone: 6,
    stageNumber: "14",
    title: "Lending & Money Markets",
    tagline: "Collateralized borrowing, LTV, and liquidation health factors",
    category: "Advanced",
    difficulty: "Coming Next",
    xp: 100,
    prerequisites: ["stage-13"],
    type: "preview",
    description: "Explore how decentralized lending protocols (like Aave and Silo on Arbitrum) enable over-collateralized borrowing and interest yields.",
    lesson: {
      summary: "Users deposit crypto collateral to borrow other assets up to a strict Loan-to-Value (LTV) ratio. If collateral value drops, liquidators repay the loan to protect lenders.",
      keyConcepts: [
        { term: "Loan-to-Value (LTV)", def: "The maximum ratio you can borrow against collateral (e.g. 75% LTV on ETH)." },
        { term: "Health Factor", def: "Safety margin metric. Below 1.0 triggers automated liquidation." }
      ]
    },
    task: "Advanced module: Review lending mechanics and protocol documentation.",
    isCore: false,
  },
  {
    id: "stage-15",
    zone: 6,
    stageNumber: "15",
    title: "Arbitrum Nitro Bridge",
    tagline: "Cross-chain messaging, rollup inbox/outbox, and fraud proofs",
    category: "Advanced",
    difficulty: "Coming Next",
    xp: 100,
    prerequisites: ["stage-13"],
    type: "preview",
    description: "Understand the native Arbitrum bridge architecture: how tokens deposit via the L1 Inbox and withdraw through the 7-day dispute window Outbox.",
    lesson: {
      summary: "Arbitrum's native bridge uses cryptographic inbox and outbox contracts on Ethereum L1 to ensure trustless cross-chain state verification.",
      keyConcepts: [
        { term: "Dispute Window", def: "The 7-day challenge period required for optimistic rollup fraud proof verification on L1." },
        { term: "Fast Liquidity Bridges", def: "Third-party protocols (Hop, Across) that provide instant liquidity for small fee premiums." }
      ]
    },
    task: "Advanced module: Review bridge architecture and Arbitrum documentation.",
    isCore: false,
  },

  // ZONE 7 (Mainnet Graduation)
  {
    id: "stage-grad",
    zone: 7,
    stageNumber: "★",
    title: "Mainnet Ready: Arbitrum One",
    tagline: "Review graduation checklist & transition safely to mainnet",
    category: "Graduation",
    difficulty: "Milestone",
    xp: 250,
    prerequisites: ["stage-13"],
    type: "graduation",
    description: "Confirm your foundational Web3 knowledge, review the safety checklist, and prepare for conscious exploration of Arbitrum One.",
    lesson: {
      summary: "Congratulations! You have progressed from zero Web3 knowledge through simulated keypairs, real Arbitrum Sepolia transactions, AMM swaps, staking, and threat detection.",
      keyConcepts: [
        { term: "Arbitrum One", def: "The premier Ethereum Layer 2 mainnet with billions in TVL and thousands of production dApps." },
        { term: "Real Gas & Asset Safety", def: "On mainnet, funds are real. Never sign what you don't understand and always verify URLs." }
      ]
    },
    task: "Complete your graduation checklist and claim your Arbitrum Web3 Graduate distinction.",
    isCore: true,
  }
];

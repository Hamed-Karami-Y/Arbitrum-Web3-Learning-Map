export const StakingLabABI = [
  {
    "type": "function",
    "name": "stakingToken",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "rewardToken",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalStaked",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "LOCK_DURATION",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "calculateReward",
    "inputs": [{ "name": "user", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getStakeInfo",
    "inputs": [{ "name": "user", "type": "address" }],
    "outputs": [
      { "name": "amount", "type": "uint256" },
      { "name": "lockedUntil", "type": "uint256" },
      { "name": "pending", "type": "uint256" },
      { "name": "isLocked", "type": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "stake",
    "inputs": [{ "name": "amount", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimReward",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "unstake",
    "inputs": [{ "name": "amount", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Staked",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": false },
      { "name": "lockedUntil", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "Unstaked",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "RewardClaimed",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": false }
    ]
  }
];

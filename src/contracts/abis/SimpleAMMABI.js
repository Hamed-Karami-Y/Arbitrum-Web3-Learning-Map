export const SimpleAMMABI = [
  {
    "type": "function",
    "name": "tokenA",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenB",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "reserveA",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "reserveB",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalShares",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "shares",
    "inputs": [{ "name": "provider", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getReserves",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "uint256" },
      { "name": "", "type": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAmountOut",
    "inputs": [
      { "name": "amountIn", "type": "uint256" },
      { "name": "resIn", "type": "uint256" },
      { "name": "resOut", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "addLiquidity",
    "inputs": [
      { "name": "amountA", "type": "uint256" },
      { "name": "amountB", "type": "uint256" },
      { "name": "minShares", "type": "uint256" }
    ],
    "outputs": [{ "name": "shareAmount", "type": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeLiquidity",
    "inputs": [
      { "name": "shareAmount", "type": "uint256" },
      { "name": "minAmountA", "type": "uint256" },
      { "name": "minAmountB", "type": "uint256" }
    ],
    "outputs": [
      { "name": "amountA", "type": "uint256" },
      { "name": "amountB", "type": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "swapAforB",
    "inputs": [
      { "name": "amountIn", "type": "uint256" },
      { "name": "minAmountOut", "type": "uint256" }
    ],
    "outputs": [{ "name": "amountOut", "type": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "swapBforA",
    "inputs": [
      { "name": "amountIn", "type": "uint256" },
      { "name": "minAmountOut", "type": "uint256" }
    ],
    "outputs": [{ "name": "amountOut", "type": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "LiquidityAdded",
    "inputs": [
      { "name": "provider", "type": "address", "indexed": true },
      { "name": "amountA", "type": "uint256", "indexed": false },
      { "name": "amountB", "type": "uint256", "indexed": false },
      { "name": "sharesMinted", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "Swapped",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true },
      { "name": "tokenIn", "type": "address", "indexed": false },
      { "name": "amountIn", "type": "uint256", "indexed": false },
      { "name": "tokenOut", "type": "address", "indexed": false },
      { "name": "amountOut", "type": "uint256", "indexed": false }
    ]
  }
];

export const SimpleMarketplaceABI = [
  {
    "type": "function",
    "name": "nftContract",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "paymentToken",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "listings",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [
      { "name": "seller", "type": "address" },
      { "name": "price", "type": "uint256" },
      { "name": "active", "type": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getListing",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [
      { "name": "seller", "type": "address" },
      { "name": "price", "type": "uint256" },
      { "name": "active", "type": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "listNFT",
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "price", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "cancelListing",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "buyNFT",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ListingCreated",
    "inputs": [
      { "name": "seller", "type": "address", "indexed": true },
      { "name": "tokenId", "type": "uint256", "indexed": true },
      { "name": "price", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "ListingCancelled",
    "inputs": [
      { "name": "seller", "type": "address", "indexed": true },
      { "name": "tokenId", "type": "uint256", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "NFTSold",
    "inputs": [
      { "name": "buyer", "type": "address", "indexed": true },
      { "name": "seller", "type": "address", "indexed": true },
      { "name": "tokenId", "type": "uint256", "indexed": true },
      { "name": "price", "type": "uint256", "indexed": false }
    ]
  }
];

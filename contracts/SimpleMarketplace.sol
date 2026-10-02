// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SimpleMarketplace
 * @notice Educational NFT Marketplace for the Arbitrum Web3 Learning Map.
 * @dev Trades AchievementNFT badges using LearnUSD test tokens.
 */
contract SimpleMarketplace is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC721 public immutable nftContract;
    IERC20 public immutable paymentToken;

    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    // tokenId => Listing
    mapping(uint256 => Listing) public listings;

    event ListingCreated(address indexed seller, uint256 indexed tokenId, uint256 price);
    event ListingCancelled(address indexed seller, uint256 indexed tokenId);
    event NFTSold(address indexed buyer, address indexed seller, uint256 indexed tokenId, uint256 price);

    constructor(address _nftContract, address _paymentToken) {
        require(_nftContract != address(0) && _paymentToken != address(0), "Marketplace: Invalid addresses");
        nftContract = IERC721(_nftContract);
        paymentToken = IERC20(_paymentToken);
    }

    /**
     * @notice Lists an NFT for sale at a fixed price in payment tokens.
     */
    function listNFT(uint256 tokenId, uint256 price) external nonReentrant {
        require(price > 0, "Marketplace: Price must be greater than zero");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Marketplace: Not token owner");
        require(
            nftContract.getApproved(tokenId) == address(this) || nftContract.isApprovedForAll(msg.sender, address(this)),
            "Marketplace: Marketplace not approved for transfer"
        );

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });

        emit ListingCreated(msg.sender, tokenId, price);
    }

    /**
     * @notice Cancels an active listing.
     */
    function cancelListing(uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Marketplace: Listing is not active");
        require(listing.seller == msg.sender, "Marketplace: Only seller can cancel");

        listing.active = false;
        emit ListingCancelled(msg.sender, tokenId);
    }

    /**
     * @notice Buys an active NFT listing with payment tokens.
     */
    function buyNFT(uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Marketplace: Listing is not active");
        require(listing.seller != msg.sender, "Marketplace: Cannot buy own listing");

        address seller = listing.seller;
        uint256 price = listing.price;

        // Verify seller is still owner
        require(nftContract.ownerOf(tokenId) == seller, "Marketplace: Seller no longer owns NFT");

        listing.active = false;

        // Transfer payment token from buyer to seller
        paymentToken.safeTransferFrom(msg.sender, seller, price);

        // Transfer NFT from seller to buyer
        nftContract.safeTransferFrom(seller, msg.sender, tokenId);

        emit NFTSold(msg.sender, seller, tokenId, price);
    }

    function getListing(uint256 tokenId) external view returns (address seller, uint256 price, bool active) {
        Listing memory l = listings[tokenId];
        return (l.seller, l.price, l.active);
    }
}

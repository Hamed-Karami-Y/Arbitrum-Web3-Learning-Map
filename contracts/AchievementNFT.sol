// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title AchievementNFT
 * @notice Educational ERC-721 badge for the Arbitrum Web3 Learning Map.
 * @dev Mints an educational milestone badge "Arbitrum Web3 Foundations".
 * Note: Educational achievement for the MVP, not a professional financial certification.
 */
contract AchievementNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    mapping(address => bool) public hasMinted;
    mapping(address => uint256) public userTokenId;

    event AchievementMinted(address indexed user, uint256 indexed tokenId);

    constructor() ERC721("Arbitrum Web3 Foundations", "AW3F") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    /**
     * @notice Mints the educational milestone badge for the sender.
     * @dev Limited to 1 per address.
     */
    function mintAchievement() external returns (uint256) {
        require(!hasMinted[msg.sender], "AchievementNFT: Milestone already minted for this address");

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        hasMinted[msg.sender] = true;
        userTokenId[msg.sender] = tokenId;

        _safeMint(msg.sender, tokenId);

        emit AchievementMinted(msg.sender, tokenId);
        return tokenId;
    }

    /**
     * @notice Generates onchain SVG and metadata JSON.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);

        string memory name = string.concat("Arbitrum Web3 Foundations #", tokenId.toString());
        string memory description = "Verified educational achievement badge on Arbitrum Sepolia for completing the core onchain curriculum.";

        // SVG Badge graphic
        string memory svg = string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">',
            '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="#0a192f"/><stop offset="100%" stop-color="#1e3a8a"/>',
            '</linearGradient></defs>',
            '<rect width="400" height="400" rx="30" fill="url(#g)" stroke="#22d3ee" stroke-width="4"/>',
            '<circle cx="200" cy="160" r="70" fill="none" stroke="#3b82f6" stroke-width="6" stroke-dasharray="8 6"/>',
            '<polygon points="200,110 240,190 160,190" fill="#06b6d4" opacity="0.8"/>',
            '<text x="200" y="270" text-anchor="middle" fill="#f8fafc" font-family="monospace" font-size="20" font-weight="bold">ARBITRUM GRADUATE</text>',
            '<text x="200" y="300" text-anchor="middle" fill="#93c5fd" font-family="sans-serif" font-size="14">Foundations Milestone #',
            tokenId.toString(),
            '</text>',
            '<text x="200" y="340" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="11">VERIFIED ONCHAIN BADGE</text>',
            '</svg>'
        );

        string memory imageUri = string.concat("data:image/svg+xml;base64,", Base64.encode(bytes(svg)));

        string memory json = Base64.encode(
            bytes(
                string.concat(
                    '{"name":"', name,
                    '","description":"', description,
                    '","image":"', imageUri,
                    '","attributes":[{"trait_type":"Curriculum","value":"Arbitrum Foundations"},{"trait_type":"Level","value":"Zero to Onchain"}]}'
                )
            )
        );

        return string.concat("data:application/json;base64,", json);
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }
}

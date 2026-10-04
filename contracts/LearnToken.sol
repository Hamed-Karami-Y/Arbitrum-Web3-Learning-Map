// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LearnToken (LEARN)
 * @notice Educational testnet token for Arbitrum Web3 Learning Map.
 * @dev TESTNET EDUCATIONAL TOKEN — NO REAL-WORLD MONETARY VALUE.
 */
contract LearnToken is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 1000 * 10 ** 18;
    mapping(address => bool) public hasClaimed;

    event TokensClaimed(address indexed user, uint256 amount);

    constructor() ERC20("LearnToken", "LEARN") Ownable(msg.sender) {
        // Mint initial supply to deployer to seed liquidity and staking rewards
        _mint(msg.sender, 1_000_000 * 10 ** 18);
    }

    /**
     * @notice Allows each address to claim 1,000 LEARN once for educational tasks.
     */
    function claimFaucet() external {
        require(!hasClaimed[msg.sender], "LearnToken: Faucet already claimed by this address");
        hasClaimed[msg.sender] = true;
        _mint(msg.sender, FAUCET_AMOUNT);
        emit TokensClaimed(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @notice Admin minting for protocol reserves, test pools, or faucets.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

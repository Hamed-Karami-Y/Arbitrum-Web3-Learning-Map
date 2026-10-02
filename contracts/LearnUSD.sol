// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LearnUSD (LUSD)
 * @notice Educational testnet stablecoin simulation for AMM and Marketplace practice.
 * @dev TESTNET EDUCATIONAL TOKEN — NO REAL-WORLD MONETARY VALUE.
 */
contract LearnUSD is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 2000 * 10 ** 18;
    mapping(address => bool) public hasClaimed;

    event TokensClaimed(address indexed user, uint256 amount);

    constructor() ERC20("Learn USD", "LUSD") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** 18);
    }

    /**
     * @notice Allows each address to claim 2,000 LUSD once for educational swaps and purchases.
     */
    function claimFaucet() external {
        require(!hasClaimed[msg.sender], "LearnUSD: Faucet already claimed by this address");
        hasClaimed[msg.sender] = true;
        _mint(msg.sender, FAUCET_AMOUNT);
        emit TokensClaimed(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @notice Admin minting for protocol reserves or liquidity seeding.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SimpleAMM
 * @notice Educational constant-product Automated Market Maker (x * y = k).
 * @dev Educational AMM for Arbitrum Web3 Learning Map. Not audited. Never use with real funds.
 */
contract SimpleAMM is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable tokenA; // e.g., LearnToken (LEARN)
    IERC20 public immutable tokenB; // e.g., LearnUSD (LUSD)

    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalShares;

    mapping(address => uint256) public shares;

    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB, uint256 sharesMinted);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB, uint256 sharesBurned);
    event Swapped(address indexed user, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut);

    constructor(address _tokenA, address _tokenB) {
        require(_tokenA != address(0) && _tokenB != address(0), "SimpleAMM: Invalid token addresses");
        require(_tokenA != _tokenB, "SimpleAMM: Identical tokens");
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    /**
     * @notice Returns current token reserves.
     */
    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    /**
     * @notice Helper to calculate output amount given an input amount using constant product formula with 0.3% fee.
     */
    function getAmountOut(uint256 amountIn, uint256 resIn, uint256 resOut) public pure returns (uint256) {
        require(amountIn > 0, "SimpleAMM: Insufficient input amount");
        require(resIn > 0 && resOut > 0, "SimpleAMM: Insufficient liquidity");

        uint256 amountInWithFee = amountIn * 997;
        uint256 numerator = amountInWithFee * resOut;
        uint256 denominator = (resIn * 1000) + amountInWithFee;
        return numerator / denominator;
    }

    /**
     * @notice Adds liquidity to the pool.
     */
    function addLiquidity(uint256 amountA, uint256 amountB, uint256 minShares) external nonReentrant returns (uint256 shareAmount) {
        require(amountA > 0 && amountB > 0, "SimpleAMM: Zero liquidity not allowed");

        if (totalShares == 0) {
            shareAmount = _sqrt(amountA * amountB);
        } else {
            uint256 shareA = (amountA * totalShares) / reserveA;
            uint256 shareB = (amountB * totalShares) / reserveB;
            shareAmount = shareA < shareB ? shareA : shareB;
        }

        require(shareAmount >= minShares, "SimpleAMM: Slippage: Minted shares below minimum");
        require(shareAmount > 0, "SimpleAMM: Zero shares minted");

        tokenA.safeTransferFrom(msg.sender, address(this), amountA);
        tokenB.safeTransferFrom(msg.sender, address(this), amountB);

        reserveA += amountA;
        reserveB += amountB;
        totalShares += shareAmount;
        shares[msg.sender] += shareAmount;

        emit LiquidityAdded(msg.sender, amountA, amountB, shareAmount);
    }

    /**
     * @notice Removes liquidity from the pool.
     */
    function removeLiquidity(uint256 shareAmount, uint256 minAmountA, uint256 minAmountB) external nonReentrant returns (uint256 amountA, uint256 amountB) {
        require(shareAmount > 0, "SimpleAMM: Zero shares not allowed");
        require(shares[msg.sender] >= shareAmount, "SimpleAMM: Insufficient share balance");

        amountA = (shareAmount * reserveA) / totalShares;
        amountB = (shareAmount * reserveB) / totalShares;

        require(amountA >= minAmountA, "SimpleAMM: Slippage: Token A below minimum");
        require(amountB >= minAmountB, "SimpleAMM: Slippage: Token B below minimum");

        shares[msg.sender] -= shareAmount;
        totalShares -= shareAmount;
        reserveA -= amountA;
        reserveB -= amountB;

        tokenA.safeTransfer(msg.sender, amountA);
        tokenB.safeTransfer(msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB, shareAmount);
    }

    /**
     * @notice Swaps Token A for Token B.
     */
    function swapAforB(uint256 amountIn, uint256 minAmountOut) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "SimpleAMM: Amount in must be > 0");
        amountOut = getAmountOut(amountIn, reserveA, reserveB);
        require(amountOut >= minAmountOut, "SimpleAMM: Slippage limit exceeded");

        tokenA.safeTransferFrom(msg.sender, address(this), amountIn);
        reserveA += amountIn;
        reserveB -= amountOut;
        tokenB.safeTransfer(msg.sender, amountOut);

        emit Swapped(msg.sender, address(tokenA), amountIn, address(tokenB), amountOut);
    }

    /**
     * @notice Swaps Token B for Token A.
     */
    function swapBforA(uint256 amountIn, uint256 minAmountOut) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "SimpleAMM: Amount in must be > 0");
        amountOut = getAmountOut(amountIn, reserveB, reserveA);
        require(amountOut >= minAmountOut, "SimpleAMM: Slippage limit exceeded");

        tokenB.safeTransferFrom(msg.sender, address(this), amountIn);
        reserveB += amountIn;
        reserveA -= amountOut;
        tokenA.safeTransfer(msg.sender, amountOut);

        emit Swapped(msg.sender, address(tokenB), amountIn, address(tokenA), amountOut);
    }

    function _sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}

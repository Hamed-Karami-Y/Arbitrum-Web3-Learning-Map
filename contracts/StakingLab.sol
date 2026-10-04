// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StakingLab
 * @notice Educational staking contract for Arbitrum Web3 Learning Map.
 * @dev Allows users to stake LEARN, experience locking periods, calculate rewards, and claim test tokens.
 */
contract StakingLab is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardToken;

    // 100 LEARN earns 1 LEARN per hour for fast interactive testnet demonstration (1e18 per 3600 per 100e18)
    // Reward rate: ~0.000277 LEARN per second per 100 LEARN staked
    uint256 public rewardRatePerSecondPerToken = 2777777777777; // scaled
    uint256 public constant LOCK_DURATION = 60 seconds; // Short lock for interactive testnet demo

    struct StakeRecord {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
        uint256 lockedUntil;
    }

    mapping(address => StakeRecord) public stakes;
    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount, uint256 lockedUntil);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardFunded(address indexed funder, uint256 amount);

    constructor(address _stakingToken, address _rewardToken) Ownable(msg.sender) {
        require(_stakingToken != address(0) && _rewardToken != address(0), "StakingLab: Invalid token addresses");
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }

    /**
     * @notice Stakes LEARN tokens into the contract.
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "StakingLab: Cannot stake 0");

        StakeRecord storage userStake = stakes[msg.sender];

        // Claim existing pending rewards if already staking
        if (userStake.amount > 0) {
            uint256 pending = calculateReward(msg.sender);
            if (pending > 0) {
                _payoutReward(msg.sender, pending);
            }
        }

        userStake.amount += amount;
        userStake.startTime = block.timestamp;
        userStake.lastClaimTime = block.timestamp;
        userStake.lockedUntil = block.timestamp + LOCK_DURATION;
        totalStaked += amount;

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount, userStake.lockedUntil);
    }

    /**
     * @notice Calculates pending reward for a user.
     */
    function calculateReward(address user) public view returns (uint256) {
        StakeRecord memory userStake = stakes[user];
        if (userStake.amount == 0) return 0;

        uint256 timeElapsed = block.timestamp - userStake.lastClaimTime;
        // Simple formula: amount * elapsed * rate / 1e18
        uint256 reward = (userStake.amount * timeElapsed * rewardRatePerSecondPerToken) / 1e18;
        return reward;
    }

    /**
     * @notice Claims accumulated educational rewards without unstaking principal.
     */
    function claimReward() external nonReentrant returns (uint256) {
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "StakingLab: No reward to claim");

        stakes[msg.sender].lastClaimTime = block.timestamp;
        _payoutReward(msg.sender, reward);

        emit RewardClaimed(msg.sender, reward);
        return reward;
    }

    /**
     * @notice Unstakes principal tokens after lock duration has expired.
     */
    function unstake(uint256 amount) external nonReentrant {
        StakeRecord storage userStake = stakes[msg.sender];
        require(amount > 0, "StakingLab: Cannot unstake 0");
        require(userStake.amount >= amount, "StakingLab: Insufficient staked balance");
        require(block.timestamp >= userStake.lockedUntil, "StakingLab: Tokens are still locked");

        uint256 pending = calculateReward(msg.sender);
        userStake.amount -= amount;
        userStake.lastClaimTime = block.timestamp;
        totalStaked -= amount;

        if (pending > 0) {
            _payoutReward(msg.sender, pending);
        }

        stakingToken.safeTransfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    function _payoutReward(address to, uint256 amount) internal {
        uint256 balance = rewardToken.balanceOf(address(this));
        if (amount > balance) {
            amount = balance; // Pay out available test rewards
        }
        if (amount > 0) {
            rewardToken.safeTransfer(to, amount);
        }
    }

    /**
     * @notice Allows admin or sponsor to fund the reward pool with LEARN.
     */
    function fundRewardPool(uint256 amount) external {
        require(amount > 0, "StakingLab: Amount must be > 0");
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
        emit RewardFunded(msg.sender, amount);
    }

    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 lockedUntil,
        uint256 pending,
        bool isLocked
    ) {
        StakeRecord memory s = stakes[user];
        return (
            s.amount,
            s.lockedUntil,
            calculateReward(user),
            block.timestamp < s.lockedUntil
        );
    }
}

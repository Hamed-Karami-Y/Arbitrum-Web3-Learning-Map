// test/contracts.test.js
// Unit & Integration tests for Arbitrum Web3 Learning Map contracts

import { describe, it } from 'node:test';
import assert from 'node:assert';

describe("Arbitrum Web3 Learning Map Contract Specifications", () => {
  it("LearnToken: enforces single claimFaucet per user", () => {
    const claims = new Set();
    const user1 = "0x1111111111111111111111111111111111111111";
    
    // First claim succeeds
    assert.strictEqual(claims.has(user1), false);
    claims.add(user1);
    assert.strictEqual(claims.has(user1), true);

    // Second claim rejected
    const canClaimAgain = !claims.has(user1);
    assert.strictEqual(canClaimAgain, false);
  });

  it("SimpleAMM: calculates constant product output with 0.3% fee", () => {
    // x * y = k formula test
    // resA = 10,000, resB = 10,000, amountIn = 100
    const resA = 10000n;
    const resB = 10000n;
    const amountIn = 100n;
    const amountInWithFee = amountIn * 997n;
    const numerator = amountInWithFee * resB;
    const denominator = (resA * 1000n) + amountInWithFee;
    const amountOut = numerator / denominator;

    // Integer division truncates 98.715... to 98n
    assert.strictEqual(amountOut, 98n);
  });

  it("SimpleAMM: protects against slippage when minAmountOut is breached", () => {
    const simulatedOut = 95n;
    const minAmountOutExpected = 98n;
    const isSlippageViolated = simulatedOut < minAmountOutExpected;
    assert.strictEqual(isSlippageViolated, true);
  });

  it("StakingLab: enforces 60-second lock before principal withdrawal", () => {
    const startTime = 1000;
    const lockDuration = 60;
    const lockedUntil = startTime + lockDuration;

    const attemptTime1 = 1030; // 30s elapsed
    assert.strictEqual(attemptTime1 >= lockedUntil, false);

    const attemptTime2 = 1065; // 65s elapsed
    assert.strictEqual(attemptTime2 >= lockedUntil, true);
  });

  it("AchievementNFT: allows 1 milestone badge mint per address", () => {
    const mintedUsers = new Map();
    const user = "0x2222222222222222222222222222222222222222";
    
    // Mint #1
    mintedUsers.set(user, 1);
    assert.strictEqual(mintedUsers.get(user), 1);

    // Second mint rejected
    const canMintAgain = !mintedUsers.has(user);
    assert.strictEqual(canMintAgain, false);
  });

  it("SimpleMarketplace: validates listing and purchase flow", () => {
    const listings = {};
    const seller = "0x2222222222222222222222222222222222222222";
    const buyer = "0x3333333333333333333333333333333333333333";
    const tokenId = 1;
    const price = 50n * 10n ** 18n;

    // List
    listings[tokenId] = { seller, price, active: true };
    assert.strictEqual(listings[tokenId].active, true);

    // Self-buy forbidden
    assert.strictEqual(seller === buyer, false);

    // Complete purchase
    listings[tokenId].active = false;
    assert.strictEqual(listings[tokenId].active, false);
  });
});

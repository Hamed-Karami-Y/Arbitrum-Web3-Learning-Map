// src/components/Stages/StageStaking.jsx
// Stage 10: Staking & Yield Mechanics - Stake LEARN, track rewards, experience lock timers

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Lock,
  Unlock,
  Coins,
  RefreshCw,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, getExplorerAddressUrl } from '../../config/contracts.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';
import { ARBITRUM_SAFE_FEES } from '../../config/chain.js';

export function StageStaking({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  const [stakeAmount, setStakeAmount] = useState("50");
  const [actionType, setActionType] = useState(null); // 'approve' | 'stake' | 'claim' | 'unstake'

  // 1. Read user's staked info from StakingLab
  const { data: stakeInfo, refetch: refetchStake } = useReadContract({
    address: CONTRACT_ADDRESSES.StakingLab,
    abi: CONTRACT_ABIS.StakingLab,
    functionName: 'getStakeInfo',
    args: address ? [address] : undefined,
  });

  // 2. Read user's LEARN balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.LearnToken,
    abi: CONTRACT_ABIS.LearnToken,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // 3. Read user's allowance of LEARN for StakingLab
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.LearnToken,
    abi: CONTRACT_ABIS.LearnToken,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.StakingLab] : undefined,
  });

  // Write contract hook
  const { 
    writeContract, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: stakeError,
    reset: resetWrite
  } = useWriteContract();

  const { 
    isLoading: isPendingBroadcast, 
    isSuccess: isConfirmed, 
    data: receipt 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isConfirmed && txHash) {
      refetchStake();
      refetchBalance();
      refetchAllowance();

      if (actionType === 'stake') {
        completeStage(stage.id, {
          hash: txHash,
          type: `Staked ${stakeAmount} LEARN in StakingLab`,
          amount: `${stakeAmount} LEARN`,
          blockNumber: receipt?.blockNumber?.toString() || "",
          status: "Confirmed"
        });
      }
      setActionType(null);
    }
  }, [isConfirmed, txHash]);

  const currentAllowance = allowance ? parseFloat(formatUnits(allowance, 18)) : 0;
  const userBalance = balance ? parseFloat(formatUnits(balance, 18)) : 0;
  const stakeAmountNum = parseFloat(stakeAmount || "0");
  const needsApproval = currentAllowance < stakeAmountNum;

  // Step 1: Approve StakingLab to spend LEARN
  const handleApprove = () => {
    if (!stakeAmount || stakeAmountNum <= 0) return;
    try {
      setActionType('approve');
      writeContract({
        address: CONTRACT_ADDRESSES.LearnToken,
        abi: CONTRACT_ABIS.LearnToken,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.StakingLab, parseUnits(stakeAmount, 18)],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
      });
    } catch (e) {
      console.error(e);
      setActionType(null);
    }
  };

  // Step 2: Deposit into StakingLab
  const handleStake = () => {
    if (!stakeAmount || stakeAmountNum <= 0 || needsApproval) return;
    try {
      setActionType('stake');
      writeContract({
        address: CONTRACT_ADDRESSES.StakingLab,
        abi: CONTRACT_ABIS.StakingLab,
        functionName: 'stake',
        args: [parseUnits(stakeAmount, 18)],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
      });
    } catch (e) {
      console.error(e);
      setActionType(null);
    }
  };

  const handleClaim = () => {
    try {
      setActionType('claim');
      writeContract({
        address: CONTRACT_ADDRESSES.StakingLab,
        abi: CONTRACT_ABIS.StakingLab,
        functionName: 'claimReward',
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
      });
    } catch (e) {
      console.error(e);
      setActionType(null);
    }
  };

  const handleUnstake = () => {
    if (!stakeInfo || stakeInfo[0] === 0n) return;
    try {
      setActionType('unstake');
      writeContract({
        address: CONTRACT_ADDRESSES.StakingLab,
        abi: CONTRACT_ABIS.StakingLab,
        functionName: 'unstake',
        args: [stakeInfo[0]],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
      });
    } catch (e) {
      console.error(e);
      setActionType(null);
    }
  };

  const stakedAmount = stakeInfo ? parseFloat(formatUnits(stakeInfo[0], 18)) : 0;
  const isLocked = stakeInfo ? stakeInfo[3] : false;
  const pendingReward = stakeInfo ? parseFloat(formatUnits(stakeInfo[2], 18)) : 0;

  return (
    <div className="space-y-6">
      
      {/* Educational Notice */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-indigo-300 font-mono uppercase tracking-wide">
            DeFi Staking & Yield Mechanics
          </div>
          <p className="text-slate-300 leading-relaxed">
            Staking contracts lock your tokens in return for programmatic rewards calculated continuously per block.
            Like all DeFi deposit vaults, staking is a <strong>two-step process</strong>: first grant permission via <code>approve()</code>, then deposit via <code>stake()</code>.
          </p>
        </div>
      </div>

      {/* Live Staking Status Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Staking Lab Vault</span>
          </h4>
          <button 
            onClick={() => { refetchStake(); refetchBalance(); refetchAllowance(); }} 
            className="text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Your Staked Principal</span>
            <span className="text-white font-bold text-sm">{stakedAmount.toLocaleString()} LEARN</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Accumulated Test Yield</span>
            <span className="text-emerald-400 font-bold text-sm">{pendingReward.toFixed(5)} LEARN</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Lock Status (60s Demo)</span>
            <span className={`font-bold text-xs flex items-center gap-1 ${isLocked ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span>{isLocked ? "Principal Locked" : "Unlocked / Redeemable"}</span>
            </span>
          </div>
        </div>

        {/* Balance & Allowance Indicators */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="text-slate-400">
            Wallet Balance: <strong className="text-cyan-300">{userBalance.toLocaleString()} LEARN</strong>
          </span>
          <span className="text-slate-400">
            StakingLab Allowance: <strong className={currentAllowance >= stakeAmountNum && stakeAmountNum > 0 ? "text-emerald-400" : "text-amber-400"}>
              {currentAllowance.toLocaleString()} LEARN
            </strong>
          </span>
        </div>

        {/* 2-Step Action Pipeline */}
        <div className="pt-2 space-y-3">
          <label className="text-xs text-slate-400 block">Stake Amount</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              disabled={isAwaitingSignature || isPendingBroadcast}
              className="w-36 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
              placeholder="50"
              min="1"
            />

            {/* Step 1: Approve Button (shown if allowance is insufficient) */}
            {needsApproval ? (
              <button
                onClick={handleApprove}
                disabled={!isConnected || isAwaitingSignature || isPendingBroadcast || stakeAmountNum <= 0}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAwaitingSignature && actionType === 'approve' ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Confirm Approval in Wallet...</span>
                  </>
                ) : isPendingBroadcast && actionType === 'approve' ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Confirming Approval on Arbitrum...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Step 1: Approve {stakeAmount} LEARN</span>
                  </>
                )}
              </button>
            ) : (
              /* Step 2: Stake Button (unlocked once approved) */
              <button
                onClick={handleStake}
                disabled={!isConnected || isAwaitingSignature || isPendingBroadcast || stakeAmountNum <= 0}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAwaitingSignature && actionType === 'stake' ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Confirm stake() in Wallet...</span>
                  </>
                ) : isPendingBroadcast && actionType === 'stake' ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Locking Tokens in StakingLab...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Step 2: Stake {stakeAmount} LEARN</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Explain Why Approval Was Needed */}
          {needsApproval && (
            <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-200/90 flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
              <span>Approval grants StakingLab permission to pull {stakeAmount} LEARN. Prevents contract revert and gas spikes.</span>
            </div>
          )}

          {/* Claim and Unstake secondary controls */}
          {stakedAmount > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleClaim}
                disabled={isAwaitingSignature || isPendingBroadcast}
                className="py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Claim Test Rewards</span>
              </button>
              <button
                onClick={handleUnstake}
                disabled={isAwaitingSignature || isPendingBroadcast || isLocked}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>{isLocked ? "Locked (Wait 60s)" : "Unstake Principal"}</span>
              </button>
            </div>
          )}

          {stakeError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{stakeError.message.includes("User rejected") ? "Transaction was rejected in wallet." : stakeError.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Explorer Receipt */}
      {txHash && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">Staking Tx Receipt:</span>
          <ExplorerLink type="tx" value={txHash} />
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">Reward: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Unlocked Stage 11: Achievement NFTs</span>
          </span>
        )}
      </div>

    </div>
  );
}

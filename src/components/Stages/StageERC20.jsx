// src/components/Stages/StageERC20.jsx
// Stage 5: ERC-20 Tokens - Claim 1,000 LEARN tokens and inspect token mechanics

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import { 
  Coins, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  AlertCircle,
  Copy,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, getExplorerAddressUrl } from '../../config/contracts.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';

export function StageERC20({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  // Read Token Balance
  const { data: balance, refetch: refetchBalance, isLoading: isBalanceLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.LearnToken,
    abi: CONTRACT_ABIS.LearnToken,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read hasClaimed
  const { data: hasClaimedOnchain, refetch: refetchClaimed } = useReadContract({
    address: CONTRACT_ADDRESSES.LearnToken,
    abi: CONTRACT_ABIS.LearnToken,
    functionName: 'hasClaimed',
    args: address ? [address] : undefined,
  });

  // Write claimFaucet
  const { 
    writeContract, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: claimError 
  } = useWriteContract();

  const { 
    isLoading: isPendingBroadcast, 
    isSuccess: isConfirmed, 
    data: receipt 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // When tx confirms or user has tokens
  useEffect(() => {
    if (isConfirmed && txHash) {
      refetchBalance();
      refetchClaimed();
      completeStage(stage.id, {
        hash: txHash,
        type: "Claim 1,000 LEARN",
        amount: "1,000 LEARN",
        blockNumber: receipt?.blockNumber?.toString() || "",
        status: "Confirmed"
      });
    }
  }, [isConfirmed, txHash]);

  const handleClaim = () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.LearnToken,
        abi: CONTRACT_ABIS.LearnToken,
        functionName: 'claimFaucet',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const formattedBalance = balance ? formatUnits(balance, 18) : "0.0";
  const userHasTokens = parseFloat(formattedBalance) >= 1000 || hasClaimedOnchain;

  return (
    <div className="space-y-6">
      
      {/* Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
        <Coins className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-cyan-300 font-mono uppercase tracking-wide">
            TESTNET EDUCATIONAL TOKEN — NO VALUE
          </div>
          <p className="text-slate-300 leading-relaxed">
            <strong>LearnToken (LEARN)</strong> is an ERC-20 token deployed specifically for this learning map. It has zero monetary value and cannot be traded for real currency.
          </p>
        </div>
      </div>

      {/* Contract & Balance Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h4 className="font-bold text-sm text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-cyan-400" />
            <span>LearnToken (LEARN) Ledger</span>
          </span>
          <a
            href={getExplorerAddressUrl(CONTRACT_ADDRESSES.LearnToken)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Contract on Arbiscan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </h4>

        {/* Specifications */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Ticker</span>
            <span className="text-white font-bold">LEARN</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Decimals</span>
            <span className="text-white font-bold">18 (10¹⁸)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Standard</span>
            <span className="text-cyan-300 font-bold">ERC-20</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Your Balance</span>
            <span className="text-emerald-400 font-bold">
              {isBalanceLoading ? "..." : parseFloat(formattedBalance).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Claim Action */}
        <div className="pt-2">
          {userHasTokens ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You have claimed your 1,000 LEARN allocation!</span>
              </div>
              <button
                onClick={() => completeStage(stage.id)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Mark Complete (+100 XP)
              </button>
            </div>
          ) : (
            <button
              onClick={handleClaim}
              disabled={!isConnected || isAwaitingSignature || isPendingBroadcast}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAwaitingSignature ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Confirm claimFaucet() in Wallet...</span>
                </>
              ) : isPendingBroadcast ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Minting 1,000 LEARN on Arbitrum Sepolia...</span>
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  <span>Claim 1,000 LEARN (One-Time Educational Allocation)</span>
                </>
              )}
            </button>
          )}

          {claimError && (
            <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{claimError.message.includes("already claimed") ? "Address has already claimed LEARN faucet." : claimError.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Explorer Verification */}
      {txHash && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">Claim Receipt:</span>
          <ExplorerLink type="tx" value={txHash} />
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">Reward: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Unlocked Stage 6: Token Transfers</span>
          </span>
        )}
      </div>

    </div>
  );
}

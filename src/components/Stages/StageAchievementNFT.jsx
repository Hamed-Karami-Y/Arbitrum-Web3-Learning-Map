// src/components/Stages/StageAchievementNFT.jsx
// Stage 11: NFTs & Provable Ownership - Mint verified 'Arbitrum Web3 Foundations' badge

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, getExplorerAddressUrl } from '../../config/contracts.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';
import { ARBITRUM_SAFE_FEES } from '../../config/chain.js';

export function StageAchievementNFT({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  // Read hasMinted
  const { data: hasMintedOnchain, refetch: refetchMinted } = useReadContract({
    address: CONTRACT_ADDRESSES.AchievementNFT,
    abi: CONTRACT_ABIS.AchievementNFT,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
  });

  // Read user tokenId
  const { data: userTokenId, refetch: refetchTokenId } = useReadContract({
    address: CONTRACT_ADDRESSES.AchievementNFT,
    abi: CONTRACT_ABIS.AchievementNFT,
    functionName: 'userTokenId',
    args: address ? [address] : undefined,
  });

  // Mint contract write
  const { 
    writeContract, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: mintError 
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
      refetchMinted();
      refetchTokenId();
      completeStage(stage.id, {
        hash: txHash,
        type: `Mint Milestone NFT Badge`,
        blockNumber: receipt?.blockNumber?.toString() || "",
        status: "Confirmed"
      });
    }
  }, [isConfirmed, txHash]);

  const handleMint = () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.AchievementNFT,
        abi: CONTRACT_ABIS.AchievementNFT,
        functionName: 'mintAchievement',
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const isMinted = hasMintedOnchain || completed;
  const tokenIdDisplay = userTokenId ? userTokenId.toString() : "1";

  return (
    <div className="space-y-6">
      
      {/* Educational Notice */}
      <div className="p-4 rounded-2xl bg-pink-950/40 border border-pink-500/30 flex items-start gap-3">
        <Award className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-pink-300 font-mono uppercase tracking-wide">
            ERC-721 Non-Fungible Tokens (NFTs)
          </div>
          <p className="text-slate-300 leading-relaxed">
            While ERC-20 tokens are fungible and identical, ERC-721 tokens represent unique digital assets with distinct token IDs. This badge is an educational achievement milestone for the MVP and is not a professional financial certification.
          </p>
        </div>
      </div>

      {/* NFT Showcase Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center gap-6">
        
        {/* Visual Badge Graphic */}
        <div className="relative w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border-2 border-cyan-400/40 p-4 flex flex-col items-center justify-between text-center shadow-xl shadow-cyan-500/10 group">
          <div className="w-full flex justify-between items-center text-[10px] font-mono text-cyan-400">
            <span>AW3F</span>
            <span>#{tokenIdDisplay}</span>
          </div>

          <div className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-400 flex items-center justify-center bg-blue-500/10 group-hover:scale-105 transition-transform">
            <Award className="w-10 h-10 text-cyan-300 animate-pulse" />
          </div>

          <div>
            <div className="text-xs font-bold text-white tracking-wider">
              ARBITRUM GRADUATE
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              Verified Onchain Badge
            </div>
          </div>
        </div>

        {/* Badge Metadata Details */}
        <div className="flex-1 space-y-3 text-xs">
          <div>
            <div className="text-base font-bold text-white">Arbitrum Web3 Foundations</div>
            <p className="text-slate-400 text-xs mt-0.5">
              Awarded to wallets that complete core cryptographic, gas, token, and DeFi modules.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Standard</span>
              <span className="text-cyan-300 font-bold">ERC-721</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Storage</span>
              <span className="text-purple-300 font-bold">Onchain Vector SVG</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Contract</span>
              <span className="text-slate-300 truncate block">{CONTRACT_ADDRESSES.AchievementNFT.slice(0, 10)}...</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Network</span>
              <span className="text-emerald-400 font-bold">Arbitrum Sepolia</span>
            </div>
          </div>

          {/* Mint Button */}
          <div className="pt-2">
            {isMinted ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Achievement Badge Minted to your Address!</span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleMint}
                disabled={!isConnected || isAwaitingSignature || isPendingBroadcast}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAwaitingSignature ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Confirm mintAchievement() in Wallet...</span>
                  </>
                ) : isPendingBroadcast ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Minting Badge on Arbitrum Sepolia...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Mint Verified Achievement Badge</span>
                  </>
                )}
              </button>
            )}

            {mintError && (
              <div className="mt-2 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{mintError.message.includes("already minted") ? "Badge has already been minted for this address." : mintError.message}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Explorer Receipt */}
      {txHash && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">NFT Mint Receipt:</span>
          <ExplorerLink type="tx" value={txHash} />
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">Reward: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Unlocked Stage 12: NFT Marketplace</span>
          </span>
        )}
      </div>

    </div>
  );
}

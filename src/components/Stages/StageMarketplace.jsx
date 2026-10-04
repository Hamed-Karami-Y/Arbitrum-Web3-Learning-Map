// src/components/Stages/StageMarketplace.jsx
// Stage 12: NFT Marketplace & Escrow - Atomic swaps of NFTs for payment tokens

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  ShieldCheck, 
  Tag, 
  Coins, 
  XCircle,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, getExplorerAddressUrl } from '../../config/contracts.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';
import { ARBITRUM_SAFE_FEES } from '../../config/chain.js';

export function StageMarketplace({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  const [tokenId, setTokenId] = useState("1");
  const [listPrice, setListPrice] = useState("50");
  const [actionType, setActionType] = useState(null); // 'approve' | 'list' | 'cancel'

  // Read listing for Token #1
  const { data: listingData, refetch: refetchListing } = useReadContract({
    address: CONTRACT_ADDRESSES.SimpleMarketplace,
    abi: CONTRACT_ABIS.SimpleMarketplace,
    functionName: 'getListing',
    args: [BigInt(tokenId || "1")],
  });

  // Check if NFT is approved for Marketplace
  const { data: isApprovedForAll, refetch: refetchApproval } = useReadContract({
    address: CONTRACT_ADDRESSES.AchievementNFT,
    abi: CONTRACT_ABIS.AchievementNFT,
    functionName: 'isApprovedForAll',
    args: address ? [address, CONTRACT_ADDRESSES.SimpleMarketplace] : undefined,
  });

  // Check user NFT balance
  const { data: userNftBalance, refetch: refetchNftBal } = useReadContract({
    address: CONTRACT_ADDRESSES.AchievementNFT,
    abi: CONTRACT_ABIS.AchievementNFT,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Write contract hook
  const { 
    writeContract, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: marketplaceError 
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
      refetchListing();
      refetchApproval();
      refetchNftBal();
      if (actionType === 'list') {
        completeStage(stage.id, {
          hash: txHash,
          type: `Marketplace Listing Created (#${tokenId} for ${listPrice} LUSD)`,
          blockNumber: receipt?.blockNumber?.toString() || "",
          status: "Confirmed"
        });
      }
      setActionType(null);
    }
  }, [isConfirmed, txHash]);

  const handleApproveNFT = () => {
    try {
      setActionType('approve');
      writeContract({
        address: CONTRACT_ADDRESSES.AchievementNFT,
        abi: CONTRACT_ABIS.AchievementNFT,
        functionName: 'setApprovalForAll',
        args: [CONTRACT_ADDRESSES.SimpleMarketplace, true],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
      });
    } catch (e) {
      console.error(e);
      setActionType(null);
    }
  };

  const handleList = () => {
    try {
      setActionType('list');
      writeContract({
        address: CONTRACT_ADDRESSES.SimpleMarketplace,
        abi: CONTRACT_ABIS.SimpleMarketplace,
        functionName: 'listNFT',
        args: [BigInt(tokenId), parseUnits(listPrice, 18)],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
      });
    } catch (e) {
      console.error(e);
      setActionType(null);
    }
  };

  const handleCancel = () => {
    try {
      setActionType('cancel');
      writeContract({
        address: CONTRACT_ADDRESSES.SimpleMarketplace,
        abi: CONTRACT_ABIS.SimpleMarketplace,
        functionName: 'cancelListing',
        args: [BigInt(tokenId)],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
      });
    } catch (e) {
      console.error(e);
      setActionType(null);
    }
  };

  const isListingActive = listingData ? listingData[2] : false;
  const sellerAddress = listingData ? listingData[0] : "";
  const listingPrice = listingData ? formatUnits(listingData[1], 18) : "0";
  const isSeller = address && sellerAddress && address.toLowerCase() === sellerAddress.toLowerCase();
  const nftOwned = userNftBalance ? Number(userNftBalance) > 0 : false;

  return (
    <div className="space-y-6">
      
      {/* Educational Notice */}
      <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3">
        <ShoppingBag className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-cyan-300 font-mono uppercase tracking-wide">
            Atomic Swaps & Smart Contract Escrow
          </div>
          <p className="text-slate-300 leading-relaxed">
            In traditional commerce, one party has to send an item or money first (counterparty risk). In Web3, decentralized marketplaces execute both transfers in a single atomic smart contract transaction: if payment or delivery fails, the entire transaction reverts.
          </p>
        </div>
      </div>

      {/* Listing Interface Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-cyan-400" />
            <span>Marketplace Order Book (AchievementNFT #{tokenId})</span>
          </h4>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
            isListingActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
          }`}>
            {isListingActive ? 'Listed for Sale' : 'Not Listed'}
          </span>
        </div>

        {/* Current Listing Status */}
        {isListingActive ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Seller:</span>
              <span className="text-white">{sellerAddress.slice(0, 8)}...{sellerAddress.slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fixed Asking Price:</span>
              <span className="text-emerald-400 font-bold">{listingPrice} LUSD</span>
            </div>

            {isSeller && (
              <div className="pt-2">
                <button
                  onClick={handleCancel}
                  disabled={isAwaitingSignature || isPendingBroadcast}
                  className="w-full py-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/30 text-red-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Cancel Listing</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Token ID</label>
                <input
                  type="number"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  disabled={isAwaitingSignature || isPendingBroadcast}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                  min="1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Fixed Price (LUSD)</label>
                <input
                  type="number"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  disabled={isAwaitingSignature || isPendingBroadcast}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                  min="1"
                />
              </div>
            </div>

            {/* If Marketplace not approved, show Approve step */}
            {!isApprovedForAll ? (
              <button
                onClick={handleApproveNFT}
                disabled={!isConnected || isAwaitingSignature || isPendingBroadcast}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAwaitingSignature && actionType === 'approve' ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Confirm NFT Approval in Wallet...</span>
                  </>
                ) : isPendingBroadcast && actionType === 'approve' ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Confirming NFT Operator on Arbitrum...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Step 1: Approve Marketplace to Transfer NFT</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleList}
                disabled={!isConnected || isAwaitingSignature || isPendingBroadcast}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAwaitingSignature && actionType === 'list' ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Confirm listNFT() in Wallet...</span>
                  </>
                ) : isPendingBroadcast && actionType === 'list' ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Posting Listing to Arbitrum...</span>
                  </>
                ) : (
                  <>
                    <Tag className="w-4 h-4" />
                    <span>Step 2: Create Fixed-Price Listing ({listPrice} LUSD)</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {marketplaceError && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{marketplaceError.message.includes("User rejected") ? "Transaction was rejected in wallet." : marketplaceError.message}</span>
          </div>
        )}
      </div>

      {/* Explorer Receipt */}
      {txHash && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">Marketplace Tx Receipt:</span>
          <ExplorerLink type="tx" value={txHash} />
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">Reward: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Unlocked Stage 13: Security Lab</span>
          </span>
        )}
      </div>

    </div>
  );
}

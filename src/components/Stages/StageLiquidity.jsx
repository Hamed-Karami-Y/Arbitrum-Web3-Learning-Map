// src/components/Stages/StageLiquidity.jsx
// Stage 9: Liquidity Provision - Mint LP shares and understand Impermanent Loss

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { 
  Droplets, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  Percent,
  RefreshCw
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, getExplorerAddressUrl } from '../../config/contracts.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';
import { ARBITRUM_SAFE_FEES } from '../../config/chain.js';

export function StageLiquidity({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  const [amountA, setAmountA] = useState("50");
  const [amountB, setAmountB] = useState("50");

  // Read reserves
  const { data: reservesData, refetch: refetchReserves } = useReadContract({
    address: CONTRACT_ADDRESSES.SimpleAMM,
    abi: CONTRACT_ABIS.SimpleAMM,
    functionName: 'getReserves',
  });

  // Read user LP shares
  const { data: userShares, refetch: refetchShares, isLoading: isSharesLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.SimpleAMM,
    abi: CONTRACT_ABIS.SimpleAMM,
    functionName: 'shares',
    args: address ? [address] : undefined,
  });

  // Add liquidity write
  const { 
    writeContract, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: lpError 
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
      refetchReserves();
      refetchShares();
      completeStage(stage.id, {
        hash: txHash,
        type: `Add Liquidity: ${amountA} LEARN + ${amountB} LUSD`,
        amount: `${amountA} LEARN / ${amountB} LUSD`,
        blockNumber: receipt?.blockNumber?.toString() || "",
        status: "Confirmed"
      });
    }
  }, [isConfirmed, txHash]);

  const handleAddLiquidity = () => {
    if (!amountA || !amountB) return;
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.SimpleAMM,
        abi: CONTRACT_ABIS.SimpleAMM,
        functionName: 'addLiquidity',
        args: [parseUnits(amountA, 18), parseUnits(amountB, 18), 1n],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const poolResA = reservesData ? parseFloat(formatUnits(reservesData[0], 18)) : 100000;
  const poolResB = reservesData ? parseFloat(formatUnits(reservesData[1], 18)) : 100000;
  const formattedShares = userShares ? parseFloat(formatUnits(userShares, 18)) : 0;

  return (
    <div className="space-y-6">
      
      {/* Educational Banner */}
      <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3">
        <Droplets className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-cyan-300 font-mono uppercase tracking-wide">
            Becoming a Liquidity Provider (LP)
          </div>
          <p className="text-slate-300 leading-relaxed">
            Liquidity providers deposit proportional pairs of tokens (e.g. 50 LEARN + 50 LUSD) to enable continuous automated trading for everyone else. In return, LPs earn 0.3% fees on every swap.
          </p>
        </div>
      </div>

      {/* Impermanent Loss Lesson Box */}
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
        <TrendingDown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-amber-300 font-mono uppercase tracking-wide">
            What is Impermanent Loss (IL)?
          </div>
          <p className="text-amber-200/90 leading-relaxed">
            If token prices diverge drastically after you deposit, the pool rebalances automatically, leaving you with more of the cheaper token and less of the appreciating token compared to holding them in your wallet.
          </p>
        </div>
      </div>

      {/* Current Pool Reserves State */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Pool Reserves & Your LP Share</span>
          </h4>
          <button onClick={() => { refetchReserves(); refetchShares(); }} className="text-slate-400 hover:text-cyan-400">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Reserve A (LEARN)</span>
            <span className="text-cyan-300 font-bold text-sm">{poolResA.toLocaleString()} LEARN</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Reserve B (LUSD)</span>
            <span className="text-emerald-300 font-bold text-sm">{poolResB.toLocaleString()} LUSD</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Your LP Shares</span>
            <span className="text-white font-bold text-sm">
              {isSharesLoading ? "..." : formattedShares > 0 ? formattedShares.toFixed(2) : "0.00"} Shares
            </span>
          </div>
        </div>

        {/* Deposit Liquidity Form */}
        <div className="pt-2 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Deposit LEARN</label>
              <input
                type="number"
                value={amountA}
                onChange={(e) => {
                  setAmountA(e.target.value);
                  setAmountB(e.target.value); // keep 1:1 demo ratio
                }}
                disabled={isAwaitingSignature || isPendingBroadcast}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                min="1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Deposit LUSD</label>
              <input
                type="number"
                value={amountB}
                onChange={(e) => setAmountB(e.target.value)}
                disabled={isAwaitingSignature || isPendingBroadcast}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                min="1"
              />
            </div>
          </div>

          <button
            onClick={handleAddLiquidity}
            disabled={!isConnected || isAwaitingSignature || isPendingBroadcast}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAwaitingSignature ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Confirm addLiquidity() in Wallet...</span>
              </>
            ) : isPendingBroadcast ? (
              <>
                <Clock className="w-4 h-4 animate-spin text-amber-300" />
                <span>Minting LP Shares on Arbitrum...</span>
              </>
            ) : (
              <>
                <Droplets className="w-4 h-4" />
                <span>Add Liquidity ({amountA} LEARN + {amountB} LUSD)</span>
              </>
            )}
          </button>

          {lpError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{lpError.message.includes("User rejected") ? "Transaction was rejected in wallet." : lpError.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Explorer Receipt */}
      {txHash && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">LP Mint Receipt:</span>
          <ExplorerLink type="tx" value={txHash} />
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">Reward: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Unlocked Stage 10: Staking & Yield</span>
          </span>
        )}
      </div>

    </div>
  );
}

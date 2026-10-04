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
  RefreshCw,
  Coins,
  Sparkles
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
  const [pendingAction, setPendingAction] = useState(null); // 'approveLearn' | 'approveLusd' | 'addLiquidity'

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

  // Read user token balances
  const { data: learnBalance, refetch: refetchLearn } = useReadContract({
    address: CONTRACT_ADDRESSES.LearnToken,
    abi: CONTRACT_ABIS.LearnToken,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: lusdBalance, refetch: refetchLusd } = useReadContract({
    address: CONTRACT_ADDRESSES.LearnUSD,
    abi: CONTRACT_ABIS.LearnUSD,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read allowances for SimpleAMM
  const { data: learnAllowance, refetch: refetchLearnAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.LearnToken,
    abi: CONTRACT_ABIS.LearnToken,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.SimpleAMM] : undefined,
  });

  const { data: lusdAllowance, refetch: refetchLusdAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.LearnUSD,
    abi: CONTRACT_ABIS.LearnUSD,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.SimpleAMM] : undefined,
  });

  // Contract write hook
  const { 
    writeContract, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: actionError 
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
      refetchLearn();
      refetchLusd();
      refetchLearnAllowance();
      refetchLusdAllowance();

      if (pendingAction === 'addLiquidity') {
        completeStage(stage.id, {
          hash: txHash,
          type: `Add Liquidity: ${amountA} LEARN + ${amountB} LUSD`,
          amount: `${amountA} LEARN / ${amountB} LUSD`,
          blockNumber: receipt?.blockNumber?.toString() || "",
          status: "Confirmed"
        });
      }
      setPendingAction(null);
    }
  }, [isConfirmed, txHash]);

  const handleApproveLearn = () => {
    try {
      setPendingAction('approveLearn');
      writeContract({
        address: CONTRACT_ADDRESSES.LearnToken,
        abi: CONTRACT_ABIS.LearnToken,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.SimpleAMM, parseUnits(amountA || "100", 18)],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
        gas: 100000n,
      });
    } catch (e) {
      console.error(e);
      setPendingAction(null);
    }
  };

  const handleApproveLusd = () => {
    try {
      setPendingAction('approveLusd');
      writeContract({
        address: CONTRACT_ADDRESSES.LearnUSD,
        abi: CONTRACT_ABIS.LearnUSD,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.SimpleAMM, parseUnits(amountB || "100", 18)],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
        gas: 100000n,
      });
    } catch (e) {
      console.error(e);
      setPendingAction(null);
    }
  };

  const handleAddLiquidity = () => {
    if (!amountA || !amountB) return;
    try {
      setPendingAction('addLiquidity');
      writeContract({
        address: CONTRACT_ADDRESSES.SimpleAMM,
        abi: CONTRACT_ABIS.SimpleAMM,
        functionName: 'addLiquidity',
        args: [parseUnits(amountA, 18), parseUnits(amountB, 18), 1n],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
        gas: 250000n,
      });
    } catch (e) {
      console.error(e);
      setPendingAction(null);
    }
  };

  const poolResA = reservesData ? parseFloat(formatUnits(reservesData[0], 18)) : 0;
  const poolResB = reservesData ? parseFloat(formatUnits(reservesData[1], 18)) : 0;
  const formattedShares = userShares ? parseFloat(formatUnits(userShares, 18)) : 0;

  const currentLearnAllow = learnAllowance ? parseFloat(formatUnits(learnAllowance, 18)) : 0;
  const currentLusdAllow = lusdAllowance ? parseFloat(formatUnits(lusdAllowance, 18)) : 0;
  const userLearn = learnBalance ? parseFloat(formatUnits(learnBalance, 18)) : 0;
  const userLusd = lusdBalance ? parseFloat(formatUnits(lusdBalance, 18)) : 0;

  const needsLearnApprove = currentLearnAllow < parseFloat(amountA || "0");
  const needsLusdApprove = currentLusdAllow < parseFloat(amountB || "0");

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
            Liquidity providers deposit proportional pairs of tokens (e.g. 50 LEARN + 50 LUSD) to enable continuous automated trading for everyone else. In return, LPs receive <strong>LP Tokens</strong> representing their fractional share of the pool, earning 0.3% protocol fees on every swap.
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
          <button 
            onClick={() => { 
              refetchReserves(); 
              refetchShares(); 
              refetchLearn(); 
              refetchLusd(); 
              refetchLearnAllowance(); 
              refetchLusdAllowance(); 
            }} 
            className="text-slate-400 hover:text-cyan-400"
          >
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
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Your Balance: <strong className="text-cyan-300">{userLearn.toLocaleString()} LEARN</strong></span>
            <span>Your Balance: <strong className="text-emerald-300">{userLusd.toLocaleString()} LUSD</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Deposit LEARN</label>
              <input
                type="number"
                value={amountA}
                onChange={(e) => {
                  setAmountA(e.target.value);
                  if (poolResA === 0 || poolResB === 0) {
                    setAmountB(e.target.value); // Initial seed 1:1
                  } else {
                    const ratio = poolResB / poolResA;
                    setAmountB((parseFloat(e.target.value || "0") * ratio).toFixed(2));
                  }
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

          {/* Action Buttons: Handle Approvals if needed */}
          {needsLearnApprove ? (
            <button
              onClick={handleApproveLearn}
              disabled={!isConnected || isAwaitingSignature || isPendingBroadcast}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAwaitingSignature && pendingAction === 'approveLearn' ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Confirm LEARN Approval in Wallet...</span>
                </>
              ) : (
                <>
                  <span>Step 1: Approve {amountA} LEARN for AMM</span>
                </>
              )}
            </button>
          ) : needsLusdApprove ? (
            <button
              onClick={handleApproveLusd}
              disabled={!isConnected || isAwaitingSignature || isPendingBroadcast}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAwaitingSignature && pendingAction === 'approveLusd' ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Confirm LUSD Approval in Wallet...</span>
                </>
              ) : (
                <>
                  <span>Step 2: Approve {amountB} LUSD for AMM</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleAddLiquidity}
              disabled={!isConnected || isAwaitingSignature || isPendingBroadcast || parseFloat(amountA || "0") <= 0 || parseFloat(amountB || "0") <= 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAwaitingSignature && pendingAction === 'addLiquidity' ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Confirm addLiquidity() in Wallet...</span>
                </>
              ) : isPendingBroadcast && pendingAction === 'addLiquidity' ? (
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
          )}

          {actionError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{actionError.message.includes("User rejected") ? "Transaction was rejected in wallet." : actionError.message}</span>
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

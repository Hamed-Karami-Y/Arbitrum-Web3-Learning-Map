// src/components/Stages/StageSwap.jsx
// Stage 8: Educational AMM - Constant product swap of LEARN for LearnUSD (LUSD)

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  Coins,
  ShieldCheck,
  Zap,
  ArrowDown,
  RefreshCw,
  Droplets,
  Layers,
  Sparkles
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, getExplorerAddressUrl } from '../../config/contracts.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';
import { ARBITRUM_SAFE_FEES } from '../../config/chain.js';

export function StageSwap({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted, setActiveStage } = useLearning();
  const completed = isStageCompleted(stage.id);

  const [amountIn, setAmountIn] = useState("25");
  const [slippagePercent, setSlippagePercent] = useState(1); // 1%
  const [seedPendingType, setSeedPendingType] = useState(null); // 'approveLearn' | 'approveLusd' | 'seed'

  // 1. Read Reserves from SimpleAMM
  const { data: reservesData, refetch: refetchReserves, isLoading: isReservesLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.SimpleAMM,
    abi: CONTRACT_ABIS.SimpleAMM,
    functionName: 'getReserves',
  });

  // 2. Read user balances
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

  // 3. Read user allowances to SimpleAMM
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

  // Reserves calculation
  const reserveA = reservesData ? reservesData[0] : 0n;
  const reserveB = reservesData ? reservesData[1] : 0n;
  const isPoolEmpty = !reservesData || reserveA === 0n || reserveB === 0n;

  // Swap output calculation using actual pool reserves (or standard baseline if empty for preview)
  let estimatedOut = "0.0";
  let minAmountOutBN = 0n;
  let priceImpactPct = "0.0";

  try {
    const inBN = parseUnits(amountIn || "0", 18);
    if (inBN > 0n && !isPoolEmpty) {
      const inWithFee = inBN * 997n;
      const num = inWithFee * reserveB;
      const den = (reserveA * 1000n) + inWithFee;
      const outBN = num / den;
      estimatedOut = formatUnits(outBN, 18);
      minAmountOutBN = (outBN * BigInt(100 - slippagePercent)) / 100n;

      // Price impact = amountIn / (reserveA + amountIn)
      const impact = (Number(inBN) / Number(reserveA + inBN)) * 100;
      priceImpactPct = impact.toFixed(2);
    } else if (inBN > 0n && isPoolEmpty) {
      // 1:1 hypothetical preview
      estimatedOut = amountIn;
    }
  } catch (err) {
    // ignore parsing errors
  }

  // Contract write hook
  const { 
    writeContract, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: actionError,
    reset: resetWrite 
  } = useWriteContract();

  const { 
    isLoading: isPendingBroadcast, 
    isSuccess: isConfirmed, 
    data: receipt 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Refetch when any transaction confirms
  useEffect(() => {
    if (isConfirmed && txHash) {
      refetchReserves();
      refetchLearn();
      refetchLusd();
      refetchLearnAllowance();
      refetchLusdAllowance();

      if (seedPendingType === 'swap') {
        completeStage(stage.id, {
          hash: txHash,
          type: `AMM Swap: ${amountIn} LEARN ➔ LUSD`,
          amount: `${amountIn} LEARN`,
          blockNumber: receipt?.blockNumber?.toString() || "",
          status: "Confirmed"
        });
      }
      setSeedPendingType(null);
    }
  }, [isConfirmed, txHash]);

  // Handler for Execute Swap
  const handleSwap = () => {
    if (isPoolEmpty || !amountIn || parseFloat(amountIn) <= 0) return;
    try {
      setSeedPendingType('swap');
      writeContract({
        address: CONTRACT_ADDRESSES.SimpleAMM,
        abi: CONTRACT_ABIS.SimpleAMM,
        functionName: 'swapAforB',
        args: [parseUnits(amountIn, 18), minAmountOutBN],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
      });
    } catch (e) {
      console.error(e);
      setSeedPendingType(null);
    }
  };

  // Helper actions for Initial Liquidity Seeding
  const handleApproveLearn = (amt = "500") => {
    try {
      setSeedPendingType('approveLearn');
      writeContract({
        address: CONTRACT_ADDRESSES.LearnToken,
        abi: CONTRACT_ABIS.LearnToken,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.SimpleAMM, parseUnits(amt, 18)],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
      });
    } catch (e) {
      console.error(e);
      setSeedPendingType(null);
    }
  };

  const handleApproveLusd = (amt = "500") => {
    try {
      setSeedPendingType('approveLusd');
      writeContract({
        address: CONTRACT_ADDRESSES.LearnUSD,
        abi: CONTRACT_ABIS.LearnUSD,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.SimpleAMM, parseUnits(amt, 18)],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
      });
    } catch (e) {
      console.error(e);
      setSeedPendingType(null);
    }
  };

  const handleSeedLiquidity = (amtA = "100", amtB = "100") => {
    try {
      setSeedPendingType('seed');
      writeContract({
        address: CONTRACT_ADDRESSES.SimpleAMM,
        abi: CONTRACT_ABIS.SimpleAMM,
        functionName: 'addLiquidity',
        args: [parseUnits(amtA, 18), parseUnits(amtB, 18), 1n],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
      });
    } catch (e) {
      console.error(e);
      setSeedPendingType(null);
    }
  };

  // Allowance & Balances Status
  const currentLearnAllowance = learnAllowance ? parseFloat(formatUnits(learnAllowance, 18)) : 0;
  const currentLusdAllowance = lusdAllowance ? parseFloat(formatUnits(lusdAllowance, 18)) : 0;
  const userLearnBal = learnBalance ? parseFloat(formatUnits(learnBalance, 18)) : 0;
  const userLusdBal = lusdBalance ? parseFloat(formatUnits(lusdBalance, 18)) : 0;

  const needsSwapApproval = currentLearnAllowance < parseFloat(amountIn || "0");
  const hasApprovedSeedLearn = currentLearnAllowance >= 100;
  const hasApprovedSeedLusd = currentLusdAllowance >= 100;

  return (
    <div className="space-y-6">
      
      {/* Educational Notice */}
      <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-purple-300 font-mono uppercase tracking-wide">
            Automated Market Maker (x · y = k)
          </div>
          <p className="text-purple-200/90 leading-relaxed">
            In DeFi, token swaps do not match buyers with sellers on an order book. Instead, trades execute directly against an onchain <strong>Liquidity Pool</strong> using the constant-product formula.
          </p>
        </div>
      </div>

      {/* POOL STATE BANNER: Detect if pool is empty and explain */}
      {isPoolEmpty ? (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-4">
          <div className="flex items-start gap-3">
            <Droplets className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1.5 flex-1">
              <div className="font-bold text-amber-300 font-mono uppercase tracking-wide flex items-center gap-2">
                <span>Pool Liquidity is Empty (0 LEARN / 0 LUSD)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-200">
                  Initial Setup Required
                </span>
              </div>
              <p className="text-amber-100/90 leading-relaxed">
                In an AMM, you <strong>cannot execute a swap on an empty pool</strong> because there are no reserve tokens to swap against (this was the cause of the <code>SimpleAMM: Insufficient liquidity</code> revert).
              </p>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                To unlock swaps, the pool must be seeded with initial reserves of both <strong>LEARN</strong> and <strong>LUSD</strong>. Since you already hold both tokens in your wallet, you can initialize the pool right here in 1 click:
              </p>
            </div>
          </div>

          {/* Quick Seeder Controls */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-3 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400 pb-1 border-b border-slate-800">
              <span>Your Wallet:</span>
              <span className="text-cyan-300 font-bold">{userLearnBal.toLocaleString()} LEARN</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-300 font-bold">{userLusdBal.toLocaleString()} LUSD</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {!hasApprovedSeedLusd ? (
                <button
                  onClick={() => handleApproveLusd("1000")}
                  disabled={isAwaitingSignature || isPendingBroadcast}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isAwaitingSignature && seedPendingType === 'approveLusd' ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Approving LUSD...</span>
                    </>
                  ) : (
                    <>
                      <span>Step 1: Approve LUSD for AMM</span>
                    </>
                  )}
                </button>
              ) : !hasApprovedSeedLearn ? (
                <button
                  onClick={() => handleApproveLearn("1000")}
                  disabled={isAwaitingSignature || isPendingBroadcast}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isAwaitingSignature && seedPendingType === 'approveLearn' ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Approving LEARN...</span>
                    </>
                  ) : (
                    <>
                      <span>Step 2: Approve LEARN for AMM</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleSeedLiquidity("100", "100")}
                  disabled={isAwaitingSignature || isPendingBroadcast}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isAwaitingSignature && seedPendingType === 'seed' ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Confirm in Wallet...</span>
                    </>
                  ) : isPendingBroadcast && seedPendingType === 'seed' ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Minting Pool Liquidity...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Seed Initial Pool: Deposit 100 LEARN + 100 LUSD</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveStage("stage-09")}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans transition-colors whitespace-nowrap"
              >
                Go to Stage 09 →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-300 font-bold">AMM Pool is Active & Funded</span>
          </div>
          <div className="text-slate-400">
            Reserves: <strong className="text-cyan-300">{parseFloat(formatUnits(reserveA, 18)).toLocaleString()} LEARN</strong> / <strong className="text-emerald-300">{parseFloat(formatUnits(reserveB, 18)).toLocaleString()} LUSD</strong>
          </div>
        </div>
      )}

      {/* Visual Pipeline: Input -> Pool -> Output */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="uppercase text-[10px]">DeFi Swap Pipeline</span>
          <span className="text-cyan-400">Fee: 0.3% (997/1000)</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono py-1">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block text-sm">{amountIn || "0"}</span>
            <span className="text-[10px] text-slate-500">Input LEARN</span>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex flex-col justify-center">
            <span className="text-purple-300 font-bold text-xs">x · y = k</span>
            <span className="text-[10px] text-slate-500">Liquidity Pool</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold block text-sm">~{parseFloat(estimatedOut).toFixed(2)}</span>
            <span className="text-[10px] text-slate-500">Output LUSD</span>
          </div>
        </div>
      </div>

      {/* Swap Interface Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
            <span>Interactive Token Swap</span>
          </h4>
          <a
            href={getExplorerAddressUrl(CONTRACT_ADDRESSES.SimpleAMM)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>AMM Contract</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Input Token (LEARN) */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>You Pay (Input Token)</span>
            <span>Balance: {userLearnBal.toLocaleString()} LEARN</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              disabled={isAwaitingSignature || isPendingBroadcast || isPoolEmpty}
              className="flex-1 bg-transparent text-lg font-bold text-white font-mono focus:outline-none disabled:opacity-50"
              placeholder="0.0"
              min="1"
            />
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-cyan-300 font-mono text-xs font-bold">
              LEARN
            </span>
          </div>
        </div>

        {/* Arrow Divider */}
        <div className="flex justify-center -my-2 relative z-10">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Output Token (LearnUSD) */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>You Receive (Estimated Output)</span>
            <span className="text-emerald-400 font-mono">
              {!isPoolEmpty && reserveA > 0n 
                ? `Rate: ~${(Number(reserveB) / Number(reserveA)).toFixed(2)} LUSD/LEARN`
                : "Rate: Pool unseeded"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={!isPoolEmpty ? parseFloat(estimatedOut).toFixed(4) : "0.0000"}
              className="flex-1 bg-transparent text-lg font-bold text-emerald-400 font-mono focus:outline-none"
            />
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
              LUSD
            </span>
          </div>
        </div>

        {/* Slippage & Metrics Breakdown */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500">Slippage Tolerance:</span>
            <div className="flex gap-1">
              {[0.5, 1.0, 2.0].map(val => (
                <button
                  key={val}
                  onClick={() => setSlippagePercent(val)}
                  disabled={isPoolEmpty}
                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                    slippagePercent === val ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-500'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Minimum Output Guaranteed:</span>
            <span className="text-slate-300">
              {!isPoolEmpty ? (parseFloat(estimatedOut) * (1 - slippagePercent / 100)).toFixed(4) : "0.0000"} LUSD
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estimated Price Impact:</span>
            <span className={Number(priceImpactPct) > 5 ? "text-amber-400" : "text-emerald-400"}>
              {!isPoolEmpty ? `${priceImpactPct}%` : "0.00%"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">LP Swap Fee (0.3%):</span>
            <span className="text-slate-300">{(parseFloat(amountIn || "0") * 0.003).toFixed(4)} LEARN</span>
          </div>
        </div>

        {/* Swap Action or Needs Approval */}
        {needsSwapApproval && !isPoolEmpty ? (
          <button
            onClick={() => handleApproveLearn(amountIn || "100")}
            disabled={isAwaitingSignature || isPendingBroadcast}
            className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAwaitingSignature && seedPendingType === 'approveLearn' ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Confirm Approval in Wallet...</span>
              </>
            ) : (
              <>
                <span>Approve {amountIn} LEARN to Enable Swap</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleSwap}
            disabled={!isConnected || isAwaitingSignature || isPendingBroadcast || isPoolEmpty || parseFloat(amountIn || "0") <= 0}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPoolEmpty ? (
              <span>⚠️ Cannot Swap: Pool Has 0 Liquidity (Seed Pool Above)</span>
            ) : isAwaitingSignature && seedPendingType === 'swap' ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Confirm Swap in Wallet...</span>
              </>
            ) : isPendingBroadcast && seedPendingType === 'swap' ? (
              <>
                <Clock className="w-4 h-4 animate-spin text-amber-300" />
                <span>Executing AMM Swap on Arbitrum...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Execute Swap: {amountIn} LEARN ➔ LUSD</span>
              </>
            )}
          </button>
        )}

        {actionError && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              {actionError.message.includes("Insufficient liquidity") 
                ? "Reverted: The AMM pool has zero liquidity. Please seed liquidity first."
                : actionError.message.includes("User rejected") 
                ? "Transaction was rejected in wallet." 
                : actionError.message}
            </span>
          </div>
        )}
      </div>

      {/* Explorer Receipt */}
      {txHash && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">Transaction Receipt:</span>
          <ExplorerLink type="tx" value={txHash} />
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">Reward: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Unlocked Stage 9: Liquidity Provision</span>
          </span>
        )}
      </div>

    </div>
  );
}

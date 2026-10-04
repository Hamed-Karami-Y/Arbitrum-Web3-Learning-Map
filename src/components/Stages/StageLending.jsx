// src/components/Stages/StageLending.jsx
// Stage 14: Lending & Money Markets - Collateralized borrowing, LTV, and liquidation health factors

import React, { useState } from 'react';
import { 
  Landmark, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingDown, 
  Percent, 
  ArrowRight, 
  AlertTriangle,
  Zap,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';

export function StageLending({ stage }) {
  const { completeStage, isStageCompleted, setActiveStage } = useLearning();
  const completed = isStageCompleted(stage.id);

  // Simulation State
  const [collateralEth, setCollateralEth] = useState(1.0);
  const [ethPrice, setEthPrice] = useState(3000);
  const [borrowUsdc, setBorrowUsdc] = useState(1500);
  const [understoodConcepts, setUnderstoodConcepts] = useState({
    ltv: false,
    health: false,
    liquidation: false,
  });

  const collateralValue = collateralEth * ethPrice;
  const maxLtvPct = 0.80; // 80% Max LTV
  const maxBorrow = collateralValue * maxLtvPct;
  const liquidationThreshold = 0.85; // 85% Liquidation threshold

  // Health Factor = (Collateral Value * Liquidation Threshold) / Borrowed Amount
  const healthFactor = borrowUsdc > 0 
    ? (collateralValue * liquidationThreshold) / borrowUsdc 
    : 99.9;

  const currentLtvPct = collateralValue > 0 ? (borrowUsdc / collateralValue) * 100 : 0;

  // Determine risk category
  let statusColor = "text-emerald-400";
  let statusBg = "bg-emerald-950/40 border-emerald-500/30";
  let statusText = "Safe & Healthy (HF > 1.5)";

  if (healthFactor < 1.0) {
    statusColor = "text-red-400";
    statusBg = "bg-red-950/50 border-red-500/40";
    statusText = "LIQUIDATION TRIGGERED (HF < 1.0)";
  } else if (healthFactor < 1.25) {
    statusColor = "text-amber-400";
    statusBg = "bg-amber-950/50 border-amber-500/40";
    statusText = "High Risk Zone (HF < 1.25)";
  } else if (healthFactor < 1.5) {
    statusColor = "text-cyan-400";
    statusBg = "bg-cyan-950/40 border-cyan-500/30";
    statusText = "Moderate Margin (1.25 - 1.5)";
  }

  const handleComplete = () => {
    completeStage(stage.id, {
      type: "Lending & Money Markets Mastery",
      healthFactor: healthFactor.toFixed(2),
      status: "Verified",
      notes: "Student explored over-collateralization, LTV mechanics, and liquidation thresholds."
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Educational Notice */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
        <Landmark className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-indigo-300 font-mono uppercase tracking-wide">
            Decentralized Lending Protocols (Aave v3 & Silo on Arbitrum)
          </div>
          <p className="text-slate-300 leading-relaxed">
            In traditional finance, loans require credit scores and legal recourse. In Web3, money markets use <strong>Over-Collateralization</strong>: borrowers lock crypto assets worth more than the loan amount. If the collateral value drops, liquidators automatically repay the loan to protect depositors.
          </p>
        </div>
      </div>

      {/* Interactive Health Factor Simulator */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Interactive Health Factor & Liquidation Simulator</span>
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800/60">
            Aave v3 Model
          </span>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Collateral Deposited</span>
            <span className="text-white font-bold text-sm">{collateralEth} ETH</span>
            <span className="text-[10px] text-cyan-400 block">${collateralValue.toLocaleString()} USD</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Borrowed Debt</span>
            <span className="text-emerald-400 font-bold text-sm">${borrowUsdc.toLocaleString()} USDC</span>
            <span className="text-[10px] text-slate-400 block">LTV: {currentLtvPct.toFixed(1)}% (Max 80%)</span>
          </div>

          <div className={`p-3 rounded-xl border ${statusBg}`}>
            <span className="text-[10px] text-slate-400 uppercase block">Health Factor (HF)</span>
            <span className={`font-bold text-base ${statusColor}`}>
              {healthFactor > 20 ? "> 20.0" : healthFactor.toFixed(2)}
            </span>
            <span className={`text-[10px] block ${statusColor} truncate`}>{statusText}</span>
          </div>
        </div>

        {/* Sliders for Hands-on Experimentation */}
        <div className="space-y-4 pt-1">
          {/* Borrow Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-mono">1. Borrow Amount (USDC):</span>
              <span className="text-white font-mono font-bold">${borrowUsdc} USDC</span>
            </div>
            <input 
              type="range"
              min="0"
              max={Math.floor(collateralValue)}
              step="50"
              value={borrowUsdc}
              onChange={(e) => setBorrowUsdc(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>$0 (No Debt)</span>
              <span className="text-amber-400">Max Safe Borrow: ${(collateralValue * 0.7).toFixed(0)}</span>
              <span className="text-red-400">Liquidation: ${(collateralValue * liquidationThreshold).toFixed(0)}</span>
            </div>
          </div>

          {/* Market Price Stress Test Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-mono">2. Market Price Stress Test (ETH Price):</span>
              <span className="text-cyan-300 font-mono font-bold">${ethPrice} / ETH</span>
            </div>
            <input 
              type="range"
              min="1000"
              max="4000"
              step="100"
              value={ethPrice}
              onChange={(e) => setEthPrice(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span className="text-red-400">$1,000 (Market Crash)</span>
              <span>$3,000 (Current)</span>
              <span className="text-emerald-400">$4,000 (Bull Market)</span>
            </div>
          </div>
        </div>

        {/* Liquidation Explanation Callout */}
        {healthFactor < 1.0 && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 space-y-1 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-red-300">Position Liquidated!</strong>
              Liquidator bots on Arbitrum have invoked the smart contract liquidation function, repaying your ${borrowUsdc} debt and seizing your collateral plus a 5% liquidation penalty to ensure protocol solvency.
            </div>
          </div>
        )}
      </div>

      {/* Core Protocol Takeaways */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h5 className="font-bold text-xs text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Key Concepts of Arbitrum Money Markets</span>
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <strong className="text-cyan-300 block">Over-Collateralization</strong>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Loans must always have excess backing. You cannot borrow $1,000 without locking &gt; $1,250 in collateral.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <strong className="text-emerald-300 block">Dynamic APY</strong>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Borrowing interest rises automatically as pool liquidity becomes scarce (utilization curve).
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <strong className="text-purple-300 block">Flash Loans</strong>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Zero-collateral borrowing allowed if borrowed funds and fee are returned within the exact same atomic transaction block.
            </p>
          </div>
        </div>
      </div>

      {/* Verification & Completion Action */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">Stage Reward:</span>
          <span className="text-amber-400 font-mono font-bold">+{stage.xp} XP</span>
        </div>

        {completed ? (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Stage 14 Completed! (+{stage.xp} XP Earned)</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Status: Verified</span>
            </div>

            <button
              onClick={() => setActiveStage("stage-15")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Stage 15: Arbitrum Nitro Bridge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleComplete}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Complete Module & Claim +{stage.xp} XP</span>
          </button>
        )}
      </div>

    </div>
  );
}

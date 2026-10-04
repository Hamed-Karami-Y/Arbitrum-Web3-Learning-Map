// src/components/Stages/StageGas.jsx
// Stage 3: Gas & Nitro Efficiency - Master gas metrics and acquire testnet ETH

import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { arbitrumSepolia } from 'viem/chains';
import { 
  Fuel, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  Coins,
  ArrowRight,
  Info
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { FAUCET_RESOURCES } from '../../config/demoAddresses.js';
import { APP_CONFIG } from '../../config/environment.js';

export function StageGas({ stage }) {
  const { address, isConnected } = useAccount();
  const { data: balanceData, isLoading: isBalanceLoading, refetch } = useBalance({
    address,
    chainId: arbitrumSepolia.id,
  });

  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  const ethBalance = parseFloat(balanceData?.formatted || "0");
  const hasGas = ethBalance > 0.0001;

  const handleVerify = () => {
    completeStage(stage.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Educational Gas Mechanics */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h4 className="font-bold text-sm text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-2">
          <Fuel className="w-4 h-4" />
          <span>Understanding Gas on Arbitrum</span>
        </h4>
        
        <p className="text-xs text-slate-300 leading-relaxed">
          Every onchain action consumes computing power. Gas is the fee paid in native <strong>ETH</strong> to process your transaction. On Arbitrum Nitro, gas is divided into two distinct components:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-white">1. L2 Execution Gas</span>
            <p className="text-[11px] text-slate-400">
              The cost to execute the smart contract instructions on Arbitrum. Extremely cheap (often &lt;0.1 Gwei).
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-white">2. L1 Calldata Posting Cost</span>
            <p className="text-[11px] text-slate-400">
              The cost to post compressed transaction data to Ethereum Layer 1 for permanent security.
            </p>
          </div>
        </div>
      </div>

      {/* User Balance Check */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400">
            Your Arbitrum Sepolia ETH Balance
          </span>
          <div className="text-2xl font-bold font-mono text-white mt-0.5 flex items-center gap-2">
            <span>{isBalanceLoading ? "Reading..." : `${ethBalance.toFixed(5)} ETH`}</span>
            <button
              onClick={() => refetch()}
              className="text-slate-500 hover:text-cyan-400 text-xs p-1"
              title="Refresh Balance"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {hasGas ? "You have sufficient ETH for testnet fees!" : "You will need testnet ETH for the next practical transaction."}
          </p>
        </div>

        {/* Primary Faucet Button */}
        <a
          href={APP_CONFIG.faucetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all whitespace-nowrap"
        >
          <Coins className="w-4 h-4" />
          <span>Get Free Test ETH</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Recommended Faucets List */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h5 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Official Arbitrum Sepolia Faucets</span>
        </h5>

        <div className="space-y-2">
          {FAUCET_RESOURCES.map((faucet, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-white">{faucet.name}</div>
                <div className="text-[11px] text-slate-400">{faucet.description}</div>
              </div>
              <a
                href={faucet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline px-2.5 py-1 rounded bg-blue-950/60 border border-blue-800/40"
              >
                <span>Open</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Completion & XP Button */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          Reward for completing Stage 3: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong>
        </div>
        <button
          onClick={handleVerify}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg active:scale-95 ${
            completed
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-cyan-500/25'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{completed ? "Completed (Claimed +50 XP)" : "Verify Gas Knowledge & Unlock Stage 4"}</span>
        </button>
      </div>

    </div>
  );
}

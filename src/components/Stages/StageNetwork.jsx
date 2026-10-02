// src/components/Stages/StageNetwork.jsx
// Stage 2: Network & Nitro Architecture - Deep dive into L2 rollups, RPCs, and explorers

import React from 'react';
import { useAccount, useBlockNumber } from 'wagmi';
import { arbitrumSepolia } from 'viem/chains';
import { 
  Layers, 
  Server, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { ARBITRUM_SEPOLIA_CHAIN_ID } from '../../config/chain.js';
import { EXPLORER_BASE_URL } from '../../config/contracts.js';

export function StageNetwork({ stage }) {
  const { isConnected, chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ chainId: arbitrumSepolia.id, watch: true });
  const { completeStage, isStageCompleted } = useLearning();

  const completed = isStageCompleted(stage.id);
  const isCorrectNetwork = isConnected && chain?.id === ARBITRUM_SEPOLIA_CHAIN_ID;

  const handleVerify = () => {
    completeStage(stage.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Nitro Architecture Diagram */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 space-y-4">
        <h4 className="font-bold text-sm text-cyan-300 font-mono uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Arbitrum Nitro Rollup Architecture</span>
        </h4>
        
        {/* Interactive Architecture Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-mono">1</span>
              <span>Sequencer (L2)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Receives transactions instantly. Orders them and gives sub-second soft confirmations.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-mono">2</span>
              <span>WASM / Nitro Engine</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Executes EVM bytecode using WebAssembly core for blistering efficiency.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-mono">3</span>
              <span>Batch Post to L1</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Batches compressed transaction data to Ethereum Layer 1, inheriting Ethereum security.
            </p>
          </div>
        </div>
      </div>

      {/* Network Parameters Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>Active Testnet Specifications</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase">Network Name</span>
            <div className="text-white font-bold">Arbitrum Sepolia</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase">Chain ID (EIP-155)</span>
            <div className="text-cyan-300 font-bold">421614 (0x66eee)</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase">RPC Endpoint</span>
            <div className="text-slate-300 truncate">https://sepolia-rollup.arbitrum.io/rpc</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase">Live Nitro Block Height</span>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>#{blockNumber ? blockNumber.toString() : "Syncing..."}</span>
            </div>
          </div>
        </div>

        {/* Explorer Reference */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">Block Explorer</div>
            <p className="text-[11px] text-slate-400">Inspect blocks, transactions, and gas data on Arbiscan.</p>
          </div>
          <a
            href={EXPLORER_BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/50"
          >
            <span>Arbiscan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Completion & XP Button */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          Reward for completing Stage 2: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong>
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
          <span>{completed ? "Completed (Claimed +75 XP)" : "Verify Network Mastery & Unlock Stage 3"}</span>
        </button>
      </div>

    </div>
  );
}

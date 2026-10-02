// src/components/Stages/StageGraduation.jsx
// Mainnet Graduation: From Zero to Confident Onchain Practitioner

import React, { useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink,
  Sparkles,
  Award,
  Layers,
  Fuel,
  ArrowRight
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { arbitrumOne } from '../../config/chain.js';

export function StageGraduation({ stage }) {
  const { isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { 
    completedStages, 
    completeStage, 
    isStageCompleted,
    xp,
    journeyLevel,
    levelTitle 
  } = useLearning();

  const completed = isStageCompleted(stage.id);

  const [checklist, setChecklist] = useState({
    wallet: true,
    gas: true,
    realTx: true,
    approvals: true,
    defi: true,
    security: true,
  });

  const handleClaimGraduation = () => {
    completeStage(stage.id);
  };

  const isArbitrumOne = isConnected && chain?.id === arbitrumOne.id;

  return (
    <div className="space-y-6">
      
      {/* Hero Graduation Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border-2 border-cyan-400/40 relative overflow-hidden shadow-2xl text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
          <GraduationCap className="w-9 h-9" />
        </div>

        <div>
          <span className="font-mono text-xs uppercase text-cyan-400 font-bold tracking-widest px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40">
            Curriculum Milestone
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Mainnet Readiness Achieved
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-1 leading-relaxed">
            You have successfully progressed from having zero Web3 knowledge to executing verified transactions, swaps, liquidity, staking, and threat mitigation.
          </p>
        </div>

        {/* User Stats Pill */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs">
          <span className="text-amber-400 font-bold">{xp} Total XP</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400 font-bold">Level {journeyLevel} {levelTitle}</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-bold">{completedStages.length} Verified Modules</span>
        </div>
      </div>

      {/* Graduation Checklist */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Graduation Readiness Verification</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {[
            { key: 'wallet', label: '✓ I understand wallets, keys & seed phrases' },
            { key: 'gas', label: '✓ I understand gas units & Nitro efficiency' },
            { key: 'realTx', label: '✓ I completed a verified onchain transaction' },
            { key: 'approvals', label: '✓ I understand ERC-20 approvals & revoke risks' },
            { key: 'defi', label: '✓ I understand AMMs, pools, and staking' },
            { key: 'security', label: '✓ I understand phishing detection & threat defense' },
          ].map(item => (
            <div 
              key={item.key}
              className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 text-emerald-300 flex items-center gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Arbitrum One Mainnet Transition Guidelines */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Arbitrum One Mainnet Overview</span>
          </h4>
          <span className="font-mono text-xs text-slate-400">Chain ID 42161</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Arbitrum One is the production Layer 2 network where real assets trade. When you feel ready to explore production Web3 dApps (Camelot, GMX, Uniswap, Aave), keep these golden rules in mind:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400">1. Real Funds & Gas</span>
            <p className="text-[11px] text-slate-400">
              ETH has real monetary cost. Always double check recipients, amounts, and decimal places.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400">2. Pre-Sign Simulation</span>
            <p className="text-[11px] text-slate-400">
              Use wallets like Rabby or MetaMask Snaps that simulate balance changes before you sign.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400">3. Routine Revokes</span>
            <p className="text-[11px] text-slate-400">
              Regularly audit and revoke unused token approvals via Revoke.cash.
            </p>
          </div>
        </div>

        {/* Optional Network Switch (Educational only - NO forced money transaction!) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div>
            <span className="font-bold text-white">Explore Arbitrum One Network</span>
            <p className="text-[11px] text-slate-400">Switch your wallet to view production state. (Never required to deposit)</p>
          </div>
          <button
            onClick={() => switchChain({ chainId: arbitrumOne.id })}
            disabled={!isConnected || isArbitrumOne}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {isArbitrumOne ? "Connected to Arbitrum One" : "Switch to Arbitrum One"}
          </button>
        </div>
      </div>

      {/* Graduation Claim Button */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          Graduation Distinction: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong>
        </div>
        <button
          onClick={handleClaimGraduation}
          className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xl active:scale-95 ${
            completed
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/25'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{completed ? "Graduated! (Honors Distinction)" : "Claim Arbitrum Web3 Graduate Distinction"}</span>
        </button>
      </div>

    </div>
  );
}

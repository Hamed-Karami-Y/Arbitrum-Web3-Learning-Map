// src/components/Profile/ProfileModal.jsx
// User Profile view: Progress, XP, onchain achievements, and transaction history

import React from 'react';
import { useAccount } from 'wagmi';
import { 
  User, 
  Award, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';
import { UserAvatar } from '../Common/UserAvatar.jsx';

export function ProfileModal() {
  const { address, isConnected, chain } = useAccount();
  const { 
    xp, 
    journeyLevel, 
    levelTitle, 
    progressPercent, 
    completedStages, 
    coreCompletedCount, 
    totalCoreStages,
    txHistory,
    setCurrentView 
  } = useLearning();

  const achievements = [
    {
      id: "ach-1",
      title: "First Steps into Cryptography",
      desc: "Completed Stage 0 Sandbox basics with simulated keypairs",
      unlocked: completedStages.includes("stage-0"),
      icon: Sparkles,
      color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
    },
    {
      id: "ach-2",
      title: "Arbitrum Onchain Initiate",
      desc: "Sent first verified native transaction on Arbitrum Sepolia",
      unlocked: completedStages.includes("stage-4"),
      icon: Flame,
      color: "text-blue-400 bg-blue-500/20 border-blue-500/30"
    },
    {
      id: "ach-3",
      title: "DeFi Liquidity Provider",
      desc: "Interacted with automated market maker & provided liquidity",
      unlocked: completedStages.includes("stage-9"),
      icon: Compass,
      color: "text-purple-400 bg-purple-500/20 border-purple-500/30"
    },
    {
      id: "ach-4",
      title: "Certified Security Sentinel",
      desc: "Passed the threat detection simulator with 100% defense score",
      unlocked: completedStages.includes("stage-13"),
      icon: ShieldCheck,
      color: "text-amber-400 bg-amber-500/20 border-amber-500/30"
    }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <UserAvatar address={address} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isConnected ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Guest Explorer"}
              </h2>
              <span className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-blue-500/20 text-cyan-400 border border-blue-500/40">
                {chain?.name || "Arbitrum Sepolia"}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Level {journeyLevel} • {levelTitle}
            </p>
          </div>
        </div>

        {/* Stats Counters */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[90px]">
            <span className="text-slate-500 text-[10px] uppercase block">Total XP</span>
            <span className="text-amber-400 font-bold text-base">{xp}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[90px]">
            <span className="text-slate-500 text-[10px] uppercase block">Completed</span>
            <span className="text-emerald-400 font-bold text-base">{coreCompletedCount} / {totalCoreStages}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[90px]">
            <span className="text-slate-500 text-[10px] uppercase block">Mastery</span>
            <span className="text-cyan-400 font-bold text-base">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Earned Achievements Grid */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <span>Earned Achievements & Badges</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {achievements.filter(a => a.unlocked).length} of {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {achievements.map(ach => {
            const Icon = ach.icon;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  ach.unlocked 
                    ? 'bg-slate-950 border-slate-700 shadow-md' 
                    : 'bg-slate-950/40 border-slate-900 opacity-40'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 border ${ach.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-white mb-1">{ach.title}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{ach.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Onchain Transactions Log */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>Curriculum Transaction Ledger</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {txHistory.length} Recorded Transactions
          </span>
        </div>

        {txHistory.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 font-mono space-y-2">
            <p>No onchain transactions recorded in this browser yet.</p>
            <button
              onClick={() => setCurrentView('map')}
              className="text-cyan-400 hover:underline"
            >
              Start Stage 4 to perform your first transaction →
            </button>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {txHistory.map(tx => (
              <div 
                key={tx.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{tx.type}</span>
                    {tx.amount && <span className="text-cyan-300">({tx.amount})</span>}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {tx.timestamp} {tx.blockNumber && `• Block #${tx.blockNumber}`}
                  </div>
                </div>

                {tx.hash && (
                  <ExplorerLink type="tx" value={tx.hash} label="View on Arbiscan ↗" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

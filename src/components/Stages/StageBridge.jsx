// src/components/Stages/StageBridge.jsx
// Stage 15: Arbitrum Nitro Bridge - Cross-chain messaging, rollup inbox/outbox, and fraud proofs

import React, { useState } from 'react';
import { 
  GitCompare, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Lock, 
  FastForward, 
  Zap,
  ArrowDownUp,
  ExternalLink
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';

export function StageBridge({ stage }) {
  const { completeStage, isStageCompleted, setActiveStage } = useLearning();
  const completed = isStageCompleted(stage.id);

  const [activeTab, setActiveTab] = useState('withdraw'); // 'deposit' | 'withdraw' | 'fast'
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);

    setTimeout(() => {
      setSimStep(2);
      setTimeout(() => {
        setSimStep(3);
        setTimeout(() => {
          setSimStep(4);
          setIsSimulating(false);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const handleComplete = () => {
    completeStage(stage.id, {
      type: "Arbitrum Nitro Bridge Masterclass",
      status: "Verified",
      notes: "Student mastered L1-L2 inbox/outbox messaging, 7-day challenge dispute window, and fast bridge liquidity mechanisms."
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Educational Notice */}
      <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
        <GitCompare className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-cyan-300 font-mono uppercase tracking-wide">
            Arbitrum Nitro Cross-Chain Bridge Architecture
          </div>
          <p className="text-slate-300 leading-relaxed">
            Arbitrum doesn't live on an isolated blockchain—it derives 100% of its security directly from Ethereum Layer 1. Trustless communication between L1 and L2 is mediated by onchain smart contracts: the <strong>Delayed Inbox</strong>, the <strong>Sequencer Inbox</strong>, and the <strong>Outbox</strong>.
          </p>
        </div>
      </div>

      {/* Interactive Bridge Mechanism Explorer */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <ArrowDownUp className="w-4 h-4 text-cyan-400" />
            <span>Cross-Chain Lifecycle Simulator</span>
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800/60">
            Arbitrum Nitro Engine
          </span>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
          <button
            onClick={() => { setActiveTab('withdraw'); setSimStep(0); }}
            className={`py-2 px-3 rounded-lg font-bold transition-all ${
              activeTab === 'withdraw' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            L2 ➔ L1 Native (7 Days)
          </button>
          <button
            onClick={() => { setActiveTab('fast'); setSimStep(0); }}
            className={`py-2 px-3 rounded-lg font-bold transition-all ${
              activeTab === 'fast' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fast Bridge (&lt; 2 Mins)
          </button>
          <button
            onClick={() => { setActiveTab('deposit'); setSimStep(0); }}
            className={`py-2 px-3 rounded-lg font-bold transition-all ${
              activeTab === 'deposit' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            L1 ➔ L2 Deposit (10 Mins)
          </button>
        </div>

        {/* Pipeline Details */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          
          {activeTab === 'withdraw' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-bold">Standard Native Arbitrum Withdrawal</span>
                <span className="text-amber-400 font-mono text-[11px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>7-Day Dispute Window Required</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Why does native withdrawal take 7 days? Because Arbitrum is an <em>Optimistic Rollup</em>. State transitions are assumed valid unless challenged. The 7-day challenge window guarantees any validator can submit an interactive fraud proof on Ethereum L1 if an invalid state assertion was made.
              </p>

              {/* Step Flow */}
              <div className="grid grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
                <div className={`p-2.5 rounded-lg border transition-all ${simStep >= 1 ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  <span className="block font-bold">1. Burn on L2</span>
                  <span className="text-[10px] text-slate-400">Tokens burned</span>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${simStep >= 2 ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  <span className="block font-bold">2. Assert RBlock</span>
                  <span className="text-[10px] text-slate-400">Posted to L1</span>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${simStep >= 3 ? 'border-amber-400 bg-amber-950/40 text-amber-200' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  <span className="block font-bold">3. 7-Day Window</span>
                  <span className="text-[10px] text-slate-400">Dispute period</span>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${simStep >= 4 ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  <span className="block font-bold">4. Claim on L1</span>
                  <span className="text-[10px] text-slate-400">Outbox unlocked</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fast' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-bold">Fast Liquidity Bridges (Across, Stargate, Hop)</span>
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Instant (~60 to 90 seconds)</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Fast bridges solve the 7-day wait through <strong>Market Maker Liquidity Pools</strong>. Instead of waiting for the native rollup window, an automated market maker on Ethereum L1 immediately fronts you their own funds in exchange for a small rebalancing fee (typically 0.05% to 0.15%). The market maker waits the 7 days to recoup their liquidity.
              </p>

              {/* Step Flow */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
                <div className={`p-2.5 rounded-lg border transition-all ${simStep >= 1 ? 'border-purple-400 bg-purple-950/40 text-purple-200' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  <span className="block font-bold">1. Deposit on L2</span>
                  <span className="text-[10px] text-slate-400">Lock with Relayer</span>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${simStep >= 2 ? 'border-purple-400 bg-purple-950/40 text-purple-200' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  <span className="block font-bold">2. Intent Relayed</span>
                  <span className="text-[10px] text-slate-400">Relayer verifies</span>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${simStep >= 3 ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  <span className="block font-bold">3. Instant L1 Payout</span>
                  <span className="text-[10px] text-slate-400">Pool transfers ETH</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deposit' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-bold">Native L1 to L2 Deposit</span>
                <span className="text-cyan-400 font-mono text-[11px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~10 to 15 Minutes</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Depositing from Ethereum to Arbitrum is simpler and safe from reorgs. Funds are sent to the <code>DelayedInbox</code> contract on L1. The Arbitrum Sequencer ingests the message and credits your balance on Layer 2 once sufficient L1 block confirmations have elapsed.
              </p>

              {/* Step Flow */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
                <div className={`p-2.5 rounded-lg border transition-all ${simStep >= 1 ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  <span className="block font-bold">1. L1 Inbox Deposit</span>
                  <span className="text-[10px] text-slate-400">ETH locked on L1</span>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${simStep >= 2 ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  <span className="block font-bold">2. Sequencer Ingestion</span>
                  <span className="text-[10px] text-slate-400">Batch included</span>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${simStep >= 3 ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  <span className="block font-bold">3. Minted on L2</span>
                  <span className="text-[10px] text-slate-400">Available in wallet</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Simulation Trigger Button */}
          <div className="pt-2">
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Simulating Cross-Chain Lifecycle (Step {simStep})...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simulate Cross-Chain Transaction Lifecycle</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Safety Rules for Bridges */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
        <h5 className="font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Bridge Security Golden Rules</span>
        </h5>
        <ul className="space-y-1.5 text-slate-300 list-disc list-inside text-[11px] leading-relaxed">
          <li><strong>Always bookmark official bridge URLs:</strong> Beware of Google Ads phishing search results targeting bridge websites.</li>
          <li><strong>Never bridge obscure tokens:</strong> Bridge native ETH or standard USDC where liquidity is deepest to avoid high slippage.</li>
          <li><strong>Save your deposit tx hash:</strong> If funds don't appear in 15 minutes, the L1 transaction hash lets Arbitrum support diagnose state.</li>
        </ul>
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
                <span>Stage 15 Completed! (+{stage.xp} XP Earned)</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Status: Verified</span>
            </div>

            <button
              onClick={() => setActiveStage("stage-grad")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Proceed to Mainnet Ready: Arbitrum One ★</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleComplete}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Complete Bridge Masterclass & Claim +{stage.xp} XP</span>
          </button>
        )}
      </div>

    </div>
  );
}

// src/components/Stages/StageSecurityLab.jsx
// Stage 13: Security Mastery & Threat Lab - Interactive defense simulator for Web3 practitioners

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle,
  Sparkles,
  KeyRound,
  FileWarning,
  ExternalLink,
  ChevronRight,
  Slash
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { StageApproval } from './StageApproval.jsx';

export function StageSecurityLab({ stage }) {
  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  const [activeTab, setActiveTab] = useState('phishing'); // 'phishing' | 'approval' | 'seed' | 'revoke'
  const [phishingAnswers, setPhishingAnswers] = useState({});
  const [approvalChoice, setApprovalChoice] = useState(null);
  const [seedChecklist, setSeedChecklist] = useState({
    noWebsitePrompt: false,
    storeOffline: false,
    hardwareWallet: false,
  });

  // Phishing Scenarios
  const PHISHING_SCENARIOS = [
    {
      id: "scen-1",
      title: "Scenario 1: Discord Direct Message Airdrop",
      dappUrl: "https://arbitrum-airdrop-claim-now.xyz",
      promptText: "Claim 5,000 ARB now! Connect wallet and sign permit to claim your allocation.",
      actionRequested: "Permit2: TransferFrom(All Tokens)",
      isPhishing: true,
      explanation: "Scam! Arbitrum never distributes airdrops via random Discord DMs or unofficial domains (.xyz). The Permit2 signature would allow the attacker to drain all your tokens."
    },
    {
      id: "scen-2",
      title: "Scenario 2: Official Bridge Interaction",
      dappUrl: "https://bridge.arbitrum.io",
      promptText: "Deposit 0.1 ETH from Ethereum Sepolia to Arbitrum Sepolia.",
      actionRequested: "Native ETH Deposit to L1 Inbox Contract",
      isPhishing: false,
      explanation: "Legitimate! This is the official Arbitrum bridge portal on the verified arbitrum.io domain. The transaction deposits ETH to the verified rollup inbox contract."
    },
    {
      id: "scen-3",
      title: "Scenario 3: Urgent Security Revoke Prompt",
      dappUrl: "https://revoke-security-arbitrum.net",
      promptText: "URGENT VULNERABILITY! Enter your 12-word seed phrase to verify and revoke compromised contracts.",
      actionRequested: "Input Seed Phrase",
      isPhishing: true,
      explanation: "Fatal Scam! Legitimate security tools NEVER request seed phrases or private keys. Entering your seed phrase allows attackers to immediately drain your wallet."
    }
  ];

  const handlePhishingSelect = (id, userGuess) => {
    setPhishingAnswers(prev => ({ ...prev, [id]: userGuess }));
  };

  const allPhishingCorrect = PHISHING_SCENARIOS.every(
    scen => phishingAnswers[scen.id] === (scen.isPhishing ? 'reject' : 'approve')
  );

  const isApprovalCorrect = approvalChoice === 'unlimited';
  const isSeedChecklistComplete = Object.values(seedChecklist).every(Boolean);

  const canComplete = allPhishingCorrect && isApprovalCorrect && isSeedChecklistComplete;

  const handleVerify = () => {
    completeStage(stage.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-amber-300 font-mono uppercase tracking-wide">
            Zone 5: Web3 Threat Simulator
          </div>
          <p className="text-slate-300 leading-relaxed">
            In Web3, transactions cannot be reversed by customer support. You are solely responsible for your private keys and signatures. Test your security intuition across 4 realistic threat modules.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-mono">
        <button
          onClick={() => setActiveTab('phishing')}
          className={`px-4 py-2.5 font-bold transition-colors border-b-2 ${
            activeTab === 'phishing'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Exercise A: Phishing Detector
        </button>
        <button
          onClick={() => setActiveTab('approval')}
          className={`px-4 py-2.5 font-bold transition-colors border-b-2 ${
            activeTab === 'approval'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Exercise B: Approval Risk
        </button>
        <button
          onClick={() => setActiveTab('seed')}
          className={`px-4 py-2.5 font-bold transition-colors border-b-2 ${
            activeTab === 'seed'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Exercise C: Seed Hygiene
        </button>
      </div>

      {/* Tab 1: Phishing Scenarios */}
      {activeTab === 'phishing' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Review the following three connection & signing requests. Determine whether you would <strong>Approve</strong> or <strong>Reject</strong>:
          </p>

          <div className="space-y-3">
            {PHISHING_SCENARIOS.map((scen, idx) => {
              const userGuess = phishingAnswers[scen.id];
              const isCorrect = userGuess && userGuess === (scen.isPhishing ? 'reject' : 'approve');

              return (
                <div key={scen.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{scen.title}</span>
                    <span className="font-mono text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {scen.dappUrl}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono space-y-1">
                    <div className="text-slate-300 font-semibold">{scen.promptText}</div>
                    <div className="text-[11px] text-cyan-400">Action: {scen.actionRequested}</div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">Would you approve this request?</span>
                    <div className="flex gap-2 font-mono">
                      <button
                        onClick={() => handlePhishingSelect(scen.id, 'approve')}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                          userGuess === 'approve'
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handlePhishingSelect(scen.id, 'reject')}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                          userGuess === 'reject'
                            ? 'bg-red-600 text-white border-red-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        Reject (Dangerous)
                      </button>
                    </div>
                  </div>

                  {/* Feedback */}
                  {userGuess && (
                    <div className={`p-2.5 rounded-lg text-[11px] flex items-start gap-2 ${
                      isCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-red-950/40 text-red-300 border border-red-500/30'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                      <span>{scen.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Approval Risk Analyzer */}
      {activeTab === 'approval' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h4 className="font-bold text-sm text-white">Compare Token Approval Allowances</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Which of the following three allowance approvals presents the highest catastrophic financial exposure to your wallet?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: '10', title: 'Approved: 10 LEARN', risk: 'Low Risk', desc: 'Allows contract to withdraw a maximum of 10 tokens only.' },
              { id: '1000', title: 'Approved: 1,000 LEARN', risk: 'Medium Risk', desc: 'Allows contract to withdraw up to 1,000 tokens.' },
              { id: 'unlimited', title: 'Approved: Unlimited (Max Uint256)', risk: 'Highest Exposure Risk', desc: 'Allows contract to withdraw infinite tokens at any future time.' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setApprovalChoice(opt.id)}
                className={`p-4 rounded-xl border text-left transition-all font-mono text-xs ${
                  approvalChoice === opt.id
                    ? 'bg-blue-950/80 border-cyan-400 ring-1 ring-cyan-400'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white mb-1">{opt.title}</div>
                <div className={`text-[10px] uppercase font-bold mb-2 ${opt.id === 'unlimited' ? 'text-red-400' : 'text-slate-400'}`}>
                  {opt.risk}
                </div>
                <p className="text-[11px] text-slate-400">{opt.desc}</p>
              </button>
            ))}
          </div>

          {approvalChoice && (
            <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
              isApprovalCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-red-950/40 text-red-300 border border-red-500/30'
            }`}>
              {isApprovalCorrect ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>
                {isApprovalCorrect 
                  ? "Correct! 'Unlimited Max Uint256' allowances mean if that protocol gets hacked 6 months from now, attackers can drain every token in your wallet without asking for a new signature." 
                  : "Not quite. Limited approvals cap maximum losses, whereas unlimited approvals expose 100% of your current and future balance."}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Seed Phrase Hygiene */}
      {activeTab === 'seed' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>Seed Phrase & Hardware Wallet Rules</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your 12 or 24-word seed phrase is the master root key to your entire blockchain identity. Verify that you understand the 3 immutable laws of Web3 security:
          </p>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={seedChecklist.noWebsitePrompt}
                onChange={(e) => setSeedChecklist(prev => ({ ...prev, noWebsitePrompt: e.target.checked }))}
                className="mt-0.5 rounded text-cyan-500 focus:ring-0"
              />
              <span className="text-slate-300">
                <strong>No legitimate website will EVER ask for your seed phrase.</strong> Any popup, support agent, or dApp asking for your 12 words is an immediate scam.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={seedChecklist.storeOffline}
                onChange={(e) => setSeedChecklist(prev => ({ ...prev, storeOffline: e.target.checked }))}
                className="mt-0.5 rounded text-cyan-500 focus:ring-0"
              />
              <span className="text-slate-300">
                <strong>Store seed phrases offline on physical paper or stamped metal.</strong> Never take photos, save in cloud storage, email, or save in text files on computers.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={seedChecklist.hardwareWallet}
                onChange={(e) => setSeedChecklist(prev => ({ ...prev, hardwareWallet: e.target.checked }))}
                className="mt-0.5 rounded text-cyan-500 focus:ring-0"
              />
              <span className="text-slate-300">
                <strong>Hardware wallets (Ledger, Trezor) keep private keys isolated from internet malware.</strong> Highly recommended before holding meaningful assets on Arbitrum One mainnet.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Verification Action */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          Reward for completing Stage 13: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong>
        </div>
        <button
          onClick={handleVerify}
          disabled={!canComplete}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
            completed
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/25'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{completed ? "Completed (Claimed +300 XP)" : canComplete ? "Verify Security Mastery & Unlock Graduation" : "Complete All Exercises Above"}</span>
        </button>
      </div>

    </div>
  );
}

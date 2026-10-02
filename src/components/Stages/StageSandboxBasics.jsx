// src/components/Stages/StageSandboxBasics.jsx
// Stage 0: Web3 Wallet Basics - Pure Sandbox Simulation (Zero risk, NO real keys)

import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Send, 
  Eye, 
  EyeOff, 
  FileSignature, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';

export function StageSandboxBasics({ stage }) {
  const { sandboxState, updateSandbox, completeStage, isStageCompleted } = useLearning();
  
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [messageToSign, setMessageToSign] = useState("Arbitrum Odyssey: Zero to Onchain Explorer Verified");
  const [signatureOutput, setSignatureOutput] = useState("");
  const [simRecipient, setSimRecipient] = useState("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
  const [simAmount, setSimAmount] = useState("1.0");
  const [isSimulatingTx, setIsSimulatingTx] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const completed = isStageCompleted(stage.id);

  // Generate new simulated demo address
  const handleRegenerateSim = () => {
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    updateSandbox({
      simulatedAddress: `0x${randomHex}`,
      simulatedBalance: "10.00",
    });
    setSignatureOutput("");
  };

  // Simulate digital signature with private key
  const handleSignMessage = () => {
    if (!messageToSign) return;
    const fakeSig = "0x" + Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setSignatureOutput(fakeSig);
    updateSandbox(prev => ({
      ...prev,
      signedMessages: [
        { message: messageToSign, sig: fakeSig, timestamp: new Date().toLocaleTimeString() },
        ...(prev.signedMessages || []).slice(0, 4)
      ]
    }));
  };

  // Simulate non-onchain transfer
  const handleSimulatedTransfer = () => {
    const amt = parseFloat(simAmount);
    const bal = parseFloat(sandboxState.simulatedBalance);
    if (isNaN(amt) || amt <= 0 || amt > bal) return;

    setIsSimulatingTx(true);
    setTimeout(() => {
      const newBal = (bal - amt).toFixed(2);
      const fakeTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      updateSandbox(prev => ({
        ...prev,
        simulatedBalance: newBal,
        history: [
          {
            id: `sim-${Date.now()}`,
            action: `Simulated Transfer of ${amt} SIM-ETH`,
            type: "SIMULATED — NOT ONCHAIN",
            timestamp: new Date().toLocaleTimeString(),
            amount: `${amt} SIM-ETH`,
            hash: fakeTxHash,
            status: "Simulated Success"
          },
          ...(prev.history || []).slice(0, 9)
        ]
      }));
      setIsSimulatingTx(false);
    }, 700);
  };

  const handleVerifyStage = () => {
    completeStage(stage.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Explicit Safety Notice */}
      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-emerald-300 font-mono uppercase tracking-wide">
            Zone 0: Safe Sandbox Environment
          </div>
          <p className="text-emerald-200/90 leading-relaxed">
            This module visually simulates Web3 cryptographic concepts. No real wallet or real assets are used. Transactions are strictly <strong className="text-emerald-300">SIMULATED — NOT ONCHAIN</strong>.
          </p>
        </div>
      </div>

      {/* Simulated Sandbox Wallet Panel */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <h4 className="font-bold text-sm text-white">Simulated Account Generator</h4>
          </div>
          <button
            onClick={handleRegenerateSim}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 font-mono transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Generate New Demo Keypair</span>
          </button>
        </div>

        {/* Public Address */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 flex justify-between">
            <span>Public Address (Safe to share with anyone)</span>
            <span className="text-emerald-400 font-mono text-[10px]">SIMULATED</span>
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
            <span className="flex-1 select-all">{sandboxState.simulatedAddress}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(sandboxState.simulatedAddress);
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
              }}
              className="text-slate-400 hover:text-white p-1"
              title="Copy Address"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Private Key Simulator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Simulated Private Key (The secret mathematical signing key)</span>
            <button
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
            >
              {showPrivateKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showPrivateKey ? "Hide" : "Reveal Simulation"}</span>
            </button>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 select-all">
            {showPrivateKey 
              ? "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
              : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
          </div>
          <p className="text-[10px] text-amber-400/80 italic">
            Rule #1 of Web3: Real private keys and seed phrases should NEVER be entered or revealed on any website.
          </p>
        </div>

        {/* Balance Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/20 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-400">Sandbox Balance</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              {sandboxState.simulatedBalance} <span className="text-xs text-cyan-400">SIM-ETH</span>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono text-cyan-300">
            SIMULATED — NOT ONCHAIN
          </span>
        </div>
      </div>

      {/* Interactive Exercise 1: Cryptographic Digital Signing */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <FileSignature className="w-4 h-4 text-cyan-400" />
          <h4 className="font-bold text-sm text-white">Exercise A: Cryptographic Message Signing</h4>
        </div>
        <p className="text-xs text-slate-400">
          How do blockchains verify you authorized an action without seeing your password? Your private key generates a digital signature. Anyone can verify the signature using only your public address.
        </p>

        <div className="space-y-2">
          <input
            type="text"
            value={messageToSign}
            onChange={(e) => setMessageToSign(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            placeholder="Type message to sign..."
          />
          <button
            onClick={handleSignMessage}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <FileSignature className="w-3.5 h-3.5" />
            <span>Generate Cryptographic Signature</span>
          </button>
        </div>

        {signatureOutput && (
          <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1">
            <div className="text-[10px] text-cyan-400 font-mono uppercase font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Valid Signature Generated (ECDSA secp256k1)</span>
            </div>
            <p className="text-[10px] font-mono text-slate-300 break-all">
              {signatureOutput}
            </p>
          </div>
        )}
      </div>

      {/* Interactive Exercise 2: Simulated Transaction Execution */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-cyan-400" />
          <h4 className="font-bold text-sm text-white">Exercise B: Simulated Transaction</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">Recipient</label>
            <input
              type="text"
              value={simRecipient}
              onChange={(e) => setSimRecipient(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">Amount (SIM-ETH)</label>
            <input
              type="number"
              value={simAmount}
              onChange={(e) => setSimAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
              step="0.1"
              min="0.1"
            />
          </div>
        </div>

        <button
          onClick={handleSimulatedTransfer}
          disabled={isSimulatingTx}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
        >
          {isSimulatingTx ? "Executing Simulation..." : "Execute Simulated Transfer (SIMULATED — NOT ONCHAIN)"}
        </button>

        {/* Transaction History log */}
        {sandboxState.history && sandboxState.history.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Sandbox Activity Ledger</span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {sandboxState.history.map(tx => (
                <div key={tx.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <div>
                    <span className="text-white">{tx.action}</span>
                    <span className="text-slate-500 ml-2 text-[10px]">{tx.timestamp}</span>
                  </div>
                  <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {tx.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Completion & XP Button */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          Reward for completing Stage 0: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong>
        </div>
        <button
          onClick={handleVerifyStage}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg active:scale-95 ${
            completed
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-cyan-500/25'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{completed ? "Completed (Claimed +50 XP)" : "Verify Sandbox & Unlock Stage 1"}</span>
        </button>
      </div>

    </div>
  );
}

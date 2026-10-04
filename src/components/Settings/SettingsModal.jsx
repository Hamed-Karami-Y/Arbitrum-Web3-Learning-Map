// src/components/Settings/SettingsModal.jsx
// Application Settings & System Parameters view

import React, { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { 
  Settings, 
  RotateCcw, 
  Server, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { ARBITRUM_SEPOLIA_CHAIN_ID } from '../../config/chain.js';
import { CONTRACT_ADDRESSES, EXPLORER_BASE_URL } from '../../config/contracts.js';
import { APP_CONFIG } from '../../config/environment.js';

export function SettingsModal() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { resetProgress, setCurrentView } = useLearning();

  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 text-left">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 rounded-2xl overflow-hidden shadow-lg shadow-orange-500/20 ring-1 ring-orange-500/40 bg-slate-900 p-1">
            <img src="/logo.png" alt="Arbitrum Web3 Learning Map Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              <span>Platform Configuration & Network</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Arbitrum Web3 Learning Map • {APP_CONFIG.version} ({APP_CONFIG.buildTarget})
            </p>
          </div>
        </div>
      </div>

      {/* Network Specifications */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>Active Testnet Infrastructure</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase">Primary Network</span>
            <div className="text-white font-bold">Arbitrum Sepolia</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase">EIP-155 Chain ID</span>
            <div className="text-cyan-300 font-bold">{ARBITRUM_SEPOLIA_CHAIN_ID} (0x66eee)</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase">RPC Endpoint</span>
            <div className="text-slate-300 truncate">https://sepolia-rollup.arbitrum.io/rpc</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase">Block Explorer</span>
            <div className="text-cyan-400 truncate flex items-center gap-1">
              <span>{EXPLORER_BASE_URL}</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Deployed Contract Registry */}
        <div className="pt-2 space-y-2">
          <span className="text-[11px] font-mono uppercase text-slate-500 block">
            Arbitrum Sepolia Smart Contract Registry:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
            {Object.entries(CONTRACT_ADDRESSES).map(([name, addr]) => (
              <div key={name} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex justify-between items-center">
                <span className="text-slate-400">{name}:</span>
                <span className="text-cyan-300">{addr.slice(0, 8)}...{addr.slice(-6)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reset Progress Section */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-red-500/20 space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-red-400" />
          <span>Local Progress Management</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          All your stage completions and XP are stored locally in your browser's versioned localStorage. If you wish to replay the entire curriculum from zero, you can reset your local progress here.
        </p>

        {confirmReset ? (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Are you sure you want to reset all XP and stage progress?</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 font-bold text-xs transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Local Progress</span>
          </button>
        )}
      </div>

      {/* Disclaimers & Security Rules */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs text-slate-400 leading-relaxed">
        <div className="font-bold text-white font-mono uppercase tracking-wider text-[11px] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Essential Educational Disclaimers</span>
        </div>
        <ul className="list-disc list-inside space-y-1.5 text-slate-400 text-[11px]">
          <li><strong>Test tokens have no monetary value.</strong> Do not attempt to sell or purchase test tokens.</li>
          <li><strong>This project is an educational hackathon MVP and is not financial advice.</strong></li>
          <li><strong>Do not use real funds with educational contracts.</strong> Smart contracts in this project are not audited.</li>
          <li><strong>Never share your seed phrase or private key with any application.</strong></li>
          <li>Always verify network, contract, recipient, token, amount, approvals, and transaction details before signing.</li>
        </ul>
      </div>

    </div>
  );
}

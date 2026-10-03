// src/components/HUD/TopHUD.jsx
// Persistent top-level HUD showing user progression, network status, and wallet connection

import React from 'react';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { arbitrumSepolia } from 'viem/chains';
import { 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Settings as SettingsIcon, 
  Flame, 
  Zap, 
  AlertTriangle,
  Wallet,
  LogOut,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { ARBITRUM_SEPOLIA_CHAIN_ID } from '../../config/chain.js';
import { UserAvatar } from '../Common/UserAvatar.jsx';

export function TopHUD() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { 
    xp, 
    journeyLevel, 
    levelTitle, 
    progressPercent, 
    currentView, 
    setCurrentView,
    openStage 
  } = useLearning();

  const isWrongNetwork = isConnected && chain?.id !== ARBITRUM_SEPOLIA_CHAIN_ID;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b14]/95 backdrop-blur-md px-2.5 sm:px-4 lg:px-6 py-2 transition-all">
      <div className="w-full max-w-[1536px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        
        {/* Brand & Main View Selectors */}
        <div className="flex items-center justify-between shrink-0">
          <div 
            onClick={() => setCurrentView('landing')} 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform ring-1 ring-amber-500/40 bg-slate-900 shrink-0">
              <img src="/logo.png" alt="Arbitrum Web3 Learning Map Logo" className="w-full h-full object-cover" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-[#070b14]"></div>
            </div>
            <div className="shrink-0 flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
                <span className="inline lg:hidden">Arbitrum Web3 Map</span>
                <span className="hidden lg:inline">Arbitrum Web3 Learning Map</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] uppercase font-mono tracking-wider bg-blue-500/20 text-cyan-400 rounded border border-blue-500/30 whitespace-nowrap">
                Sepolia
              </span>
            </div>
          </div>

          {/* Mobile view quick nav icons */}
          <div className="flex items-center gap-1 md:hidden shrink-0">
            <button
              onClick={() => setCurrentView('map')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${currentView === 'map' ? 'bg-blue-600/30 text-cyan-400 border border-blue-500/40' : 'text-slate-400 hover:text-white'}`}
              title="Map"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('security')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${currentView === 'security' ? 'bg-amber-600/30 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-white'}`}
              title="Security Lab"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('quests')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${currentView === 'quests' ? 'bg-purple-600/30 text-purple-400 border border-purple-500/40' : 'text-slate-400 hover:text-white'}`}
              title="Quests"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${currentView === 'profile' ? 'bg-blue-600/30 text-cyan-400 border border-blue-500/40' : 'text-slate-400 hover:text-white'}`}
              title="Profile"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${currentView === 'settings' ? 'bg-blue-600/30 text-cyan-400 border border-blue-500/40' : 'text-slate-400 hover:text-white'}`}
              title="Settings"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 shrink-0">
          <button
            onClick={() => setCurrentView('map')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              currentView === 'map' 
                ? 'bg-blue-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/20' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span>Map</span>
          </button>

          <button
            onClick={() => setCurrentView('security')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              currentView === 'security' 
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="inline xl:hidden">Security</span>
            <span className="hidden xl:inline">Security Lab</span>
          </button>

          <button
            onClick={() => setCurrentView('quests')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              currentView === 'quests' 
                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Quests</span>
            <span className="text-[9px] px-1 bg-purple-500/30 text-purple-300 rounded font-mono">ECO</span>
          </button>

          <button
            onClick={() => setCurrentView('profile')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              currentView === 'profile' 
                ? 'bg-blue-500/15 text-cyan-400 border border-cyan-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              currentView === 'settings' 
                ? 'bg-blue-500/15 text-cyan-400 border border-cyan-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Center / Right: Progress Metrics, Network & Wallet */}
        <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
          
          {/* XP & Level HUD */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono shrink-0 whitespace-nowrap">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <span>{xp}</span>
              <span className="text-[10px] text-amber-500/80">XP</span>
            </div>
            <div className="w-[1px] h-3 bg-slate-700/80" />
            <div className="text-slate-400 text-[11px] flex items-center gap-1">
              <span className="text-cyan-400 font-semibold">LVL {journeyLevel}</span>
              <span className="hidden 2xl:inline text-slate-500">{levelTitle}</span>
            </div>
            <div className="w-[1px] h-3 bg-slate-700/80 hidden 2xl:block" />
            <div className="hidden 2xl:flex items-center gap-1.5">
              <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">{progressPercent}%</span>
            </div>
          </div>

          {/* Network & Wallet Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isConnected ? (
              isWrongNetwork ? (
                <button
                  onClick={() => switchChain({ chainId: arbitrumSepolia.id })}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-colors animate-pulse shrink-0 whitespace-nowrap"
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Switch Arb</span>
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-mono shrink-0 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                  <span>Arb Sepolia</span>
                </div>
              )
            ) : null}

            {isConnected ? (
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/70 rounded-lg py-1 px-1.5 shrink-0 whitespace-nowrap">
                <button
                  onClick={() => setCurrentView('profile')}
                  className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 hover:text-white transition-colors shrink-0"
                >
                  <UserAvatar address={address} size="xs" />
                  <span className="font-semibold">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                </button>
                <div className="w-[1px] h-3 bg-slate-700/60" />
                <button
                  onClick={() => disconnect()}
                  className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors shrink-0"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openStage('stage-1')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition-all active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Wallet className="w-3.5 h-3.5 shrink-0" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}

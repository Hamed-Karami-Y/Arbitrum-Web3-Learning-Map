// src/components/Map/MapNode.jsx
// Interactive constellation learning node representing a single curriculum stage

import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Sparkles, 
  ChevronRight,
  Shield,
  Layers,
  Fuel,
  Send,
  Coins,
  ArrowRightLeft,
  KeyRound,
  Droplets,
  Award,
  ShoppingBag,
  GraduationCap
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';

const STAGE_ICONS = {
  "stage-0": KeyRound,
  "stage-1": Shield,
  "stage-2": Layers,
  "stage-3": Fuel,
  "stage-4": Send,
  "stage-5": Coins,
  "stage-6": ArrowRightLeft,
  "stage-7": KeyRound,
  "stage-8": ArrowRightLeft,
  "stage-9": Droplets,
  "stage-10": Sparkles,
  "stage-11": Award,
  "stage-12": ShoppingBag,
  "stage-13": Shield,
  "stage-14": Layers,
  "stage-15": Layers,
  "stage-grad": GraduationCap,
};

export function MapNode({ stage }) {
  const { isStageCompleted, isStageUnlocked, openStage } = useLearning();

  const completed = isStageCompleted(stage.id);
  const unlocked = isStageUnlocked(stage.id);
  const isPreview = stage.type === 'preview';

  const IconComponent = STAGE_ICONS[stage.id] || Sparkles;

  const handleClick = () => {
    if (unlocked || isPreview) {
      openStage(stage.id);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative group rounded-2xl p-4 transition-all duration-300 border text-left flex flex-col justify-between select-none ${
        completed
          ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/10 hover:border-emerald-400 cursor-pointer'
          : unlocked
          ? 'bg-slate-900/95 border-blue-500/50 shadow-xl shadow-blue-500/15 ring-1 ring-blue-500/30 hover:border-cyan-400 hover:scale-[1.02] cursor-pointer'
          : isPreview
          ? 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 cursor-pointer opacity-80'
          : 'bg-slate-950/60 border-slate-800/50 opacity-60 cursor-not-allowed'
      }`}
    >
      {/* Node Header: Stage Number, Category & Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-transform group-hover:scale-110 ${
            completed 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : unlocked 
              ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 shadow-sm shadow-blue-500/30'
              : 'bg-slate-800 text-slate-500'
          }`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs text-slate-400 font-semibold tracking-wider">
            STAGE {stage.stageNumber}
          </span>
        </div>

        {/* Status Badge */}
        {completed ? (
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </div>
        ) : unlocked ? (
          <div className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 animate-pulse">
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>Ready</span>
          </div>
        ) : isPreview ? (
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700/50">
            <span>Preview</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
            <Lock className="w-2.5 h-2.5" />
            <span>Locked</span>
          </div>
        )}
      </div>

      {/* Title & Tagline */}
      <div className="mb-4">
        <h4 className={`text-base font-bold leading-snug mb-1 transition-colors ${
          completed 
            ? 'text-white group-hover:text-emerald-300' 
            : unlocked 
            ? 'text-white group-hover:text-cyan-300' 
            : 'text-slate-400'
        }`}>
          {stage.title}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {stage.tagline}
        </p>
      </div>

      {/* Footer: XP Reward & Action CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-[10px] text-slate-500 uppercase">Reward</span>
          <span className={`font-bold px-1.5 py-0.5 rounded ${
            completed 
              ? 'text-emerald-400 bg-emerald-500/10' 
              : unlocked 
              ? 'text-amber-400 bg-amber-500/10' 
              : 'text-slate-500 bg-slate-800/50'
          }`}>
            +{stage.xp} XP
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">
          {completed ? (
            <span className="text-emerald-400 flex items-center gap-0.5">Review <ChevronRight className="w-3.5 h-3.5" /></span>
          ) : unlocked ? (
            <span className="text-cyan-400 flex items-center gap-0.5">Start Stage <ChevronRight className="w-3.5 h-3.5" /></span>
          ) : isPreview ? (
            <span className="text-slate-400 flex items-center gap-0.5">Inspect <ChevronRight className="w-3.5 h-3.5" /></span>
          ) : (
            <span className="text-slate-600 flex items-center gap-0.5">Prerequisites Required</span>
          )}
        </div>
      </div>
    </div>
  );
}

// src/components/Stages/StageDetailModal.jsx
// Main drawer/modal hosting curriculum explanation, practical task, and verification

import React from 'react';
import { 
  X, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowRight
} from 'lucide-react';
import { STAGES } from '../../data/stages.js';
import { useLearning } from '../../context/LearningContext.jsx';

// Stage Component Imports
import { StageSandboxBasics } from './StageSandboxBasics.jsx';
import { StageConnectWallet } from './StageConnectWallet.jsx';
import { StageNetwork } from './StageNetwork.jsx';
import { StageGas } from './StageGas.jsx';
import { StageFirstTx } from './StageFirstTx.jsx';
import { StageERC20 } from './StageERC20.jsx';
import { StageTransfer } from './StageTransfer.jsx';
import { StageApproval } from './StageApproval.jsx';
import { StageSwap } from './StageSwap.jsx';
import { StageLiquidity } from './StageLiquidity.jsx';
import { StageStaking } from './StageStaking.jsx';
import { StageAchievementNFT } from './StageAchievementNFT.jsx';
import { StageMarketplace } from './StageMarketplace.jsx';
import { StageSecurityLab } from './StageSecurityLab.jsx';
import { StageGraduation } from './StageGraduation.jsx';

export function StageDetailModal() {
  const { activeStageId, closeStage, openStage, isStageCompleted, isStageUnlocked } = useLearning();

  if (!activeStageId) return null;

  const stage = STAGES.find(s => s.id === activeStageId);
  if (!stage) return null;

  const completed = isStageCompleted(stage.id);
  const unlocked = isStageUnlocked(stage.id);

  // Find next sequential stage
  const currentIndex = STAGES.findIndex(s => s.id === activeStageId);
  const nextStage = currentIndex >= 0 && currentIndex < STAGES.length - 1 ? STAGES[currentIndex + 1] : null;

  // Render the practical interactive component based on stage id
  const renderStageContent = () => {
    switch (stage.id) {
      case 'stage-0': return <StageSandboxBasics stage={stage} />;
      case 'stage-1': return <StageConnectWallet stage={stage} />;
      case 'stage-2': return <StageNetwork stage={stage} />;
      case 'stage-3': return <StageGas stage={stage} />;
      case 'stage-4': return <StageFirstTx stage={stage} />;
      case 'stage-5': return <StageERC20 stage={stage} />;
      case 'stage-6': return <StageTransfer stage={stage} />;
      case 'stage-7': return <StageApproval stage={stage} />;
      case 'stage-8': return <StageSwap stage={stage} />;
      case 'stage-9': return <StageLiquidity stage={stage} />;
      case 'stage-10': return <StageStaking stage={stage} />;
      case 'stage-11': return <StageAchievementNFT stage={stage} />;
      case 'stage-12': return <StageMarketplace stage={stage} />;
      case 'stage-13': return <StageSecurityLab stage={stage} />;
      case 'stage-grad': return <StageGraduation stage={stage} />;
      default:
        return (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <h4 className="font-bold text-white text-base">Advanced Exploration Preview</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {stage.description}
            </p>
            <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300">
              Module Status: Preview Stage for Advanced Cohort Curriculum
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl my-auto rounded-3xl bg-[#090f1d] border border-blue-500/30 shadow-2xl shadow-blue-500/10 text-white overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/60">
              STAGE {stage.stageNumber}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {stage.category} • {stage.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{stage.xp} XP</span>
            </div>

            <button
              onClick={closeStage}
              className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Header Title & Tagline */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {stage.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              {stage.tagline}
            </p>
          </div>

          {/* Lesson Concept Panel */}
          {stage.lesson && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 font-mono uppercase tracking-wide">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Concept Briefing</span>
              </div>
              
              <p className="text-xs text-slate-300 leading-relaxed">
                {stage.lesson.summary}
              </p>

              {/* Key Concept Terms */}
              {stage.lesson.keyConcepts && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {stage.lesson.keyConcepts.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                      <span className="font-mono font-bold text-cyan-300 block mb-0.5">{item.term}</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.def}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Practical Interactive Task Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Practical Onchain Task</span>
              </span>
              <span className="text-slate-500">{stage.task}</span>
            </div>

            {/* Dynamic Stage Component */}
            <div className="pt-1">
              {renderStageContent()}
            </div>
          </div>

        </div>

        {/* Modal Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 shrink-0 text-xs font-mono">
          <button
            onClick={closeStage}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Map
          </button>

          {nextStage && (
            <button
              onClick={() => openStage(nextStage.id)}
              disabled={!completed && !isStageUnlocked(nextStage.id)}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold"
            >
              <span>Next: {nextStage.title}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

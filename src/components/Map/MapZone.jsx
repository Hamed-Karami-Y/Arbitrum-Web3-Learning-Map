// src/components/Map/MapZone.jsx
// Visual zone container grouping connected stages

import React from 'react';
import { MapNode } from './MapNode.jsx';
import { useLearning } from '../../context/LearningContext.jsx';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export function MapZone({ zone, stages }) {
  const { completedStages } = useLearning();

  const completedInZone = stages.filter(s => completedStages.includes(s.id)).length;
  const isZoneFullyCompleted = stages.length > 0 && completedInZone === stages.length;

  return (
    <div className={`relative rounded-3xl p-5 sm:p-7 border bg-[#0a101f]/70 backdrop-blur-sm transition-all duration-300 ${zone.borderHighlight} hover:border-blue-500/40 shadow-xl`}>
      
      {/* Zone Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40">
              {zone.name}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {zone.subtitle}
            </span>
            {isZoneFullyCompleted && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Sector Cleared</span>
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {zone.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {zone.description}
          </p>
        </div>

        {/* Progress tracker within zone */}
        <div className="flex items-center gap-3 self-start sm:self-center bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          <span className="text-slate-400">Progress:</span>
          <span className={`font-bold ${isZoneFullyCompleted ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {completedInZone} / {stages.length}
          </span>
        </div>
      </div>

      {/* Stage Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stages.map(stage => (
          <MapNode key={stage.id} stage={stage} />
        ))}
      </div>
    </div>
  );
}

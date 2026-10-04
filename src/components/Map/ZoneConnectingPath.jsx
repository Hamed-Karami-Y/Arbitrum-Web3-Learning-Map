// src/components/Map/ZoneConnectingPath.jsx
// Futuristic glowing constellation conduit connecting learning zones

import React from 'react';

export function ZoneConnectingPath({ isCompleted = false, label = "Next Sector" }) {
  return (
    <div className="relative py-6 sm:py-8 flex flex-col items-center justify-center overflow-hidden">
      {/* Central SVG Line */}
      <svg className="w-12 h-16 sm:h-20" viewBox="0 0 48 80" fill="none">
        <path
          d="M24 0 L24 80"
          stroke={isCompleted ? "#22d3ee" : "#334155"}
          strokeWidth="3"
          strokeDasharray={isCompleted ? "6 4" : "4 4"}
          className={isCompleted ? "animate-flow-dash" : ""}
        />
        {/* Glow point */}
        <circle 
          cx="24" 
          cy="40" 
          r="4" 
          fill={isCompleted ? "#38bdf8" : "#475569"} 
          className={isCompleted ? "animate-ping" : ""}
        />
        <circle 
          cx="24" 
          cy="40" 
          r="3" 
          fill={isCompleted ? "#00f0ff" : "#64748b"} 
        />
      </svg>

      {/* Label indicator */}
      <div className={`mt-1 font-mono text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
        isCompleted 
          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' 
          : 'bg-slate-900 border-slate-800 text-slate-500'
      }`}>
        {label}
      </div>
    </div>
  );
}

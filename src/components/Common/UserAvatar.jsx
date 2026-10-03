import React, { useMemo } from 'react';

// Generates a deterministic, cryptographically-styled Web3 identicon avatar from an address
export function UserAvatar({ address, size = "md", className = "" }) {
  const avatarData = useMemo(() => {
    if (!address) {
      return {
        initials: "XP",
        gradient: "from-cyan-600 via-blue-600 to-indigo-700",
        ringColor: "ring-cyan-500/40",
        shadowColor: "shadow-cyan-500/20",
        shapes: [
          { type: 'circle', cx: 32, cy: 32, r: 16, fill: '#38bdf8' },
          { type: 'rect', x: 12, y: 12, w: 20, h: 20, fill: '#818cf8' }
        ],
        isConnected: false,
      };
    }

    const clean = address.toLowerCase().replace('0x', '');
    const seed = parseInt(clean.slice(0, 8), 16) || 12345;
    
    // Aesthetic Web3 gradient palettes
    const palettes = [
      {
        gradient: "from-blue-600 via-indigo-600 to-cyan-400",
        ringColor: "ring-cyan-500/50",
        shadowColor: "shadow-cyan-500/25",
        accent: "#38bdf8",
      },
      {
        gradient: "from-emerald-500 via-teal-600 to-cyan-500",
        ringColor: "ring-emerald-500/50",
        shadowColor: "shadow-emerald-500/25",
        accent: "#34d399",
      },
      {
        gradient: "from-violet-600 via-purple-600 to-pink-500",
        ringColor: "ring-purple-500/50",
        shadowColor: "shadow-purple-500/25",
        accent: "#c084fc",
      },
      {
        gradient: "from-amber-500 via-orange-600 to-rose-500",
        ringColor: "ring-amber-500/50",
        shadowColor: "shadow-amber-500/25",
        accent: "#fbbf24",
      },
      {
        gradient: "from-cyan-500 via-blue-600 to-violet-600",
        ringColor: "ring-blue-500/50",
        shadowColor: "shadow-blue-500/25",
        accent: "#60a5fa",
      },
      {
        gradient: "from-rose-500 via-fuchsia-600 to-indigo-600",
        ringColor: "ring-rose-500/50",
        shadowColor: "shadow-rose-500/25",
        accent: "#f43f5e",
      }
    ];

    const palette = palettes[seed % palettes.length];

    // Pick 2 letters: first and last significant hex characters
    const char1 = clean[0]?.toUpperCase() || 'A';
    const char2 = clean[clean.length - 1]?.toUpperCase() || 'B';
    const initials = `${char1}${char2}`;

    // Deterministic geometric shapes for a rich blockies / jazzicon aesthetic
    const colors = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];
    const c1 = colors[(seed >> 2) % colors.length];
    const c2 = colors[(seed >> 4) % colors.length];
    const c3 = colors[(seed >> 6) % colors.length];

    const shapes = [
      {
        type: 'circle',
        cx: 16 + (seed % 32),
        cy: 16 + ((seed >> 3) % 32),
        r: 12 + (seed % 14),
        fill: c1,
      },
      {
        type: 'rect',
        x: 8 + ((seed >> 5) % 24),
        y: 8 + ((seed >> 7) % 24),
        w: 18 + ((seed >> 2) % 18),
        h: 18 + ((seed >> 4) % 18),
        fill: c2,
        rot: (seed % 45),
      },
      {
        type: 'circle',
        cx: 36 + ((seed >> 6) % 20),
        cy: 36 + ((seed >> 8) % 20),
        r: 10 + (seed % 12),
        fill: c3,
      }
    ];

    return {
      initials,
      gradient: palette.gradient,
      ringColor: palette.ringColor,
      shadowColor: palette.shadowColor,
      shapes,
      isConnected: true,
    };
  }, [address]);

  // Size variations
  const sizeClasses = {
    xs: "w-5 h-5 text-[9px] rounded-md",
    sm: "w-8 h-8 text-xs rounded-xl",
    md: "w-10 h-10 text-sm rounded-xl",
    lg: "w-16 h-16 text-xl rounded-2xl",
    xl: "w-20 h-20 text-2xl rounded-3xl",
  }[size] || "w-10 h-10 text-sm rounded-xl";

  return (
    <div 
      className={`relative select-none overflow-hidden shrink-0 flex items-center justify-center font-mono font-bold text-white shadow-lg ring-1 ${avatarData.ringColor} ${avatarData.shadowColor} bg-gradient-to-br ${avatarData.gradient} ${sizeClasses} ${className}`}
    >
      {/* Subtle geometric SVG identicon backdrop */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-40 mix-blend-overlay pointer-events-none" 
        viewBox="0 0 64 64"
      >
        {avatarData.shapes.map((s, idx) => {
          if (s.type === 'circle') {
            return <circle key={idx} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} />;
          }
          return (
            <rect 
              key={idx} 
              x={s.x} 
              y={s.y} 
              width={s.w} 
              height={s.h} 
              fill={s.fill} 
              transform={`rotate(${s.rot || 0} ${s.x + s.w/2} ${s.y + s.h/2})`}
            />
          );
        })}
      </svg>

      {/* Hex Monogram / Initials */}
      <span className="relative z-10 tracking-wider drop-shadow-md">
        {avatarData.initials}
      </span>

      {/* Online / Active status beacon */}
      <span 
        className={`absolute bottom-1 right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ring-2 ring-[#070b14] ${
          avatarData.isConnected ? 'bg-emerald-400' : 'bg-amber-400'
        }`}
      />
    </div>
  );
}

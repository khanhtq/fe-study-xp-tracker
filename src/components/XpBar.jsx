import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';

export default function XpBar({ currentLevel, currentXp, xpRequiredForNextLevel, totalXp }) {
  const percentage = Math.min(100, Math.max(0, (currentXp / xpRequiredForNextLevel) * 100));

  return (
    <div className="w-full glass-panel rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-indigo-950/20">
      {/* Subtle backdrop glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        {/* Level Badge */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Pulsing ring */}
            <div className="absolute inset-0 bg-indigo-500/30 rounded-full animate-ping opacity-40 scale-110" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex flex-col items-center justify-center border-2 border-indigo-400 shadow-lg shadow-indigo-500/30 relative">
              <span className="text-2xl font-extrabold text-white tracking-tight leading-none">{currentLevel}</span>
              <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest leading-none mt-0.5">LVL</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-1.5">
              Tiến Trình Học Tập <Sparkles className="w-4 h-4 text-indigo-400" />
            </h3>
            <p className="text-sm text-slate-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              Tổng điểm tích lũy: <span className="font-semibold text-slate-200">{totalXp.toLocaleString()} XP</span>
            </p>
          </div>
        </div>

        {/* Numeric Progress */}
        <div className="text-left md:text-right shrink-0">
          <div className="text-2xl font-black text-indigo-200 leading-none">
            {currentXp.toLocaleString()} <span className="text-slate-500 text-sm font-medium">/ {xpRequiredForNextLevel.toLocaleString()} XP</span>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {percentage.toFixed(1)}% Hoàn thành Level {currentLevel}
          </span>
        </div>
      </div>

      {/* The XP Bar */}
      <div className="relative w-full h-5 bg-slate-900/80 rounded-full border border-slate-800/80 overflow-hidden p-0.5">
        {/* Animated grid overlay for game aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_100%] pointer-events-none z-10" />

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(99,102,241,0.5)] relative overflow-hidden"
        >
          {/* Shimmer effect moving left to right */}
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]" />
        </motion.div>
      </div>

      {/* Tailwind Custom Keyframes Shimmer Injection */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(250%) skewX(12deg);
          }
        }
      `}</style>
    </div>
  );
}

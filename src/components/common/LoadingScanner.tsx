import React from 'react';
import { Cpu, ShieldCheck, Zap } from 'lucide-react';

interface LoadingScannerProps {
  statusText?: string;
  progressPercent?: number;
}

export const LoadingScanner: React.FC<LoadingScannerProps> = ({
  statusText = 'Initializing Deep Neural Network Inference...',
  progressPercent = 45,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-950/80 border border-cyan-500/30 rounded-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 pointer-events-none" />

      {/* Radar Sweeper Visual */}
      <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
        {/* Outer Pulsing Rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-25" />
        <div className="absolute inset-2 rounded-full border border-cyan-400/40 animate-pulse" />
        <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/20 animate-[spin_10s_linear_infinite]" />

        {/* Center Core */}
        <div className="w-14 h-14 rounded-full bg-cyan-950/80 border border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
          <Cpu className="w-7 h-7 text-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* Progress & Text */}
      <div className="w-full max-w-md text-center space-y-3 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 animate-bounce" /> {statusText}
          </span>
          <span>{progressPercent}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
          <span>Tensors: 148 Features</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> SOC Active
          </span>
        </div>
      </div>
    </div>
  );
};

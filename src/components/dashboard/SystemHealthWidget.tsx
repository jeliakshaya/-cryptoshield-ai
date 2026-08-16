import React from 'react';
import { Cpu, HardDrive, Database, Server, CheckCircle2 } from 'lucide-react';

export const SystemHealthWidget: React.FC = () => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
      <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
        <Server className="w-4 h-4 text-cyan-400" />
        SOC Engine & ML Model Status
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Inference Latency</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-base font-bold text-emerald-400">11.4 ms</p>
          <span className="text-[10px] text-slate-400">Sub-block real-time</span>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Risk Engine Memory</span>
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-base font-bold text-white">4.2 GB / 16 GB</p>
          <span className="text-[10px] text-slate-400">26.2% utilized</span>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Graph Edges Active</span>
            <Database className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-base font-bold text-white">1,420,850</p>
          <span className="text-[10px] text-slate-400">Multi-chain topologies</span>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Model Health</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-base font-bold text-emerald-400">99.8% Healthy</p>
          <span className="text-[10px] text-slate-400">Zero Drift Detected</span>
        </div>
      </div>
    </div>
  );
};

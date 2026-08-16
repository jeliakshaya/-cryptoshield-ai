import React from 'react';
import { ShieldAlert, Cpu, Lock, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/60 backdrop-blur-xl border-t border-white/10 mt-16 text-slate-400 text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-1 text-white font-bold shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-white font-bold font-mono text-base bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">CryptoShield AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              An advanced AI-based cyber threat detection dashboard for cryptocurrency transactions,
              featuring neural pattern analysis and graph neural network explainability.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Final Year Engineering Viva Prototype
            </div>
          </div>

          {/* Col 2: Core Capabilities */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 font-mono">
              Core Capabilities
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Graph Neural Network Anomaly Detection
              </li>
              <li className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> OFAC & Ransomware Vault Screening
              </li>
              <li className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" /> Peeling Chain & Mixer Tracing
              </li>
              <li className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Real-time Automated Circuit Breakers
              </li>
            </ul>
          </div>

          {/* Col 3: Academic / Viva Details */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 font-mono">
              Project Specification
            </h4>
            <div className="space-y-1.5 text-slate-400 text-[11px]">
              <p><strong className="text-slate-300">Title:</strong> AI-Based Cyber Threat Detection in Cryptocurrency</p>
              <p><strong className="text-slate-300">ML Architecture:</strong> CryptoShield Risk Engine v1</p>
              <p><strong className="text-slate-300">Feature Count:</strong> 148 Topological & Temporal Vector Inputs</p>
              <p><strong className="text-slate-300">Inference Latency:</strong> &lt; 12ms per block bundle</p>
            </div>
          </div>

          {/* Col 4: Tech Stack */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 font-mono">
              Built With
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['React 19', 'TypeScript', 'Tailwind CSS v4', 'Recharts', 'Lucide React', 'FastAPI ML Ready'].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[10px] font-mono backdrop-blur-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-mono gap-3">
          <p>© 2026 CryptoShield AI Security Operations Center. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">Status: SOC Operational</span>
            <span className="text-slate-300">API Endpoint: /api</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

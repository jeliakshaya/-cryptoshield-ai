import React from 'react';
import { Database, Filter, Cpu, ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const WorkflowDiagram: React.FC = () => {
  const steps = [
    {
      title: 'Transaction Data',
      desc: 'Raw block streaming & mempool ingest',
      icon: Database,
      color: 'text-cyan-400 border-cyan-400/40 bg-white/5',
    },
    {
      title: 'Data Preprocessing',
      desc: 'Sanitization & address normalization',
      icon: Filter,
      color: 'text-blue-400 border-blue-400/40 bg-white/5',
    },
    {
      title: 'Feature Extraction',
      desc: '148 topological & temporal vectors',
      icon: Cpu,
      color: 'text-indigo-400 border-indigo-400/40 bg-white/5',
    },
    {
      title: 'AI / ML Model',
      desc: 'CryptoShield Risk Engine',
      icon: Cpu,
      color: 'text-purple-400 border-purple-400/40 bg-white/5',
    },
    {
      title: 'Risk Analysis',
      desc: '0-100 Anomaly distance matrix',
      icon: AlertTriangle,
      color: 'text-amber-400 border-amber-400/40 bg-white/5',
    },
    {
      title: 'Threat Classification',
      desc: 'Ransomware, Peeling, Phishing',
      icon: ShieldAlert,
      color: 'text-rose-400 border-rose-400/40 bg-white/5',
    },
    {
      title: 'Security Alert',
      desc: 'Circuit breaker & SOC trigger',
      icon: CheckCircle2,
      color: 'text-emerald-400 border-emerald-400/40 bg-white/5',
    },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
          Neural Pipeline Architecture
        </span>
        <h3 className="text-lg font-bold text-white mt-2">
          End-to-End AI Cyber Threat Detection Workflow
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative flex flex-col items-center text-center group">
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center p-3 mb-3 transition-transform group-hover:scale-110 shadow-lg ${step.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold font-mono text-white leading-tight">
                {step.title}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 font-sans">{step.desc}</span>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-5 text-slate-600">
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

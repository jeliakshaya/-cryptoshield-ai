import React from 'react';
import { WorkflowDiagram } from './WorkflowDiagram';
import {
  ShieldAlert,
  Cpu,
  ArrowRight,
  Lock,
  Activity,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Network,
  Bell,
  Eye,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onGoToDetection: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onGoToDetection,
}) => {
  const features = [
    {
      title: 'Real-time Transaction Monitoring',
      desc: 'Sub-second classification of multi-chain transactions across BTC, ETH, USDT, BNB, and SOL.',
      icon: Activity,
    },
    {
      title: 'Neural Network Anomaly Detection',
      desc: 'Dataset-backed threat prediction with a transparent live Bitcoin structural-risk monitor.',
      icon: Cpu,
    },
    {
      title: 'Graph Wallet Cluster Mapping',
      desc: 'Visual topology mapping connected counterparties, darknet markets, and privacy mixers.',
      icon: Network,
    },
    {
      title: 'OFAC & Ransomware Vault Screening',
      desc: 'Automated cross-referencing with sanctioned SDN lists and known exploit payload vaults.',
      icon: Lock,
    },
    {
      title: 'Explainable AI Rationale',
      desc: 'Human-understandable feature impact vectors explaining why every transaction was flagged.',
      icon: Eye,
    },
    {
      title: 'Automated Circuit Breakers',
      desc: 'Instant automated liquidity pause protocols and real-time SOC incident escalation queue.',
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 sm:p-12 overflow-hidden shadow-2xl">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-cyan-400 text-xs font-mono font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            FINAL YEAR ENGINEERING PROJECT VIVA PROTOTYPE
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            AI-Powered Cyber Threat Detection for Cryptocurrency
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 leading-relaxed font-sans">
            Detect suspicious transactions, identify wallet risks, and analyze cryptocurrency threats
            using intelligent machine-learning driven security analytics.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onLaunchDashboard}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold font-mono text-sm hover:scale-105 transition-all shadow-xl shadow-cyan-950/50 flex items-center gap-2"
            >
              Launch Security Operations Center
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToDetection}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold font-mono text-sm border border-white/15 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              Try Live AI Analyzer
            </button>
          </div>
        </div>
      </div>

      {/* Security Statistics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center">
          <span className="text-slate-400 text-xs block">Volume Monitored</span>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-1">$1.4B+</p>
          <span className="text-[10px] text-cyan-400">Multi-chain Ingestion</span>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center">
          <span className="text-slate-400 text-xs block">Threats Prevented</span>
          <p className="text-2xl sm:text-3xl font-bold text-rose-400 mt-1">1,842</p>
          <span className="text-[10px] text-slate-400">Ransomware & Scams</span>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center">
          <span className="text-slate-400 text-xs block">ML Model Accuracy</span>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">N/A</p>
          <span className="text-[10px] text-slate-400">Measured evaluation not supplied</span>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center">
          <span className="text-slate-400 text-xs block">Analysis Latency</span>
          <p className="text-2xl sm:text-3xl font-bold text-cyan-400 mt-1">11.4ms</p>
          <span className="text-[10px] text-slate-400">Sub-block real-time</span>
        </div>
      </div>

      {/* AI Threat Detection Workflow */}
      <WorkflowDiagram />

      {/* Key Features Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white">
            Enterprise Cybersecurity Platform Features
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Engineered to look and operate like a modern Security Operations Center (SOC)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform backdrop-blur-md">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-white/5 backdrop-blur-md border border-cyan-400/40 rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">
          Explore the Interactive Cybersecurity Dashboard
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Test live transaction monitoring, inspect ransomware flow topologies, run AI explainability analysis, and manage security alerts.
        </p>
        <button
          onClick={onLaunchDashboard}
          className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm transition-all shadow-xl shadow-cyan-950/60 inline-flex items-center gap-2"
        >
          Launch Full SOC Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { AIAnalysisResult } from '../../types/crypto';
import { RiskBadge } from '../common/RiskBadge';
import { ShieldAlert, Cpu, CheckCircle2, AlertTriangle, Activity, Lock, Zap } from 'lucide-react';

interface ExplainabilityCardProps {
  result: AIAnalysisResult;
}

export const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({ result }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-cyan-400/40 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white font-mono">
              AI Evaluation Output: {result.threatType}
            </h3>
            <RiskBadge score={result.riskScore} size="md" />
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Analysis ID: {result.analysisId} | Timestamp: {new Date(result.timestamp).toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10 font-mono text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">AI Confidence</span>
            <span className="font-bold text-cyan-400 text-sm">{result.aiConfidence}%</span>
          </div>
          <div className="border-l border-white/10 pl-4">
            <span className="text-slate-400 block text-[10px]">Inference Time</span>
            <span className="font-bold text-emerald-400 text-sm">{result.processingTimeMs} ms</span>
          </div>
        </div>
      </div>

      {/* Model Spec Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
        <div>
          <span className="text-slate-400 block text-[10px]">ML Model Engine</span>
          <span className="font-bold text-white text-[11px]">{result.modelMetrics.modelName}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Model Version</span>
          <span className="font-bold text-cyan-400 text-[11px]">{result.modelMetrics.modelVersion}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Input Features Evaluated</span>
          <span className="font-bold text-white text-[11px]">{result.modelMetrics.featureCount} vectors</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Anomaly Score</span>
          <span className="font-bold text-rose-400 text-[11px]">{result.anomalyScore}/100</span>
        </div>
      </div>

      {/* Explanation Text */}
      <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-2">
        <h4 className="text-xs font-bold text-slate-300 font-mono flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Model Decision Rationale & Natural Language Explanation:
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">{result.explanation}</p>
      </div>

      {/* Factors Breakdown */}
      {result.factors.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
            Neural Feature Contribution Vector Breakdown:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.factors.map((factor, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    {factor.factor}
                  </span>
                  <span className="text-cyan-400 font-bold">+{factor.impactPercentage}%</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-1">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pattern Signatures */}
      {result.suspiciousBehaviors.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider mb-2">
            Identified Anomaly Signatures:
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.suspiciousBehaviors.map((b, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" /> {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
          <Lock className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <span className="text-xs font-bold text-white font-mono block">Recommended Automated Security Action:</span>
          <p className="text-xs text-slate-300 font-sans mt-0.5">{result.recommendedAction}</p>
        </div>
      </div>
    </div>
  );
};

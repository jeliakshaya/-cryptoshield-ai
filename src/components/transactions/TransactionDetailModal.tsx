import React, { useState } from 'react';
import { Transaction } from '../../types/crypto';
import { Modal } from '../common/Modal';
import { RiskBadge } from '../common/RiskBadge';
import { CryptoIcon } from '../common/CryptoIcon';
import { TransactionFlowVisualizer } from './TransactionFlowVisualizer';
import { formatCurrency, formatTimestamp, shortenAddress } from '../../utils/formatters';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Cpu,
  FileText,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet?: (address: string) => void;
  onActionExecute?: (txId: string, actionName: string) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onSelectWallet,
  onActionExecute,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  if (!transaction) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(transaction.hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleAction = (act: string) => {
    setActionDone(act);
    if (onActionExecute) {
      onActionExecute(transaction.id, act);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Transaction Threat Inspector - ${transaction.id}`}
      subtitle={`Hash: ${shortenAddress(transaction.hash, 10)}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Header Alert Banner */}
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            transaction.riskScore >= 80
              ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              : transaction.riskScore >= 55
              ? 'bg-orange-950/40 border-orange-800/60 text-orange-300'
              : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <ShieldAlert className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white">
                  Threat Classification: {transaction.threatType}
                </span>
                <RiskBadge score={transaction.riskScore} size="sm" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                AI Confidence Score: <strong className="text-cyan-400 font-mono">{transaction.aiConfidence}%</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Current Status:</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white">
              {transaction.status}
            </span>
          </div>
        </div>

        {/* Visual Transaction Topology Flow */}
        <TransactionFlowVisualizer transaction={transaction} onSelectWallet={onSelectWallet} />

        {/* Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">Crypto Amount</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-white">
              <CryptoIcon currency={transaction.currency} size="sm" />
              {formatCurrency(transaction.amount, transaction.currency)}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">Fiat USD Equivalent</span>
            <span className="font-bold text-white block mt-1">
              {formatCurrency(transaction.amountUSD)}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">Block Number</span>
            <span className="font-bold text-cyan-400 block mt-1">
              #{transaction.blockNumber}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">Timestamp</span>
            <span className="font-bold text-slate-300 block mt-1">
              {formatTimestamp(transaction.timestamp)}
            </span>
          </div>
        </div>

        {/* Hash row */}
        <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between font-mono text-xs text-slate-300">
          <span className="truncate pr-2">TX Hash: {transaction.hash}</span>
          <button
            onClick={handleCopyHash}
            className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 shrink-0 flex items-center gap-1 text-[10px] backdrop-blur-md"
          >
            {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedHash ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* AI Explainability Section ("Why was this transaction flagged?") */}
        <div className="bg-white/5 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Why Was This Transaction Flagged? (AI Explainability)
            </h4>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              Risk Score: {transaction.riskScore}/100
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans bg-white/5 p-3 rounded-xl border border-white/10">
            {transaction.explanation}
          </p>

          {/* Risk Factors Breakdown */}
          {transaction.factors.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-slate-400 font-mono mb-2">
                Neural Feature Impact Factors:
              </h5>
              <div className="space-y-2">
                {transaction.factors.map((factor, idx) => (
                  <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        {factor.factor}
                      </span>
                      <span className="text-cyan-400 font-bold">
                        +{factor.impactPercentage}% Impact
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{factor.description}</p>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-rose-500 h-full"
                        style={{ width: `${factor.impactPercentage * 2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suspicious Behaviors List */}
          {transaction.suspiciousBehaviors.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-slate-400 font-mono mb-2">
                Detected Pattern Anomaly Signatures:
              </h5>
              <div className="flex flex-wrap gap-2">
                {transaction.suspiciousBehaviors.map((b, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3" /> {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommended Action Footer & Action Buttons */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
            <Lock className="w-4 h-4 text-cyan-400" /> Recommended Security Protocol:
          </div>
          <p className="text-xs text-slate-300 font-sans">{transaction.recommendedAction}</p>

          {actionDone ? (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Action Completed: {actionDone}. Logged to SOC Audit Trail.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => handleAction('Automated Wallet Freeze Executed')}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono transition-colors shadow-lg shadow-rose-900/30"
              >
                Execute Freeze & SAR Report
              </button>
              <button
                onClick={() => handleAction('Escalated to Compliance Desk')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs font-mono transition-colors"
              >
                Escalate to AML Desk
              </button>
              <button
                onClick={() => handleAction('Flagged False Positive')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs font-mono transition-colors"
              >
                Dismiss False Positive
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

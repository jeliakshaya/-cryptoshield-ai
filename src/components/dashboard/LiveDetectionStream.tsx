import React from 'react';
import { Transaction } from '../../types/crypto';
import { RiskBadge } from '../common/RiskBadge';
import { CryptoIcon } from '../common/CryptoIcon';
import { shortenAddress, formatCurrency, formatTimestamp } from '../../utils/formatters';
import { ExternalLink, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

interface LiveDetectionStreamProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onViewAll: () => void;
}

export const LiveDetectionStream: React.FC<LiveDetectionStreamProps> = ({
  transactions,
  onSelectTransaction,
  onViewAll,
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            Live Blockchain Transaction Feed
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time Bitcoin mempool feed • structural risk baseline
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 self-start sm:self-auto hover:underline"
        >
          View Full Monitoring Table <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stream List */}
      <div className="space-y-3">
        {transactions.slice(0, 5).map((tx) => {
          const isCritical = tx.riskScore >= 80;
          return (
            <div
              key={tx.id}
              onClick={() => onSelectTransaction(tx)}
              className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer backdrop-blur-md ${
                isCritical
                  ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-400/60'
                  : 'bg-white/5 border-white/10 hover:border-cyan-400/40 hover:bg-white/10'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Left: Tx info */}
                <div className="flex items-start gap-3">
                  <CryptoIcon currency={tx.currency} size="md" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {tx.id}
                      </span>
                      <RiskBadge score={tx.riskScore} size="sm" />
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {tx.threatType}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-slate-400 flex items-center gap-2 flex-wrap font-mono">
                      <span>{shortenAddress(tx.senderAddress)}</span>
                      <span className="text-slate-600">→</span>
                      <span>{shortenAddress(tx.receiverAddress)}</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-slate-500">{formatTimestamp(tx.timestamp)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & AI metrics */}
                <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-800/60">
                  <div className="text-left lg:text-right">
                    <p className="text-xs font-bold font-mono text-white">
                      {formatCurrency(tx.amount, tx.currency)}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {formatCurrency(tx.amountUSD)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block">Risk Confidence</span>
                    <span className="text-xs font-bold font-mono text-cyan-400">
                      {tx.aiConfidence > 0 ? `${tx.aiConfidence}%` : 'Live'}
                    </span>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-medium transition-colors border border-slate-700 shrink-0">
                    Inspect
                  </button>
                </div>
              </div>

              {/* Action summary */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 truncate text-slate-300">
                  {isCritical ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span className="truncate">{tx.recommendedAction}</span>
                </span>
                <span className="font-mono text-slate-500 shrink-0 ml-2">{tx.network}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

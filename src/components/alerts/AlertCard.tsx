import React from 'react';
import { SecurityAlert } from '../../types/crypto';
import { RiskBadge } from '../common/RiskBadge';
import { shortenAddress, formatTimestamp, formatCurrency } from '../../utils/formatters';
import { ShieldAlert, CheckCircle2, Search, XCircle, Clock } from 'lucide-react';

interface AlertCardProps {
  alert: SecurityAlert;
  onUpdateStatus: (id: string, status: SecurityAlert['status']) => void;
  onInspectTx?: (txId: string) => void;
  onInspectWallet?: (address: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onUpdateStatus,
  onInspectTx,
  onInspectWallet,
}) => {
  const isCritical = alert.severity === 'critical';

  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all duration-300 shadow-xl backdrop-blur-md ${
        isCritical
          ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
          : 'bg-white/5 border-white/10 hover:border-cyan-400/50'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left info */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                isCritical
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : alert.severity === 'high'
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              {alert.severity} Incident
            </span>
            <RiskBadge score={alert.riskScore} size="sm" />
            <span className="text-xs font-mono text-slate-400">ID: {alert.id}</span>
          </div>

          <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
            {alert.threatType} Alert
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">{alert.description}</p>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 flex-wrap pt-1">
            <span>
              TX:{' '}
              <button
                onClick={() => onInspectTx && onInspectTx(alert.transactionId)}
                className="text-cyan-400 hover:underline font-bold"
              >
                {alert.transactionId}
              </button>
            </span>
            <span>|</span>
            <span>
              Wallet:{' '}
              <button
                onClick={() => onInspectWallet && onInspectWallet(alert.walletAddress)}
                className="text-cyan-400 hover:underline font-bold"
              >
                {shortenAddress(alert.walletAddress)}
              </button>
            </span>
            <span>|</span>
            <span>Amount: {formatCurrency(alert.amountUSD)}</span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {formatTimestamp(alert.timestamp)}
            </span>
          </div>
        </div>

        {/* Right Actions & Status */}
        <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border uppercase tracking-wider ${
              alert.status === 'open'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : alert.status === 'investigating'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : alert.status === 'resolved'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Status: {alert.status}
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            {alert.status !== 'resolved' && (
              <button
                onClick={() => onUpdateStatus(alert.id, 'resolved')}
                className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-800 border border-emerald-800 text-emerald-300 font-mono text-xs font-bold transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
              </button>
            )}

            {alert.status === 'open' && (
              <button
                onClick={() => onUpdateStatus(alert.id, 'investigating')}
                className="px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-800 border border-cyan-800 text-cyan-300 font-mono text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" /> Investigate
              </button>
            )}

            {alert.status !== 'ignored' && (
              <button
                onClick={() => onUpdateStatus(alert.id, 'ignored')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-mono text-xs font-medium transition-colors flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" /> Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

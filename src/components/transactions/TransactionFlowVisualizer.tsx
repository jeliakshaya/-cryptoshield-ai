import React from 'react';
import { Transaction } from '../../types/crypto';
import { shortenAddress, formatCurrency } from '../../utils/formatters';
import { RiskBadge } from '../common/RiskBadge';
import { ArrowRight, Wallet, Cpu } from 'lucide-react';

interface TransactionFlowProps {
  transaction: Transaction;
  onSelectWallet?: (address: string) => void;
}

export const TransactionFlowVisualizer: React.FC<TransactionFlowProps> = ({
  transaction,
  onSelectWallet,
}) => {
  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 my-4 relative overflow-hidden">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-4 flex items-center gap-2">
        <Cpu className="w-4 h-4 text-cyan-400" />
        Visual On-Chain Transaction Topology
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Sender Wallet Node */}
        <div
          onClick={() => onSelectWallet && onSelectWallet(transaction.senderAddress)}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Wallet className="w-3 h-3 text-cyan-400" /> Sender Node
            </span>
            <RiskBadge score={transaction.senderRiskScore} size="sm" />
          </div>
          <p className="font-mono text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate" title={transaction.senderAddress}>
            {shortenAddress(transaction.senderAddress, 8)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Sender Risk Index: <span className="font-bold text-slate-300">{transaction.senderRiskScore}/100</span>
          </p>
        </div>

        {/* Center Blockchain Pipeline */}
        <div className="flex flex-col items-center justify-center p-3 text-center bg-slate-900/40 rounded-xl border border-slate-800/60 relative">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
            {transaction.network}
          </span>
          <div className="flex items-center justify-center gap-2 my-1 text-white font-mono font-bold text-sm">
            <span>{formatCurrency(transaction.amount, transaction.currency)}</span>
            <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            USD Value: {formatCurrency(transaction.amountUSD)}
          </span>
          <span className="text-[10px] font-mono text-slate-500 mt-0.5">
            Gas Fee: {transaction.fee} {transaction.currency} (${transaction.feeUSD})
          </span>
        </div>

        {/* Receiver Wallet Node */}
        <div
          onClick={() => onSelectWallet && onSelectWallet(transaction.receiverAddress)}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Wallet className="w-3 h-3 text-purple-400" /> Receiver Node
            </span>
            <RiskBadge score={transaction.receiverRiskScore} size="sm" />
          </div>
          <p className="font-mono text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate" title={transaction.receiverAddress}>
            {shortenAddress(transaction.receiverAddress, 8)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Receiver Risk Index: <span className="font-bold text-slate-300">{transaction.receiverRiskScore}/100</span>
          </p>
        </div>
      </div>
    </div>
  );
};

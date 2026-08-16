import React, { useState } from 'react';
import { Transaction } from '../../types/crypto';
import { RiskBadge } from '../common/RiskBadge';
import { CryptoIcon } from '../common/CryptoIcon';
import { shortenAddress, formatCurrency, formatTimestamp } from '../../utils/formatters';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onSelectTransaction,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(transactions.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = transactions.slice(startIndex, startIndex + itemsPerPage);

  const getStatusStyle = (status: Transaction['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Flagged':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Under Review':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Blocked':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold animate-pulse';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-white/5 text-slate-400 border-b border-white/10 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Transaction ID</th>
              <th className="py-3.5 px-4 font-semibold">Date / Time</th>
              <th className="py-3.5 px-4 font-semibold">Sender Wallet</th>
              <th className="py-3.5 px-4 font-semibold">Receiver Wallet</th>
              <th className="py-3.5 px-4 font-semibold">Crypto & Amount</th>
              <th className="py-3.5 px-4 font-semibold">Risk Score</th>
              <th className="py-3.5 px-4 font-semibold">Threat Vector</th>
              <th className="py-3.5 px-4 font-semibold">AI Conf.</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400 font-sans">
                  No transactions match the selected security filter query.
                </td>
              </tr>
            ) : (
              paginatedData.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {formatTimestamp(tx.timestamp)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300" title={tx.senderAddress}>
                    {shortenAddress(tx.senderAddress)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300" title={tx.receiverAddress}>
                    {shortenAddress(tx.receiverAddress)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <CryptoIcon currency={tx.currency} size="sm" />
                      <div>
                        <span className="font-bold text-white block">
                          {formatCurrency(tx.amount, tx.currency)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {formatCurrency(tx.amountUSD)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskBadge score={tx.riskScore} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                      {tx.threatType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cyan-400">
                    {tx.aiConfidence}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded border text-[11px] ${getStatusStyle(
                        tx.status
                      )}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-colors backdrop-blur-md">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/5 border-t border-white/10 text-xs text-slate-400 font-mono">
        <div>
          Showing {transactions.length > 0 ? startIndex + 1 : 0} to{' '}
          {Math.min(startIndex + itemsPerPage, transactions.length)} of {transactions.length} records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 backdrop-blur-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

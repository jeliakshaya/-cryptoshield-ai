import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { CryptoCurrency, RiskLevel, ThreatType } from '../../types/crypto';
import { TransactionFilterOptions } from '../../services/transactionService';

interface TransactionFilterProps {
  filterOptions: TransactionFilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<TransactionFilterOptions>>;
  onReset: () => void;
}

export const TransactionFilter: React.FC<TransactionFilterProps> = ({
  filterOptions,
  setFilterOptions,
  onReset,
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg space-y-3">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search TX hash, sender, receiver..."
            value={filterOptions.searchQuery || ''}
            onChange={(e) =>
              setFilterOptions((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none font-mono backdrop-blur-md"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Risk Filter */}
          <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={filterOptions.riskLevel || 'all'}
              onChange={(e) =>
                setFilterOptions((prev) => ({
                  ...prev,
                  riskLevel: e.target.value as RiskLevel | 'all',
                }))
              }
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Risk Levels</option>
              <option value="safe" className="bg-slate-900">Safe (0-29)</option>
              <option value="suspicious" className="bg-slate-900">Suspicious (30-54)</option>
              <option value="high_risk" className="bg-slate-900">High Risk (55-79)</option>
              <option value="critical" className="bg-slate-900">Critical Threat (80-100)</option>
            </select>
          </div>

          {/* Crypto Filter */}
          <div className="bg-white/5 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
            <select
              value={filterOptions.currency || 'all'}
              onChange={(e) =>
                setFilterOptions((prev) => ({
                  ...prev,
                  currency: e.target.value as CryptoCurrency | 'all',
                }))
              }
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Currencies</option>
              <option value="BTC" className="bg-slate-900">Bitcoin (BTC)</option>
              <option value="ETH" className="bg-slate-900">Ethereum (ETH)</option>
              <option value="USDT" className="bg-slate-900">Tether (USDT)</option>
              <option value="BNB" className="bg-slate-900">BNB Chain (BNB)</option>
              <option value="SOL" className="bg-slate-900">Solana (SOL)</option>
            </select>
          </div>

          {/* Threat Type Filter */}
          <div className="bg-white/5 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
            <select
              value={filterOptions.threatType || 'all'}
              onChange={(e) =>
                setFilterOptions((prev) => ({
                  ...prev,
                  threatType: e.target.value as ThreatType | 'all',
                }))
              }
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Threat Categories</option>
              <option value="Phishing" className="bg-slate-900">Phishing</option>
              <option value="Ransomware" className="bg-slate-900">Ransomware</option>
              <option value="Money Laundering" className="bg-slate-900">Money Laundering</option>
              <option value="Fraud" className="bg-slate-900">Fraud</option>
              <option value="Wallet Compromise" className="bg-slate-900">Wallet Compromise</option>
              <option value="Flash Loan Exploit" className="bg-slate-900">Flash Loan Exploit</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterOptions.sortBy || 'timestamp'}
              onChange={(e) =>
                setFilterOptions((prev) => ({
                  ...prev,
                  sortBy: e.target.value as TransactionFilterOptions['sortBy'],
                }))
              }
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="timestamp" className="bg-slate-900">Date/Time</option>
              <option value="amount" className="bg-slate-900">Amount USD</option>
              <option value="riskScore" className="bg-slate-900">Risk Score</option>
              <option value="aiConfidence" className="bg-slate-900">AI Confidence</option>
            </select>
          </div>

          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 text-xs font-medium transition-colors backdrop-blur-md"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

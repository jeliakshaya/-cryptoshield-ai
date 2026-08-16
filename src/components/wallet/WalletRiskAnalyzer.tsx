import React, { useEffect, useState } from 'react';
import { walletService } from '../../services/walletService';
import { WalletRiskProfile } from '../../types/crypto';
import { RiskBadge } from '../common/RiskBadge';
import { WalletNetworkGraph } from './WalletNetworkGraph';
import { shortenAddress, formatCurrency } from '../../utils/formatters';
import { Wallet, Search, ShieldAlert, AlertTriangle, Activity, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface WalletRiskAnalyzerProps {
  initialAddress?: string;
  onInspectWallet?: (address: string) => void;
}

export const WalletRiskAnalyzer: React.FC<WalletRiskAnalyzerProps> = ({
  initialAddress = 'elliptic:226704643',
  onInspectWallet,
}) => {
  const [addressInput, setAddressInput] = useState(initialAddress);
  const [profile, setProfile] = useState<WalletRiskProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    walletService.getWalletProfile(initialAddress).then(setProfile).catch(console.error).finally(() => setLoading(false));
  }, [initialAddress]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    setLoading(true);
    try { setProfile(await walletService.getWalletProfile(addressInput.trim())); } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleQuickPick = async (addr: string) => {
    setAddressInput(addr);
    setLoading(true);
    try { setProfile(await walletService.getWalletProfile(addr)); } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      {loading && <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-cyan-300 font-mono text-sm">Loading wallet profile from backend...</div>}
      {!loading && !profile && <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-rose-300 font-mono text-sm">Wallet profile could not be loaded.</div>}
      {!profile ? null : (
      <>
      {/* Search Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Wallet className="w-5 h-5 text-cyan-400" />
          On-Chain Wallet Risk Profiler & Topology
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Perform graph cluster analysis, threat history auditing, and counterparty exposure checks.
        </p>
      </div>

      {/* Input form */}
      <form onSubmit={handleSearch} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Enter BTC, ETH, USDT, BNB, SOL wallet address..."
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none font-mono backdrop-blur-md"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold font-mono text-xs transition-colors shrink-0 shadow-lg shadow-cyan-950/40"
        >
          Analyze Wallet Profile
        </button>
      </form>

      {/* Quick Picks */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-slate-400">Sample Wallets:</span>
        <button
          onClick={() => handleQuickPick('elliptic:226704643')}
          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 backdrop-blur-md"
        >
          BlackByte Ransomware (0x1a2b...)
        </button>
        <button
          onClick={() => handleQuickPick('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')}
          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 backdrop-blur-md"
        >
          Wasabi CoinJoin Peeler (bc1qxy...)
        </button>
        <button
          onClick={() => handleQuickPick('0x7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f')}
          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 backdrop-blur-md"
        >
          Clean Verified Staker (0x7a6f...)
        </button>
      </div>

      {/* Main Profile Summary */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold font-mono text-white break-all">
                {profile.address}
              </span>
              <RiskBadge score={profile.riskScore} size="md" />
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              First Active: {profile.firstActive} | Last Activity: {profile.lastActive}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-mono text-xs backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">Total Transactions</span>
            <span className="font-bold text-white text-lg block mt-1">{profile.transactionCount}</span>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">Total Received (USD)</span>
            <span className="font-bold text-emerald-400 text-lg block mt-1">
              {formatCurrency(profile.totalReceivedUSD)}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">Total Sent (USD)</span>
            <span className="font-bold text-cyan-400 text-lg block mt-1">
              {formatCurrency(profile.totalSentUSD)}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">Flagged Counterparties</span>
            <span className="font-bold text-rose-400 text-lg block mt-1">
              {profile.flaggedCounterpartiesCount} entities
            </span>
          </div>
        </div>

        {/* Network Relationship Visualizer */}
        <WalletNetworkGraph
          targetAddress={profile.address}
          connectedWallets={profile.connectedWallets}
          onSelectNode={(addr) => {
            setAddressInput(addr);
            walletService.getWalletProfile(addr).then(setProfile).catch(console.error);
            if (onInspectWallet) onInspectWallet(addr);
          }}
        />

        {/* Risk Score Timeline */}
        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Historical Risk Score Timeline
          </h3>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profile.riskHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="riskScore"
                  name="Risk Index"
                  stroke={profile.riskScore >= 55 ? '#f43f5e' : '#06b6d4'}
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

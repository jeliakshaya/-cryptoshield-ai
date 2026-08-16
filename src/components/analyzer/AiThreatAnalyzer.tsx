import React, { useState } from 'react';
import { analyzeTransactionOrWallet } from '../../services/aiDetectionService';
import { AIAnalysisResult, CryptoCurrency } from '../../types/crypto';
import { LoadingScanner } from '../common/LoadingScanner';
import { ExplainabilityCard } from './ExplainabilityCard';
import { Cpu, Search, Sparkles, AlertCircle } from 'lucide-react';

export const AiThreatAnalyzer: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [currency, setCurrency] = useState<CryptoCurrency>('ETH');
  const [amount, setAmount] = useState<string>('12.5');

  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  const presets = [
    {
      label: 'Ransomware Vault (0x1a2b...)',
      address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      currency: 'ETH' as CryptoCurrency,
      amount: '145.8',
    },
    {
      label: 'Peeling Chain Laundering (bc1qxy...)',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      currency: 'BTC' as CryptoCurrency,
      amount: '18.5',
    },
    {
      label: 'Permit2 Drainer (0x8f7e...)',
      address: '0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e',
      currency: 'USDT' as CryptoCurrency,
      amount: '250000',
    },
    {
      label: 'Verified Staker Clean Wallet (0x7a6f...)',
      address: '0x7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f',
      currency: 'ETH' as CryptoCurrency,
      amount: '2.5',
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setWalletAddress(p.address);
    setCurrency(p.currency);
    setAmount(p.amount);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress && !txHash) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await analyzeTransactionOrWallet(
        {
          walletAddress,
          transactionHash: txHash,
          currency,
          amount: parseFloat(amount) || 0,
        },
        (step, pct) => {
          setStatusText(step);
          setProgress(pct);
        }
      );
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          AI Cyber Threat Neural Analyzer
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Perform live deep-learning inference on wallet addresses, transaction hashes, or custom amounts.
        </p>
      </div>

      {/* Preset Pickers */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
        <span className="text-xs font-mono font-bold text-slate-400 block mb-2">
          Quick Demo Target Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 text-xs font-mono text-slate-300 transition-colors flex items-center gap-1.5 backdrop-blur-md"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analyzer Form */}
      <form onSubmit={handleAnalyze} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
              Wallet Address (BTC, ETH, USDT, BNB, SOL)
            </label>
            <input
              type="text"
              placeholder="e.g. 0x1a2b3c... or bc1qxy..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none font-mono backdrop-blur-md"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
              Transaction Hash (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 0x7f9a2b8e4d3c..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none font-mono backdrop-blur-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
              Cryptocurrency Network
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CryptoCurrency)}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono cursor-pointer backdrop-blur-md"
            >
              <option value="ETH" className="bg-slate-900">Ethereum (ETH)</option>
              <option value="BTC" className="bg-slate-900">Bitcoin (BTC)</option>
              <option value="USDT" className="bg-slate-900">Tether (USDT)</option>
              <option value="BNB" className="bg-slate-900">BNB Smart Chain (BNB)</option>
              <option value="SOL" className="bg-slate-900">Solana (SOL)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
              Transaction Volume Amount
            </label>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono backdrop-blur-md"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || (!walletAddress && !txHash)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-bold font-mono text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Executing Neural Inference Pipeline...' : 'Run AI Threat Analysis'}
        </button>
      </form>

      {/* Loading Animation State */}
      {loading && <LoadingScanner statusText={statusText} progressPercent={progress} />}

      {/* Result Card */}
      {result && !loading && <ExplainabilityCard result={result} />}
    </div>
  );
};

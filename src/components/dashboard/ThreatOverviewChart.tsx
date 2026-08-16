import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ThreatOverviewChartProps {
  timeSeriesData: {
    time: string;
    safe: number;
    suspicious: number;
    malicious: number;
    totalRiskAvg: number;
  }[];
}

export const ThreatOverviewChart: React.FC<ThreatOverviewChartProps> = ({ timeSeriesData }) => {
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('24h');

  // Multiply data slightly for demo ranges
  const chartData = timeSeriesData.map((item) => {
    const multiplier = range === '7d' ? 7 : range === '30d' ? 30 : 1;
    return {
      ...item,
      safe: item.safe * multiplier,
      suspicious: item.suspicious * multiplier,
      malicious: item.malicious * multiplier,
    };
  });

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            Transaction Threat Overview Over Time
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time classification volume comparing safe, suspicious, and malicious transfers
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs font-medium self-start sm:self-auto">
          {(['24h', '7d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg uppercase tracking-wider transition-all ${
                range === r
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Legend Indicators */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 mb-4 bg-white/5 p-2.5 rounded-xl border border-white/10">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Safe ({chartData.reduce((acc, d) => acc + d.safe, 0).toLocaleString()})
        </span>
        <span className="flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> Suspicious ({chartData.reduce((acc, d) => acc + d.suspicious, 0).toLocaleString()})
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-rose-400" /> Malicious ({chartData.reduce((acc, d) => acc + d.malicious, 0).toLocaleString()})
        </span>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorMalicious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8)',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="safe"
              name="Safe Transactions"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSafe)"
            />
            <Area
              type="monotone"
              dataKey="suspicious"
              name="Suspicious"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSuspicious)"
            />
            <Area
              type="monotone"
              dataKey="malicious"
              name="Malicious Threats"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorMalicious)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

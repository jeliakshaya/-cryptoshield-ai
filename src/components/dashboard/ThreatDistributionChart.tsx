import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface ThreatDistributionChartProps {
  distribution: { name: string; value: number; color: string }[];
}

export const ThreatDistributionChart: React.FC<ThreatDistributionChartProps> = ({ distribution }) => {
  const total = distribution.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          Threat Category Distribution
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Proportional breakdown by threat classification vectors
        </p>
      </div>

      {/* Donut Chart */}
      <div className="h-56 w-full relative my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distribution}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value}% (${Math.round((value / total) * 1842)} incidents)`, 'Share']}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold font-mono text-white">1,842</span>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Total Threats</span>
        </div>
      </div>

      {/* Category List */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800/80">
        {distribution.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-1 text-slate-300">
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}</span>
            </span>
            <span className="font-bold text-white shrink-0">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

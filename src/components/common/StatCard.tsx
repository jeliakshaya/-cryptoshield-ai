import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  accentGlow?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendType = 'neutral',
  icon: Icon,
  iconColor = 'text-cyan-400',
  accentGlow,
  onClick,
}) => {
  const trendColor =
    trendType === 'positive'
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      : trendType === 'negative'
      ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
      : 'text-slate-400 bg-slate-800/50 border-slate-700/50';

  return (
    <div
      onClick={onClick}
      className={`relative group bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/[0.08] rounded-2xl p-5 transition-all duration-300 shadow-xl overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Background Accent Gradient */}
      <div
        className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full blur-2xl opacity-15 transition-opacity group-hover:opacity-30 ${
          accentGlow || 'bg-cyan-500'
        }`}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold font-mono text-white tracking-tight">
              {value}
            </span>
            {trend && (
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${trendColor}`}>
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1.5 text-xs text-slate-400">{subtitle}</p>}
        </div>

        <div className={`p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 ${iconColor} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

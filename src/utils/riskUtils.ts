import { RiskLevel } from '../types/crypto';

export function getRiskLevel(score: number): RiskLevel {
  if (score < 30) return 'safe';
  if (score < 55) return 'suspicious';
  if (score < 80) return 'high_risk';
  return 'critical';
}

export function getRiskColor(levelOrScore: RiskLevel | number): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  glow: string;
  hex: string;
} {
  const level: RiskLevel = typeof levelOrScore === 'number' ? getRiskLevel(levelOrScore) : levelOrScore;

  switch (level) {
    case 'safe':
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-800/50',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
        hex: '#10b981',
      };
    case 'suspicious':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-400',
        border: 'border-amber-800/50',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
        hex: '#f59e0b',
      };
    case 'high_risk':
      return {
        bg: 'bg-orange-950/40',
        text: 'text-orange-400',
        border: 'border-orange-800/50',
        badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        glow: 'shadow-[0_0_15px_rgba(249,115,22,0.25)]',
        hex: '#f97316',
      };
    case 'critical':
      return {
        bg: 'bg-rose-950/40',
        text: 'text-rose-400',
        border: 'border-rose-800/50',
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse',
        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]',
        hex: '#f43f5e',
      };
  }
}

export function getRiskLabel(levelOrScore: RiskLevel | number): string {
  const level: RiskLevel = typeof levelOrScore === 'number' ? getRiskLevel(levelOrScore) : levelOrScore;
  switch (level) {
    case 'safe': return 'Safe';
    case 'suspicious': return 'Suspicious';
    case 'high_risk': return 'High Risk';
    case 'critical': return 'Critical Threat';
  }
}

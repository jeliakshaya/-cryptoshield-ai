import React from 'react';
import { RiskLevel } from '../../types/crypto';
import { getRiskColor, getRiskLabel } from '../../utils/riskUtils';

interface RiskBadgeProps {
  score?: number;
  level?: RiskLevel;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  level,
  showScore = true,
  size = 'md',
  className = '',
}) => {
  const currentScore = score !== undefined ? score : 0;
  const colors = getRiskColor(level !== undefined ? level : currentScore);
  const label = getRiskLabel(level !== undefined ? level : currentScore);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 rounded-xl gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center border ${colors.badge} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.text} bg-current`} />
      <span>{label}</span>
      {showScore && score !== undefined && (
        <span className="opacity-90 font-mono">({score}/100)</span>
      )}
    </span>
  );
};

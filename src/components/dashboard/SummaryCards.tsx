import React from 'react';
import {
  Activity,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Gauge,
} from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { formatNumber } from '../../utils/formatters';

interface SummaryCardsProps {
  totalAnalyzed: number;
  threatsDetected: number;
  highRiskCount: number;
  accuracy: number;
  activeAlerts: number;
  networkRiskScore: number;
  onAlertsClick: () => void;
  onTransactionsClick: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalAnalyzed,
  threatsDetected,
  highRiskCount,
  accuracy,
  activeAlerts,
  networkRiskScore,
  onAlertsClick,
  onTransactionsClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        title="Total Analyzed"
        value={formatNumber(totalAnalyzed)}
        subtitle="Last 24 hours ingested"
        trend="+14.2% vs avg"
        trendType="positive"
        icon={Activity}
        iconColor="text-cyan-400"
        accentGlow="bg-cyan-500"
        onClick={onTransactionsClick}
      />

      <StatCard
        title="Threats Flagged"
        value={formatNumber(threatsDetected)}
        subtitle="1.29% threat index"
        trend="-3.8% this week"
        trendType="positive"
        icon={ShieldAlert}
        iconColor="text-amber-400"
        accentGlow="bg-amber-500"
        onClick={onTransactionsClick}
      />

      <StatCard
        title="Critical & High Risk"
        value={formatNumber(highRiskCount)}
        subtitle="Requires immediate AML action"
        trend="42 pending freeze"
        trendType="negative"
        icon={AlertTriangle}
        iconColor="text-rose-400"
        accentGlow="bg-rose-500"
        onClick={onTransactionsClick}
      />

      <StatCard
        title="AI Accuracy"
        value={accuracy > 0 ? `${accuracy}%` : "N/A"}
        subtitle={accuracy > 0 ? "Measured evaluation metric" : "Evaluation not supplied"}
        trend="Measured evaluation pending"
        trendType="positive"
        icon={CheckCircle2}
        iconColor="text-emerald-400"
        accentGlow="bg-emerald-500"
      />

      <StatCard
        title="Active Alerts"
        value={activeAlerts}
        subtitle="Action required in SOC queue"
        trend={activeAlerts > 0 ? `${activeAlerts} Open` : 'Queue Clear'}
        trendType={activeAlerts > 0 ? 'negative' : 'positive'}
        icon={Bell}
        iconColor="text-rose-400"
        accentGlow="bg-rose-500"
        onClick={onAlertsClick}
      />

      <StatCard
        title="Network Risk Score"
        value={`${networkRiskScore}/100`}
        subtitle="Moderate ecosystem threat level"
        trend="Low Volatility"
        trendType="neutral"
        icon={Gauge}
        iconColor="text-cyan-400"
        accentGlow="bg-cyan-500"
      />
    </div>
  );
};

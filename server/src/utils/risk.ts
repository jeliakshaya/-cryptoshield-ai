export type RiskLevel = 'safe' | 'suspicious' | 'high_risk' | 'critical';
export type ThreatType = 'Phishing'|'Ransomware'|'Money Laundering'|'Fraud'|'Wallet Compromise'|'Suspicious Transfers'|'Flash Loan Exploit'|'Mixer Hop'|'Other Anomalies'|'Clean Transaction';

export function getRiskLevel(score: number): RiskLevel {
  if (score < 30) return 'safe';
  if (score < 55) return 'suspicious';
  if (score < 80) return 'high_risk';
  return 'critical';
}

export function severityFromScore(score: number): 'low'|'medium'|'high'|'critical' {
  if (score >= 80) return 'critical';
  if (score >= 55) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}

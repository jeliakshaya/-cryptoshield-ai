export type RiskLevel = 'safe' | 'suspicious' | 'high_risk' | 'critical';

export type ThreatType = 
  | 'Phishing'
  | 'Ransomware'
  | 'Money Laundering'
  | 'Fraud'
  | 'Wallet Compromise'
  | 'Suspicious Transfers'
  | 'Flash Loan Exploit'
  | 'Mixer Hop'
  | 'Other Anomalies'
  | 'Clean Transaction';

export type CryptoCurrency = 'BTC' | 'ETH' | 'USDT' | 'BNB' | 'SOL';

export type TransactionStatus = 'Approved' | 'Flagged' | 'Under Review' | 'Blocked';

export interface ThreatFactor {
  factor: string;
  impactPercentage: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface Transaction {
  id: string;
  hash: string;
  timestamp: string;
  blockNumber: number;
  senderAddress: string;
  senderRiskScore: number;
  receiverAddress: string;
  receiverRiskScore: number;
  currency: CryptoCurrency;
  amount: number;
  amountUSD: number;
  fee: number;
  feeUSD: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  threatType: ThreatType;
  aiConfidence: number; // percentage e.g. 98.5
  status: TransactionStatus;
  network: string; // e.g., 'Ethereum Mainnet', 'Bitcoin Network', 'Solana Mainnet'
  explanation: string;
  factors: ThreatFactor[];
  suspiciousBehaviors: string[];
  recommendedAction: string;
}

export interface SecurityAlert {
  id: string;
  transactionId: string;
  walletAddress: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  threatType: ThreatType;
  riskScore: number;
  timestamp: string;
  description: string;
  recommendedAction: string;
  status: 'open' | 'investigating' | 'resolved' | 'ignored';
  currency: CryptoCurrency;
  amountUSD: number;
}

export interface ConnectedWalletNode {
  address: string;
  label: string;
  type: 'mixer' | 'exchange' | 'suspicious_wallet' | 'defi_pool' | 'darknet_market' | 'clean_user';
  riskScore: number;
  transactionCount: number;
  volumeUSD: number;
  relation: string; // e.g. "Direct Sender (3 txs)", "Intermediate Hop"
}

export interface WalletRiskProfile {
  address: string;
  currency: CryptoCurrency;
  riskScore: number;
  riskLevel: RiskLevel;
  transactionCount: number;
  totalReceivedUSD: number;
  totalSentUSD: number;
  firstActive: string;
  lastActive: string;
  suspiciousTxCount: number;
  flaggedCounterpartiesCount: number;
  associatedThreats: ThreatType[];
  connectedWallets: ConnectedWalletNode[];
  riskHistory: { date: string; riskScore: number }[];
  tags: string[];
}

export interface AnalysisRequest {
  walletAddress?: string;
  transactionHash?: string;
  currency?: CryptoCurrency;
  amount?: number;
  notes?: string;
}

export interface AIAnalysisResult {
  analysisId: string;
  timestamp: string;
  riskScore: number;
  riskLevel: RiskLevel;
  threatType: ThreatType;
  aiConfidence: number;
  anomalyScore: number;
  processingTimeMs: number;
  factors: ThreatFactor[];
  suspiciousBehaviors: string[];
  explanation: string;
  recommendedAction: string;
  modelMetrics: {
    modelName: string;
    modelVersion: string;
    featureCount: number;
    decisionTreeDepth: number;
  };
}

export interface SystemAnalytics {
  totalAnalyzed: number;
  totalThreats: number;
  highRiskCount: number;
  detectionAccuracy: number;
  falsePositiveRate: number;
  aiConfidenceAvg: number;
  avgAnalysisTimeMs: number;
  threatDistribution: { name: string; value: number; color: string }[];
  timeSeriesData: {
    time: string;
    safe: number;
    suspicious: number;
    malicious: number;
    totalRiskAvg: number;
  }[];
  riskScoreHistogram: { range: string; count: number }[];
}

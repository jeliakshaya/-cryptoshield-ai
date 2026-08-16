export function num(value: unknown): number { return Number(value ?? 0); }
export function txRow(row: any) {
  return {
    id: row.id, hash: row.hash, timestamp: new Date(row.timestamp).toISOString(), blockNumber: num(row.block_number),
    senderAddress: row.sender_address, senderRiskScore: num(row.sender_risk_score), receiverAddress: row.receiver_address,
    receiverRiskScore: num(row.receiver_risk_score), currency: row.currency, amount: num(row.amount), amountUSD: num(row.amount_usd),
    fee: num(row.fee), feeUSD: num(row.fee_usd), riskScore: num(row.risk_score), riskLevel: row.risk_level, threatType: row.threat_type,
    aiConfidence: num(row.ai_confidence), status: row.status, network: row.network, explanation: row.explanation,
    factors: row.factors ?? [], suspiciousBehaviors: row.suspicious_behaviors ?? [], recommendedAction: row.recommended_action,
  };
}
export function alertRow(row: any) {
  return {
    id: row.id, transactionId: row.transaction_id, walletAddress: row.wallet_address, severity: row.severity,
    threatType: row.threat_type, riskScore: num(row.risk_score), timestamp: new Date(row.timestamp).toISOString(),
    description: row.description, recommendedAction: row.recommended_action, status: row.status,
    currency: row.currency, amountUSD: num(row.amount_usd),
  };
}

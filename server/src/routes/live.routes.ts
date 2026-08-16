import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../db.js';
import { txRow } from '../utils/serialize.js';

const router = Router();
router.use(requireAuth);

type MempoolTx = {
  txid: string;
  version: number;
  size: number;
  weight: number;
  fee: number;
  vin: Array<{ prevout?: { scriptpubkey_address?: string; value?: number } }>;
  vout: Array<{ scriptpubkey_address?: string; value?: number }>;
  status?: { confirmed?: boolean; block_height?: number | null };
};

async function getBtcUsdPrice(): Promise<number> {
  const sources = [
    'https://api.coinbase.com/v2/prices/BTC-USD/spot',
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
  ];

  for (const url of sources) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!response.ok) continue;
      const data = await response.json() as any;
      const price = Number(data?.data?.amount ?? data?.bitcoin?.usd);
      if (Number.isFinite(price) && price > 0) return price;
    } catch {
      // Try the next public price source.
    }
  }
  return 0;
}
function riskFor(tx: MempoolTx) {
  const inputCount = tx.vin.length;
  const outputCount = tx.vout.length;
  const feeRate = tx.size > 0 ? tx.fee / tx.size : 0;
  const totalBtc =
    tx.vout.reduce((sum, v) => sum + (v.value ?? 0), 0) / 100_000_000;

  // Structural risk baseline for live Bitcoin mempool transactions.
  let score = 10;

  // Transaction complexity
  if (inputCount >= 3) score += 10;
  if (inputCount >= 8) score += 15;

  // Many outputs can indicate distribution/splitting behavior
  if (outputCount >= 5) score += 10;
  if (outputCount >= 10) score += 15;

  // High fee pressure
  if (feeRate >= 20) score += 10;
  if (feeRate >= 50) score += 20;

  // Large transaction value
  if (totalBtc >= 1) score += 10;
  if (totalBtc >= 10) score += 20;

  // Combination of multiple structural indicators
  if (inputCount >= 3 && outputCount >= 5) score += 10;

  score = Math.min(99, score);

  const riskLevel =
    score >= 80
      ? 'critical'
      : score >= 55
        ? 'high_risk'
        : score >= 30
          ? 'suspicious'
          : 'safe';

  const riskConfidence = Math.min(
    99,
    Math.max(55, Math.round(55 + Math.abs(score - 50) * 0.8))
  );

  return {
    score,
    riskLevel,
    riskConfidence,
    inputCount,
    outputCount,
    feeRate,
    totalBtc,
  };
}
router.get('/bitcoin', async (_req, res, next) => {
  try {
    const idsResponse = await fetch('https://blockstream.info/api/mempool/txids', {
      signal: AbortSignal.timeout(8000),
    });
    if (!idsResponse.ok) throw new Error(`Blockstream returned ${idsResponse.status}`);

    const ids = (await idsResponse.json()) as string[];
    const priceUsd = await getBtcUsdPrice();

    const transactions = await Promise.all(
      ids.slice(0, 8).map(async txid => {
        try {
          const response = await fetch(`https://blockstream.info/api/tx/${txid}`, {
            signal: AbortSignal.timeout(8000),
          });
          if (!response.ok) return null;
          return (await response.json()) as MempoolTx;
        } catch {
          return null;
        }
      })
    );

    const mapped = transactions.filter(Boolean).map((tx) => {
      const t = tx as MempoolTx;
      const r = riskFor(t);
      const sender = t.vin.find(v => v.prevout?.scriptpubkey_address)?.prevout?.scriptpubkey_address ?? 'Unknown sender';
      const receiver = t.vout.find(v => v.scriptpubkey_address)?.scriptpubkey_address ?? 'Unknown receiver';
      const amountUSD = priceUsd > 0 ? r.totalBtc * priceUsd : 0;
      const feeBtc = t.fee / 100_000_000;
      const feeUSD = priceUsd > 0 ? feeBtc * priceUsd : 0;
      const id = `LIVE-${t.txid.slice(0, 12)}`;
      const threatType =
  r.score >= 80
    ? 'Other Anomalies'
    : r.score >= 30
      ? 'Suspicious Transfers'
      : 'Clean Transaction';

const status =
  r.score >= 80
    ? 'Blocked'
    : r.score >= 55
      ? 'Flagged'
      : r.score >= 30
        ? 'Under Review'
        : 'Approved';
      return {
        id,
        hash: t.txid,
        timestamp: new Date().toISOString(),
        blockNumber: 0,
        senderAddress: sender,
        senderRiskScore: r.score,
        receiverAddress: receiver,
        receiverRiskScore: r.score,
        currency: 'BTC' as const,
        amount: r.totalBtc,
        amountUSD,
        fee: feeBtc,
        feeUSD,
        riskScore: r.score,
        riskLevel: r.riskLevel,
        threatType,
        // This is deliberately named as a risk confidence in the UI; it is not ML confidence.
        aiConfidence: r.riskConfidence,
        status,
        network: 'Bitcoin Mainnet • Live Mempool',
        explanation: `Live Bitcoin mempool transaction. Structural risk baseline uses ${r.inputCount} inputs, ${r.outputCount} outputs and ${r.feeRate.toFixed(1)} sat/vB. No trained ML prediction is claimed for this live feed.`,
        factors: [
          { factor: 'Input count', impactPercentage: Math.min(30, r.inputCount * 3), severity: r.inputCount >= 8 ? 'high' : 'low', description: `${r.inputCount} transaction inputs observed.` },
          { factor: 'Output count', impactPercentage: Math.min(25, r.outputCount * 2), severity: r.outputCount >= 10 ? 'high' : 'low', description: `${r.outputCount} transaction outputs observed.` },
          { factor: 'Fee rate', impactPercentage: Math.min(25, Math.round(r.feeRate / 2)), severity: r.feeRate >= 50 ? 'high' : 'low', description: `${r.feeRate.toFixed(1)} sat/vB.` },
        ],
        suspiciousBehaviors: r.score >= 30 ? ['Unusual transaction structure'] : ['No structural anomaly detected'],
        recommendedAction: r.score >= 55 ? 'Hold for analyst review before treating as safe.' : 'Continue monitoring.',
      };
    });

    // Persist the live feed so the monitoring table, analytics and alert system see the same transactions.
    for (const transaction of mapped) {
      await query(
        `INSERT INTO transactions
          (id,hash,timestamp,block_number,sender_address,sender_risk_score,receiver_address,receiver_risk_score,
           currency,amount,amount_usd,fee,fee_usd,risk_score,risk_level,threat_type,ai_confidence,status,network,
           explanation,factors,suspicious_behaviors,recommended_action)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
         ON CONFLICT (id) DO UPDATE SET
           timestamp=EXCLUDED.timestamp, amount_usd=EXCLUDED.amount_usd, fee_usd=EXCLUDED.fee_usd,
           risk_score=EXCLUDED.risk_score, risk_level=EXCLUDED.risk_level, threat_type=EXCLUDED.threat_type,
           ai_confidence=EXCLUDED.ai_confidence, status=EXCLUDED.status, explanation=EXCLUDED.explanation,
           factors=EXCLUDED.factors, suspicious_behaviors=EXCLUDED.suspicious_behaviors,
           recommended_action=EXCLUDED.recommended_action, updated_at=NOW()`,
        [
          transaction.id, transaction.hash, transaction.timestamp, transaction.blockNumber,
          transaction.senderAddress, transaction.senderRiskScore, transaction.receiverAddress,
          transaction.receiverRiskScore, transaction.currency, transaction.amount, transaction.amountUSD,
          transaction.fee, transaction.feeUSD, transaction.riskScore, transaction.riskLevel,
          transaction.threatType, transaction.aiConfidence, transaction.status, transaction.network,
          transaction.explanation, JSON.stringify(transaction.factors), JSON.stringify(transaction.suspiciousBehaviors),
          transaction.recommendedAction,
        ]
      );

      if (transaction.riskScore >= 55) {
        await query(
          `INSERT INTO alerts
             (id,transaction_id,wallet_address,severity,threat_type,risk_score,timestamp,description,recommended_action,status,currency,amount_usd)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'open',$10,$11)
           ON CONFLICT (id) DO UPDATE SET risk_score=EXCLUDED.risk_score, amount_usd=EXCLUDED.amount_usd,
             description=EXCLUDED.description, updated_at=NOW()`,
          [
            `LIVE-ALERT-${transaction.hash}`,
            transaction.id,
            transaction.receiverAddress !== 'Unknown receiver' ? transaction.receiverAddress : transaction.senderAddress,
            transaction.riskLevel === 'critical' ? 'critical' : 'high',
            transaction.threatType,
            transaction.riskScore,
            transaction.timestamp,
            'Live Bitcoin mempool transaction crossed the configured structural risk threshold.',
            transaction.recommendedAction,
            transaction.currency,
            transaction.amountUSD,
          ]
        );
      }
    }

    res.json({ transactions: mapped, btcUsdPrice: priceUsd, source: 'Blockstream Bitcoin mempool' });
  } catch (error) {
    next(error);
  }
});

export default router;

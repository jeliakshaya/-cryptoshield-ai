import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { pool, query } from './db.js';

type CsvRow = {
  txId: string;
  actual_class: string;
  predicted_class: string;
  risk_score: string;
};

function readCsv(filePath: string): CsvRow[] {
  const text = fs.readFileSync(filePath, 'utf8').trim();
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines.shift()!.split(',').map(h => h.trim());
  return lines.map(line => {
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = (values[i] ?? '').trim(); });
    return row as CsvRow;
  });
}

function riskLevelFor(score: number) {
  if (score >= 80) return 'critical';
  if (score >= 55) return 'high_risk';
  if (score >= 30) return 'suspicious';
  return 'safe';
}

function threatTypeFor(predictedIllicit: boolean) {
  return predictedIllicit ? 'Suspicious Transfers' : 'Clean Transaction';
}

function stableAmount(txId: string) {
  const n = Number(txId);
  return +(0.001 + (n % 100000) / 100000).toFixed(6);
}

async function main() {
  const csvPath = path.resolve(process.cwd(), 'predicted_transactions.csv');
  const rows = readCsv(csvPath);

  if (!rows.length) throw new Error('predicted_transactions.csv is empty.');
  console.log(`Importing ${rows.length} precomputed Elliptic-model predictions.`);

  for (const row of rows) {
    const rawScore = Number(row.risk_score);
    if (!Number.isFinite(rawScore)) continue;

    // The supplied CSV already stores risk_score on the application's 0..100 scale.
    const riskScore = Math.max(0, Math.min(100, rawScore));
    const predictedIllicit = row.predicted_class === '1';
    const actualIllicit = row.actual_class === '1';
    const riskLevel = riskLevelFor(riskScore);
    const id = `ELLIPTIC-${row.txId}`;

    // Elliptic IDs are dataset transaction IDs, not on-chain tx hashes.
    // We intentionally do not fabricate blockchain addresses/hashes.
    const datasetAddress = `elliptic:${row.txId}`;
    const amount = stableAmount(row.txId);
    const confidence = Math.max(50, Math.min(99.9, 50 + Math.abs(riskScore - 50)));

    await query(
      `INSERT INTO transactions
       (id,hash,timestamp,block_number,sender_address,sender_risk_score,
        receiver_address,receiver_risk_score,currency,amount,amount_usd,fee,fee_usd,
        risk_score,risk_level,threat_type,ai_confidence,status,network,explanation,
        factors,suspicious_behaviors,recommended_action)
       VALUES ($1,$2,NOW(),0,$3,$4,$5,$6,'BTC',$7,0,0,0,$8,$9,$10,$11,$12,'Bitcoin / Elliptic Dataset',$13,$14,$15,$16)
       ON CONFLICT (id) DO UPDATE SET
         risk_score=EXCLUDED.risk_score,
         risk_level=EXCLUDED.risk_level,
         threat_type=EXCLUDED.threat_type,
         ai_confidence=EXCLUDED.ai_confidence,
         status=EXCLUDED.status,
         explanation=EXCLUDED.explanation,
         factors=EXCLUDED.factors,
         suspicious_behaviors=EXCLUDED.suspicious_behaviors,
         recommended_action=EXCLUDED.recommended_action,
         updated_at=NOW()`,
      [
        id,
        `elliptic:${row.txId}`,
        datasetAddress,
        riskScore,
        datasetAddress,
        riskScore,
        amount,
        riskScore,
        riskLevel,
        threatTypeFor(predictedIllicit),
        confidence,
        predictedIllicit ? 'Flagged' : 'Approved',
        `Precomputed model prediction for Elliptic transaction ${row.txId}. Predicted class=${row.predicted_class}; labeled class=${row.actual_class}.`,
        JSON.stringify([{
          factor: 'Elliptic model risk score',
          impactPercentage: Math.round(riskScore),
          severity: riskLevel === 'critical' ? 'critical' : riskLevel === 'high_risk' ? 'high' : riskLevel === 'suspicious' ? 'medium' : 'low',
          description: 'Risk score supplied by the precomputed model prediction (0..100 scale).'
        }]),
        JSON.stringify([
          predictedIllicit ? 'Model predicted illicit activity' : 'Model predicted licit activity',
          actualIllicit ? 'Dataset label: illicit' : 'Dataset label: licit'
        ]),
        predictedIllicit ? 'Escalate for analyst review.' : 'Continue monitoring.'
      ]
    );

    if (predictedIllicit && riskScore >= 55) {
      await query(
        `INSERT INTO alerts
         (id,transaction_id,wallet_address,severity,threat_type,risk_score,timestamp,description,recommended_action,status,currency,amount_usd)
         VALUES($1,$2,$3,$4,$5,$6,NOW(),$7,$8,'open','BTC',0)
         ON CONFLICT(id) DO UPDATE SET risk_score=EXCLUDED.risk_score,status='open',updated_at=NOW()`,
        [
          `ALERT-${row.txId}`,
          id,
          datasetAddress,
          riskLevel === 'critical' ? 'critical' : riskLevel === 'high_risk' ? 'high' : 'medium',
          'Suspicious Transfers',
          riskScore,
          `Precomputed model flagged Elliptic transaction ${row.txId} as potentially illicit.`,
          'Escalate for analyst review.'
        ]
      );
    }
  }

  await pool.end();
  console.log('Elliptic prediction import complete.');
}

main().catch(async err => {
  console.error('Import failed:', err);
  await pool.end().catch(() => {});
  process.exit(1);
});

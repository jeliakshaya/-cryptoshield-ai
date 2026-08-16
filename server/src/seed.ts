import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { pool, query } from './db.js';

async function main() {
  const passwordHash = await bcrypt.hash('Demo@12345', 12);
  const existing = await query('SELECT id FROM users WHERE email=$1', ['analyst@cryptoshield.ai']);
  const userId = existing.rows[0]?.id ?? randomUUID();

  await query(
    `INSERT INTO users(id,name,email,password_hash,role,avatar,department,last_login)
     VALUES($1,$2,$3,$4,$5,$6,$7,NOW())
     ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash,last_login=NOW(),updated_at=NOW()`,
    [userId, 'SOC Analyst', 'analyst@cryptoshield.ai', passwordHash,
      'SOC Security Analyst', '', 'Cryptocurrency Threat Intelligence']
  );

  console.log('Demo analyst account is ready.');
  console.log('Login: analyst@cryptoshield.ai / Demo@12345');
  console.log('Run `npm run db:import` once to import the supplied Elliptic predictions.');
  await pool.end();
}

main().catch(async error => {
  console.error('Seed failed:', error);
  await pool.end().catch(() => {});
  process.exit(1);
});

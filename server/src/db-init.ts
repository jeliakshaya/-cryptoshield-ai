import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(here, '../sql/schema.sql');
const schema = await fs.readFile(schemaPath, 'utf8');
await pool.query(schema);
await pool.end();
console.log(`Database schema initialized from ${schemaPath}`);

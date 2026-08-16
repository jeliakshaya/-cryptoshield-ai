CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'SOC Security Analyst',
  avatar TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT 'Cryptocurrency Forensic Operations',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  hash TEXT UNIQUE NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  block_number BIGINT NOT NULL,
  sender_address TEXT NOT NULL,
  sender_risk_score NUMERIC NOT NULL,
  receiver_address TEXT NOT NULL,
  receiver_risk_score NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  amount_usd NUMERIC NOT NULL,
  fee NUMERIC NOT NULL,
  fee_usd NUMERIC NOT NULL,
  risk_score NUMERIC NOT NULL,
  risk_level TEXT NOT NULL,
  threat_type TEXT NOT NULL,
  ai_confidence NUMERIC NOT NULL,
  status TEXT NOT NULL,
  network TEXT NOT NULL,
  explanation TEXT NOT NULL,
  factors JSONB NOT NULL DEFAULT '[]',
  suspicious_behaviors JSONB NOT NULL DEFAULT '[]',
  recommended_action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_sender ON transactions(sender_address);
CREATE INDEX IF NOT EXISTS idx_transactions_receiver ON transactions(receiver_address);
CREATE INDEX IF NOT EXISTS idx_transactions_risk ON transactions(risk_score DESC);

CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  severity TEXT NOT NULL,
  threat_type TEXT NOT NULL,
  risk_score NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  currency TEXT NOT NULL,
  amount_usd NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts(timestamp DESC);

CREATE TABLE IF NOT EXISTS analyses (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  wallet_address TEXT,
  transaction_hash TEXT,
  currency TEXT,
  amount NUMERIC,
  risk_score NUMERIC NOT NULL,
  risk_level TEXT NOT NULL,
  threat_type TEXT NOT NULL,
  ai_confidence NUMERIC NOT NULL,
  anomaly_score NUMERIC NOT NULL,
  processing_time_ms INTEGER NOT NULL,
  factors JSONB NOT NULL DEFAULT '[]',
  suspicious_behaviors JSONB NOT NULL DEFAULT '[]',
  explanation TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  feature_count INTEGER NOT NULL,
  decision_tree_depth INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS soc_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL,
  risk_sensitivity TEXT NOT NULL DEFAULT 'medium',
  two_factor_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  auto_block_high_risk BOOLEAN NOT NULL DEFAULT TRUE,
  webhook_url TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

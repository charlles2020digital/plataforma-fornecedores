-- ═══════════════════════════════════════════════════════════
-- ELITE Atacado Brasil — Schema do Bot WhatsApp
-- Execute este SQL no Supabase: SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════

-- Tabela de leads (um registro por número de telefone)
CREATE TABLE IF NOT EXISTS wpp_leads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero      TEXT NOT NULL UNIQUE,
  nome        TEXT,
  status      TEXT NOT NULL DEFAULT 'novo',
  -- 'novo'        = primeiro contato
  -- 'interessado' = perguntou sobre preço/produto mas não comprou
  -- 'comprou'     = confirmou compra
  -- 'suporte'     = cliente com problema de acesso
  ultima_mensagem TEXT,
  ultima_interacao TIMESTAMPTZ DEFAULT NOW(),
  followup_enviado BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de conversas (cada mensagem é um registro)
CREATE TABLE IF NOT EXISTS wpp_conversas (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero      TEXT NOT NULL,
  nome        TEXT,
  mensagem    TEXT NOT NULL,
  de_quem     TEXT NOT NULL CHECK (de_quem IN ('cliente', 'bot')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_conversas_numero ON wpp_conversas(numero);
CREATE INDEX IF NOT EXISTS idx_conversas_created ON wpp_conversas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON wpp_leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_followup ON wpp_leads(followup_enviado, ultima_interacao);

-- Desabilitar RLS para acesso via service role (N8N usa service key)
ALTER TABLE wpp_leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE wpp_conversas DISABLE ROW LEVEL SECURITY;

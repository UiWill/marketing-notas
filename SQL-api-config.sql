-- =============================================
-- SQL para criar tabela api_config e inserir chave do Asaas
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Criar tabela para armazenar configurações e chaves de API
CREATE TABLE IF NOT EXISTS api_config (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL UNIQUE,
    api_key TEXT NOT NULL,
    environment VARCHAR(20) DEFAULT 'production',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir a nova chave do Asaas (fornecida pelo Eli)
INSERT INTO api_config (provider, api_key, environment)
VALUES (
    'asaas',
    '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjM0MWY2MGU5LWE5OGEtNDA2NS1iMWI4LTIyZDk2Y2ViZWZhZTo6JGFhY2hfYjg4NzRlZjYtZmFhMC00YmRjLTk4OWUtMTRkNTdlYmI2NTBm',
    'production'
)
ON CONFLICT (provider)
DO UPDATE SET
    api_key = EXCLUDED.api_key,
    updated_at = NOW();

-- Criar índice para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_api_config_provider ON api_config(provider);

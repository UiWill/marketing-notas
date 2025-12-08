-- Migração para adicionar campos de pagamento à tabela leads
-- Execute este script no SQL Editor do Supabase

-- Adicionar campos de pagamento à tabela leads
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'confirmed', 'overdue', 'refunded', 'cancelled')),
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT
    CHECK (payment_method IN ('CREDIT_CARD', 'BOLETO', 'PIX')),
ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT,
ADD COLUMN IF NOT EXISTS converted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- Criar índices para os novos campos
CREATE INDEX IF NOT EXISTS idx_leads_payment_id ON leads(payment_id);
CREATE INDEX IF NOT EXISTS idx_leads_payment_status ON leads(payment_status);
CREATE INDEX IF NOT EXISTS idx_leads_asaas_customer_id ON leads(asaas_customer_id);
CREATE INDEX IF NOT EXISTS idx_leads_converted_at ON leads(converted_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_updated_at ON leads(updated_at DESC);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Criar view para analytics de pagamentos
CREATE OR REPLACE VIEW payment_analytics AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as total_payments,
    COUNT(*) FILTER (WHERE payment_status = 'confirmed') as confirmed_payments,
    COUNT(*) FILTER (WHERE payment_status = 'pending') as pending_payments,
    COUNT(*) FILTER (WHERE payment_method = 'PIX') as pix_payments,
    COUNT(*) FILTER (WHERE payment_method = 'CREDIT_CARD') as credit_card_payments,
    COUNT(*) FILTER (WHERE payment_method = 'BOLETO') as boleto_payments,
    ROUND(
        CASE
            WHEN COUNT(*) > 0 THEN
                (COUNT(*) FILTER (WHERE payment_status = 'confirmed')::NUMERIC / COUNT(*) * 100)
            ELSE 0
        END,
        2
    ) as conversion_rate
FROM leads
WHERE payment_id IS NOT NULL
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Criar view para leads com pagamento
CREATE OR REPLACE VIEW leads_with_payment AS
SELECT
    l.id,
    l.created_at,
    l.name,
    l.email,
    l.phone,
    l.revenue,
    l.payment_status,
    l.payment_method,
    l.payment_id,
    l.converted_at,
    l.conversion_stage,
    CASE
        WHEN l.payment_status = 'confirmed' THEN '✅ Pago'
        WHEN l.payment_status = 'pending' THEN '⏳ Pendente'
        WHEN l.payment_status = 'overdue' THEN '⚠️ Vencido'
        WHEN l.payment_status = 'refunded' THEN '↩️ Estornado'
        ELSE '❌ Cancelado'
    END as status_display
FROM leads l
WHERE l.payment_id IS NOT NULL
ORDER BY l.created_at DESC;

-- Comentários para documentação
COMMENT ON COLUMN leads.payment_status IS 'Status do pagamento: pending, confirmed, overdue, refunded, cancelled';
COMMENT ON COLUMN leads.payment_id IS 'ID do pagamento no Asaas';
COMMENT ON COLUMN leads.payment_method IS 'Método de pagamento: CREDIT_CARD, BOLETO, PIX';
COMMENT ON COLUMN leads.asaas_customer_id IS 'ID do cliente no Asaas';
COMMENT ON COLUMN leads.converted_at IS 'Data/hora em que o pagamento foi confirmado';
COMMENT ON COLUMN leads.updated_at IS 'Data/hora da última atualização do registro';

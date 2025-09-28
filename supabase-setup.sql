-- Criar tabelas no Supabase
-- Execute estes comandos no SQL Editor do Supabase

-- Tabela de leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    revenue NUMERIC NOT NULL,
    source TEXT DEFAULT 'landing_page',
    video_progress REAL DEFAULT 0,
    video_completed BOOLEAN DEFAULT FALSE,
    video_dropped_at REAL,
    conversion_stage TEXT DEFAULT 'lead' CHECK (conversion_stage IN ('lead', 'qualified', 'converted')),
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT
);

-- Tabela de eventos de vídeo
CREATE TABLE IF NOT EXISTS video_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('play', 'pause', 'progress', 'complete', 'drop')),
    timestamp REAL NOT NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_conversion_stage ON leads(conversion_stage);
CREATE INDEX IF NOT EXISTS idx_video_events_lead_id ON video_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_video_events_created_at ON video_events(created_at DESC);

-- RLS (Row Level Security) - Opcional, dependendo dos requisitos de segurança
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE video_events ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (ajuste conforme necessário)
-- CREATE POLICY "Leads são públicos para inserção" ON leads FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Leads são públicos para leitura" ON leads FOR SELECT USING (true);
-- CREATE POLICY "Leads são públicos para atualização" ON leads FOR UPDATE USING (true);

-- CREATE POLICY "Video events são públicos para inserção" ON video_events FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Video events são públicos para leitura" ON video_events FOR SELECT USING (true);

-- Função para calcular analytics (opcional)
CREATE OR REPLACE FUNCTION get_analytics_summary()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_leads', COUNT(*),
        'conversion_rate',
            CASE
                WHEN COUNT(*) > 0 THEN
                    ROUND((COUNT(*) FILTER (WHERE conversion_stage = 'converted')::NUMERIC / COUNT(*) * 100), 2)
                ELSE 0
            END,
        'average_video_completion',
            CASE
                WHEN COUNT(*) > 0 THEN
                    ROUND(AVG(video_progress) * 100, 2)
                ELSE 0
            END,
        'total_revenue_potential', SUM(revenue)
    )
    INTO result
    FROM leads;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Adicionar coluna updated_at se necessário
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
-- CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de teste (opcional)
-- INSERT INTO leads (name, email, phone, revenue) VALUES
-- ('João Silva', 'joao@exemplo.com', '11999999999', 15000),
-- ('Maria Santos', 'maria@exemplo.com', '11888888888', 25000),
-- ('Pedro Costa', 'pedro@exemplo.com', '11777777777', 35000);

-- Views úteis para analytics
CREATE OR REPLACE VIEW leads_analytics AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as daily_leads,
    AVG(video_progress) * 100 as avg_video_completion,
    COUNT(*) FILTER (WHERE video_completed = true) as completed_videos,
    COUNT(*) FILTER (WHERE conversion_stage = 'converted') as conversions,
    SUM(revenue) as total_revenue_potential
FROM leads
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW video_analytics AS
SELECT
    l.id,
    l.name,
    l.email,
    l.video_progress * 100 as progress_percent,
    l.video_completed,
    l.video_dropped_at,
    COUNT(ve.id) as total_events,
    MIN(ve.created_at) FILTER (WHERE ve.event_type = 'play') as first_play,
    MAX(ve.created_at) FILTER (WHERE ve.event_type = 'pause') as last_pause
FROM leads l
LEFT JOIN video_events ve ON l.id = ve.lead_id
GROUP BY l.id, l.name, l.email, l.video_progress, l.video_completed, l.video_dropped_at
ORDER BY l.created_at DESC;
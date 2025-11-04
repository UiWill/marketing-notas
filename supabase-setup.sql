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

-- Tabela de sessões de visitantes (para tracking de visitantes únicos)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    session_id TEXT UNIQUE NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    landing_page TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT
);

-- Tabela de page views (cada visualização de página)
CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    session_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    page_title TEXT,
    time_on_page INTEGER, -- em segundos
    scrolled_to_bottom BOOLEAN DEFAULT FALSE,
    clicked_cta BOOLEAN DEFAULT FALSE,
    started_video BOOLEAN DEFAULT FALSE,
    completed_form BOOLEAN DEFAULT FALSE
);

-- Tabela de eventos personalizados
CREATE TABLE IF NOT EXISTS custom_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    session_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_properties JSONB,
    page_path TEXT
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_conversion_stage ON leads(conversion_stage);
CREATE INDEX IF NOT EXISTS idx_video_events_lead_id ON video_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_video_events_created_at ON video_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_events_session_id ON custom_events(session_id);
CREATE INDEX IF NOT EXISTS idx_custom_events_event_name ON custom_events(event_name);
CREATE INDEX IF NOT EXISTS idx_custom_events_created_at ON custom_events(created_at DESC);

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

-- View de funil de conversão
CREATE OR REPLACE VIEW conversion_funnel AS
SELECT
    (SELECT COUNT(DISTINCT session_id) FROM page_views) as total_visitors,
    (SELECT COUNT(DISTINCT session_id) FROM page_views WHERE started_video = true) as video_started,
    (SELECT COUNT(DISTINCT session_id) FROM page_views WHERE clicked_cta = true) as cta_clicked,
    (SELECT COUNT(*) FROM leads) as form_submitted,
    (SELECT COUNT(*) FROM leads WHERE conversion_stage = 'converted') as converted;

-- View de métricas diárias
CREATE OR REPLACE VIEW daily_metrics AS
SELECT
    DATE(created_at) as date,
    COUNT(DISTINCT session_id) as unique_visitors,
    COUNT(*) as total_pageviews,
    AVG(time_on_page) as avg_time_on_page,
    COUNT(*) FILTER (WHERE started_video = true) as video_views,
    COUNT(*) FILTER (WHERE clicked_cta = true) as cta_clicks,
    COUNT(*) FILTER (WHERE completed_form = true) as form_completions
FROM page_views
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View de origem de tráfego
CREATE OR REPLACE VIEW traffic_sources AS
SELECT
    COALESCE(utm_source, 'direct') as source,
    COALESCE(utm_medium, 'none') as medium,
    COALESCE(utm_campaign, 'none') as campaign,
    COUNT(DISTINCT s.session_id) as sessions,
    COUNT(DISTINCT pv.id) as pageviews,
    COUNT(DISTINCT CASE WHEN pv.started_video = true THEN pv.session_id END) as video_starts,
    COUNT(DISTINCT CASE WHEN pv.completed_form = true THEN pv.session_id END) as conversions
FROM sessions s
LEFT JOIN page_views pv ON s.session_id = pv.session_id
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY sessions DESC;
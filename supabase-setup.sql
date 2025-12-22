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
    session_id TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('play', 'pause', 'progress', 'complete', 'drop', 'seek')),
    timestamp REAL NOT NULL, -- posição no vídeo em segundos
    video_duration REAL, -- duração total do vídeo
    percentage REAL -- porcentagem assistida
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
    completed_form BOOLEAN DEFAULT FALSE,
    -- Tracking de seções visitadas
    viewed_hero BOOLEAN DEFAULT FALSE,
    viewed_video BOOLEAN DEFAULT FALSE,
    viewed_testimonials BOOLEAN DEFAULT FALSE,
    viewed_benefits BOOLEAN DEFAULT FALSE,
    viewed_comparison BOOLEAN DEFAULT FALSE,
    viewed_pricing BOOLEAN DEFAULT FALSE,
    viewed_guarantee BOOLEAN DEFAULT FALSE,
    -- Tempo gasto em cada seção (em segundos)
    time_on_hero INTEGER DEFAULT 0,
    time_on_video INTEGER DEFAULT 0,
    time_on_testimonials INTEGER DEFAULT 0,
    time_on_benefits INTEGER DEFAULT 0,
    time_on_comparison INTEGER DEFAULT 0,
    time_on_pricing INTEGER DEFAULT 0,
    time_on_guarantee INTEGER DEFAULT 0
);

-- Tabela de eventos personalizados
CREATE TABLE IF NOT EXISTS custom_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    session_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_properties JSONB,
    page_path TEXT,
    event_sequence INTEGER, -- ordem sequencial dos eventos na sessão
    previous_event TEXT, -- evento anterior para análise de funil
    time_since_previous_event INTEGER -- tempo desde o evento anterior em segundos
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

-- View de retenção do vídeo por minuto
CREATE OR REPLACE VIEW video_retention_by_minute AS
SELECT
    FLOOR(timestamp / 60) as minute,
    COUNT(DISTINCT session_id) as viewers,
    COUNT(DISTINCT CASE WHEN event_type = 'drop' THEN session_id END) as dropoffs,
    AVG(percentage) as avg_percentage
FROM video_events
WHERE event_type IN ('progress', 'drop')
GROUP BY FLOOR(timestamp / 60)
ORDER BY minute;

-- View de análise de seções visitadas
CREATE OR REPLACE VIEW section_analytics AS
SELECT
    COUNT(*) as total_views,
    COUNT(CASE WHEN viewed_hero THEN 1 END) as hero_views,
    COUNT(CASE WHEN viewed_video THEN 1 END) as video_views,
    COUNT(CASE WHEN viewed_testimonials THEN 1 END) as testimonials_views,
    COUNT(CASE WHEN viewed_benefits THEN 1 END) as benefits_views,
    COUNT(CASE WHEN viewed_comparison THEN 1 END) as comparison_views,
    COUNT(CASE WHEN viewed_pricing THEN 1 END) as pricing_views,
    COUNT(CASE WHEN viewed_guarantee THEN 1 END) as guarantee_views,
    AVG(time_on_hero) as avg_time_hero,
    AVG(time_on_video) as avg_time_video,
    AVG(time_on_testimonials) as avg_time_testimonials,
    AVG(time_on_benefits) as avg_time_benefits,
    AVG(time_on_comparison) as avg_time_comparison,
    AVG(time_on_pricing) as avg_time_pricing,
    AVG(time_on_guarantee) as avg_time_guarantee,
    -- Taxa de conversão por seção
    ROUND(100.0 * COUNT(CASE WHEN viewed_testimonials AND completed_form THEN 1 END) / NULLIF(COUNT(CASE WHEN viewed_testimonials THEN 1 END), 0), 2) as testimonials_conversion_rate,
    ROUND(100.0 * COUNT(CASE WHEN viewed_pricing AND completed_form THEN 1 END) / NULLIF(COUNT(CASE WHEN viewed_pricing THEN 1 END), 0), 2) as pricing_conversion_rate
FROM page_views;

-- View de funil de ações sequenciais
CREATE OR REPLACE VIEW action_funnel AS
WITH event_sequences AS (
    SELECT
        session_id,
        event_name,
        event_sequence,
        previous_event,
        created_at
    FROM custom_events
    ORDER BY session_id, event_sequence
)
SELECT
    previous_event,
    event_name as next_event,
    COUNT(*) as transition_count,
    COUNT(DISTINCT session_id) as unique_sessions,
    AVG(time_since_previous_event) as avg_time_between_events
FROM event_sequences
WHERE previous_event IS NOT NULL
GROUP BY previous_event, event_name
ORDER BY transition_count DESC;

-- View de jornada de conversão
CREATE OR REPLACE VIEW conversion_journey AS
SELECT
    pv.session_id,
    pv.viewed_video,
    pv.viewed_testimonials,
    pv.viewed_benefits,
    pv.viewed_comparison,
    pv.viewed_pricing,
    pv.clicked_cta,
    pv.completed_form,
    pv.time_on_page,
    s.utm_source,
    s.utm_campaign,
    l.id as lead_id,
    l.conversion_stage,
    l.video_progress
FROM page_views pv
LEFT JOIN sessions s ON pv.session_id = s.session_id
LEFT JOIN leads l ON pv.completed_form = true
ORDER BY pv.created_at DESC;

-- View de análise de drop-off do vídeo
CREATE OR REPLACE VIEW video_dropoff_analysis AS
SELECT
    CASE
        WHEN timestamp < 30 THEN '0-30s'
        WHEN timestamp < 60 THEN '30s-1min'
        WHEN timestamp < 120 THEN '1-2min'
        WHEN timestamp < 180 THEN '2-3min'
        WHEN timestamp < 300 THEN '3-5min'
        WHEN timestamp < 600 THEN '5-10min'
        ELSE '10min+'
    END as time_range,
    COUNT(DISTINCT session_id) as dropoff_count,
    AVG(percentage) as avg_completion_percentage
FROM video_events
WHERE event_type = 'drop'
GROUP BY time_range
ORDER BY MIN(timestamp);
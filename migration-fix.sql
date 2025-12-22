-- ========================================
-- MIGRATION SCRIPT - ORDEM CORRETA
-- Execute este arquivo completo no Supabase SQL Editor
-- ========================================

-- PASSO 1: Adicionar colunas nas tabelas PRIMEIRO
-- ========================================

-- 1.1. Adicionar colunas na tabela custom_events
ALTER TABLE custom_events ADD COLUMN IF NOT EXISTS event_sequence INTEGER;
ALTER TABLE custom_events ADD COLUMN IF NOT EXISTS previous_event TEXT;
ALTER TABLE custom_events ADD COLUMN IF NOT EXISTS time_since_previous_event INTEGER;

-- 1.2. Adicionar colunas na tabela video_events
ALTER TABLE video_events ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE video_events ADD COLUMN IF NOT EXISTS video_duration REAL;
ALTER TABLE video_events ADD COLUMN IF NOT EXISTS percentage REAL;

-- 1.3. Atualizar constraint de event_type
ALTER TABLE video_events DROP CONSTRAINT IF EXISTS video_events_event_type_check;
ALTER TABLE video_events ADD CONSTRAINT video_events_event_type_check
    CHECK (event_type IN ('play', 'pause', 'progress', 'complete', 'drop', 'seek'));

-- 1.4. Adicionar colunas na tabela page_views
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS viewed_hero BOOLEAN DEFAULT FALSE;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS viewed_video BOOLEAN DEFAULT FALSE;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS viewed_testimonials BOOLEAN DEFAULT FALSE;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS viewed_benefits BOOLEAN DEFAULT FALSE;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS viewed_comparison BOOLEAN DEFAULT FALSE;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS viewed_pricing BOOLEAN DEFAULT FALSE;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS viewed_guarantee BOOLEAN DEFAULT FALSE;

ALTER TABLE page_views ADD COLUMN IF NOT EXISTS time_on_hero INTEGER DEFAULT 0;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS time_on_video INTEGER DEFAULT 0;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS time_on_testimonials INTEGER DEFAULT 0;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS time_on_benefits INTEGER DEFAULT 0;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS time_on_comparison INTEGER DEFAULT 0;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS time_on_pricing INTEGER DEFAULT 0;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS time_on_guarantee INTEGER DEFAULT 0;

-- PASSO 2: Criar/Atualizar as VIEWS
-- ========================================

-- 2.1. View de retenção do vídeo por minuto
CREATE OR REPLACE VIEW video_retention_by_minute AS
SELECT
    FLOOR(timestamp / 60) as minute,
    COUNT(DISTINCT session_id) as viewers,
    COUNT(DISTINCT CASE WHEN event_type = 'drop' THEN session_id END) as dropoffs,
    AVG(percentage) as avg_percentage
FROM video_events
WHERE event_type IN ('progress', 'drop')
  AND session_id IS NOT NULL
GROUP BY FLOOR(timestamp / 60)
ORDER BY minute;

-- 2.2. View de análise de seções visitadas
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
    ROUND(100.0 * COUNT(CASE WHEN viewed_testimonials AND completed_form THEN 1 END) /
        NULLIF(COUNT(CASE WHEN viewed_testimonials THEN 1 END), 0), 2) as testimonials_conversion_rate,
    ROUND(100.0 * COUNT(CASE WHEN viewed_pricing AND completed_form THEN 1 END) /
        NULLIF(COUNT(CASE WHEN viewed_pricing THEN 1 END), 0), 2) as pricing_conversion_rate
FROM page_views;

-- 2.3. View de funil de ações sequenciais
CREATE OR REPLACE VIEW action_funnel AS
WITH event_sequences AS (
    SELECT
        session_id,
        event_name,
        event_sequence,
        previous_event,
        time_since_previous_event,
        created_at
    FROM custom_events
    WHERE event_sequence IS NOT NULL
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

-- 2.4. View de jornada de conversão
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

-- 2.5. View de análise de drop-off do vídeo
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
  AND session_id IS NOT NULL
GROUP BY
    CASE
        WHEN timestamp < 30 THEN '0-30s'
        WHEN timestamp < 60 THEN '30s-1min'
        WHEN timestamp < 120 THEN '1-2min'
        WHEN timestamp < 180 THEN '2-3min'
        WHEN timestamp < 300 THEN '3-5min'
        WHEN timestamp < 600 THEN '5-10min'
        ELSE '10min+'
    END
ORDER BY MIN(timestamp);

-- PASSO 3: Verificar se tudo funcionou
-- ========================================

-- 3.1. Verificar colunas da custom_events
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'custom_events'
  AND column_name IN ('event_sequence', 'previous_event', 'time_since_previous_event');

-- 3.2. Verificar colunas da video_events
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'video_events'
  AND column_name IN ('session_id', 'video_duration', 'percentage');

-- 3.3. Verificar colunas da page_views
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'page_views'
  AND column_name LIKE '%viewed_%' OR column_name LIKE '%time_on_%';

-- 3.4. Verificar se as views foram criadas
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN (
    'video_retention_by_minute',
    'section_analytics',
    'action_funnel',
    'conversion_journey',
    'video_dropoff_analysis'
  );

-- ========================================
-- SUCESSO! Se chegou até aqui sem erros, está tudo pronto!
-- ========================================

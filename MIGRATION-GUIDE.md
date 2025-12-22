# Guia de Migração - Sistema de Analytics Avançado

## Visão Geral

Este guia ajudará você a aplicar todas as melhorias de tracking avançado no seu sistema. As novas funcionalidades incluem:

✅ **Tracking de retenção de vídeo por minuto**
✅ **Análise de drop-off detalhada do vídeo**
✅ **Tracking de visualização de seções da página**
✅ **Funil de ações sequenciais completo**
✅ **Dashboard com analytics avançadas**

---

## Passo 1: Atualizar o Banco de Dados (Supabase)

### 1.1. Acessar o SQL Editor do Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Abra seu projeto
3. Vá em "SQL Editor" no menu lateral

### 1.2. Aplicar as Alterações nas Tabelas

Execute os comandos SQL abaixo na ordem:

```sql
-- ========================================
-- 1. ATUALIZAR TABELA page_views
-- ========================================
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

-- ========================================
-- 2. ATUALIZAR TABELA video_events
-- ========================================
ALTER TABLE video_events ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE video_events ADD COLUMN IF NOT EXISTS video_duration REAL;
ALTER TABLE video_events ADD COLUMN IF NOT EXISTS percentage REAL;

-- Atualizar constraint de event_type para incluir 'seek'
ALTER TABLE video_events DROP CONSTRAINT IF EXISTS video_events_event_type_check;
ALTER TABLE video_events ADD CONSTRAINT video_events_event_type_check
    CHECK (event_type IN ('play', 'pause', 'progress', 'complete', 'drop', 'seek'));

-- ========================================
-- 3. ATUALIZAR TABELA custom_events
-- ========================================
ALTER TABLE custom_events ADD COLUMN IF NOT EXISTS event_sequence INTEGER;
ALTER TABLE custom_events ADD COLUMN IF NOT EXISTS previous_event TEXT;
ALTER TABLE custom_events ADD COLUMN IF NOT EXISTS time_since_previous_event INTEGER;

-- ========================================
-- 4. CRIAR VIEWS DE ANALYTICS
-- ========================================

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
    ROUND(100.0 * COUNT(CASE WHEN viewed_testimonials AND completed_form THEN 1 END) /
        NULLIF(COUNT(CASE WHEN viewed_testimonials THEN 1 END), 0), 2) as testimonials_conversion_rate,
    ROUND(100.0 * COUNT(CASE WHEN viewed_pricing AND completed_form THEN 1 END) /
        NULLIF(COUNT(CASE WHEN viewed_pricing THEN 1 END), 0), 2) as pricing_conversion_rate
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
```

### 1.3. Verificar se Tudo Foi Aplicado

Execute este comando para verificar:

```sql
-- Verificar colunas da page_views
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'page_views'
ORDER BY ordinal_position;

-- Verificar se as views foram criadas
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name IN ('video_retention_by_minute', 'section_analytics', 'action_funnel', 'video_dropoff_analysis');
```

---

## Passo 2: Deploy do Código Atualizado

### 2.1. Verificar Alterações

Os seguintes arquivos foram criados/atualizados:

**Novos Arquivos:**
- `src/hooks/useSectionTracking.ts` - Hook para tracking de seções
- `src/components/VideoRetentionChart.tsx` - Gráfico de retenção do vídeo
- `src/components/SectionAnalyticsCard.tsx` - Card de análise de seções
- `src/components/ActionFunnelChart.tsx` - Funil de ações sequenciais
- `src/components/VideoDropoffChart.tsx` - Análise de drop-off

**Arquivos Atualizados:**
- `src/hooks/useVideoTracking.ts` - Melhorado com tracking por minuto
- `src/hooks/usePageTracking.ts` - Adicionado tracking de seções
- `src/pages/Dashboard.tsx` - Adicionado novos componentes de analytics
- `src/pages/LandingPage.tsx` - Adicionado IDs nas seções
- `src/components/VideoPlayer.tsx` - Melhorado tracking
- `supabase-setup.sql` - Schema atualizado

### 2.2. Build e Deploy

```bash
# Instalar dependências (se necessário)
npm install

# Fazer type check
npm run typecheck

# Build para produção
npm run build

# Deploy (use seu método de deploy)
npm run deploy
```

---

## Passo 3: Testar o Sistema

### 3.1. Teste na Landing Page

1. Acesse a landing page
2. Navegue pelas seções (role a página)
3. Assista ao vídeo por alguns minutos
4. Clique nos CTAs
5. Preencha o formulário

### 3.2. Verificar Dados no Supabase

Execute estas queries para ver os dados sendo coletados:

```sql
-- Ver sessões recentes
SELECT * FROM sessions ORDER BY created_at DESC LIMIT 10;

-- Ver page views com tracking de seções
SELECT
    session_id,
    viewed_hero, viewed_video, viewed_testimonials,
    viewed_pricing, viewed_guarantee,
    time_on_video, time_on_testimonials
FROM page_views
ORDER BY created_at DESC
LIMIT 10;

-- Ver eventos de vídeo com retenção por minuto
SELECT * FROM video_events ORDER BY created_at DESC LIMIT 20;

-- Ver eventos customizados com sequência
SELECT event_name, event_sequence, previous_event, time_since_previous_event
FROM custom_events
ORDER BY created_at DESC
LIMIT 20;
```

### 3.3. Verificar Dashboard

1. Acesse `/dashboard`
2. Verifique se aparecem os novos componentes:
   - ✅ Gráfico de Retenção do Vídeo
   - ✅ Análise de Drop-off
   - ✅ Analytics de Seções
   - ✅ Funil de Ações Sequenciais

---

## O Que Mudou e Como Usar

### 1. Retenção de Vídeo por Minuto

**O que rastreia:**
- Quantos usuários estão assistindo a cada minuto
- Onde acontecem os drop-offs
- Porcentagem média de conclusão

**Como usar para otimização:**
- Identifique em qual minuto há mais abandono
- Revise o conteúdo daquele período
- Teste diferentes abordagens

**Exemplo de insight:**
> "75% dos viewers abandonam no minuto 3. Vamos melhorar o hook nesse momento."

### 2. Análise de Seções da Página

**O que rastreia:**
- Quais seções cada visitante visualizou
- Quanto tempo passou em cada seção
- Taxa de conversão por seção visitada

**Como usar para otimização:**
- Identifique seções com baixa visualização
- Mova seções importantes para cima
- Teste diferentes ordenações

**Exemplo de insight:**
> "Leads que veem os depoimentos convertem 2x mais. Vamos destacar essa seção."

### 3. Funil de Ações Sequenciais

**O que rastreia:**
- Sequência de ações dos usuários
- Tempo entre cada ação
- Caminhos mais comuns até conversão

**Como usar para otimização:**
- Identifique o caminho mais comum para conversão
- Otimize esse caminho específico
- Remova fricções nas transições

**Exemplo de insight:**
> "Sequência mais comum: Vídeo (60%) → Depoimentos → CTA. Vamos fortalecer essa jornada."

### 4. Drop-off do Vídeo

**O que rastreia:**
- Em quais períodos acontecem mais abandonos
- Porcentagem média de conclusão por período
- Períodos críticos que precisam de atenção

**Como usar para otimização:**
- Foque nos períodos com mais drop-offs
- Teste diferentes edições do vídeo
- Adicione elementos visuais nos momentos críticos

**Exemplo de insight:**
> "60% dos drop-offs acontecem entre 2-3min. Vamos adicionar um depoimento nesse momento."

---

## Métricas Disponíveis no Dashboard

### Analytics Avançadas (Novo)
- 📊 Retenção do Vídeo por Minuto
- 📉 Drop-off Analysis com Períodos Críticos
- 👁️ Visualização de Seções com Tempo Gasto
- 🔀 Funil de Ações Sequenciais

### Métricas de Conversão (Existente)
- 👥 Total de Leads
- 🎯 Taxa de Conversão
- ▶️ Conclusão Média do Vídeo
- 💰 Potencial de Receita

### Google Analytics Integration (Existente)
- 🌍 Dados do Google Analytics
- 📈 Métricas de Tráfego

---

## Solução de Problemas

### Problema: Views não aparecem no Supabase

**Solução:**
```sql
-- Verificar se as views existem
SELECT * FROM information_schema.views WHERE table_schema = 'public';

-- Se não existirem, execute novamente os comandos CREATE OR REPLACE VIEW
```

### Problema: Dashboard mostra "Nenhum dado disponível"

**Causa:** Banco de dados vazio ou views sem dados

**Solução:**
1. Navegue pela landing page para gerar dados
2. Aguarde alguns minutos
3. Atualize o dashboard

### Problema: Erros no console do navegador

**Solução:**
```bash
# Limpar cache e reinstalar dependências
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Próximos Passos Recomendados

1. **Coletar Dados Iniciais** (1-2 semanas)
   - Deixe o sistema coletar dados
   - Não faça alterações ainda

2. **Analisar Padrões** (Após 1-2 semanas)
   - Identifique onde estão os drop-offs
   - Veja quais seções convertem mais
   - Analise o funil mais comum

3. **Fazer Testes A/B**
   - Teste diferentes versões do vídeo
   - Teste diferentes ordenações de seções
   - Teste diferentes CTAs

4. **Iterar e Otimizar**
   - Implemente as melhorias
   - Meça os resultados
   - Continue otimizando

---

## Suporte

Se encontrar problemas:
1. Verifique os logs do console do navegador
2. Verifique os logs do Supabase
3. Confirme que todas as migrations foram aplicadas
4. Verifique se o build foi feito corretamente

---

**🎉 Parabéns! Seu sistema de analytics avançado está pronto!**

Agora você tem todas as ferramentas necessárias para otimizar seus anúncios e maximizar conversões.

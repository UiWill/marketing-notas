# Sistema Completo de Tracking - Dnotas Landing Page

Este guia explica como configurar o sistema completo de tracking de visitantes e conversões.

## O Que Foi Implementado

### 1. Tracking de Visitantes Anônimos
- **Sessões Únicas**: Cada visitante recebe um session_id único armazenado no sessionStorage
- **Page Views**: Rastreamento de cada visualização de página
- **Tempo na Página**: Medição automática de quanto tempo o visitante fica na página
- **Scroll Tracking**: Detecta quando o visitante rola até o final da página
- **Eventos Customizados**: Sistema flexível para rastrear qualquer evento

### 2. Funil de Conversão Completo
O sistema rastreia automaticamente:
1. **Visitantes Únicos** - Quantas pessoas acessaram o site
2. **Iniciaram o Vídeo** - Quantos deram play no vídeo
3. **Clicaram no CTA** - Quantos clicaram no botão de ação
4. **Preencheram Formulário** - Quantos completaram o cadastro
5. **Converteram** - Quantos se tornaram clientes pagantes

### 3. Dados Coletados Automaticamente
- **Informações de Tráfego**: UTM parameters (source, medium, campaign, term, content)
- **Informações do Dispositivo**: Tipo (mobile/tablet/desktop), navegador, sistema operacional
- **Origem**: Referrer, landing page
- **Comportamento**: Tempo na página, scroll, cliques, visualização de vídeo

## Configuração do Banco de Dados

### Passo 1: Executar o Script SQL

1. Acesse o [Supabase](https://supabase.com) e faça login
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **+ New query**
5. Copie todo o conteúdo do arquivo `supabase-setup.sql`
6. Cole no editor SQL
7. Clique em **Run** (ou pressione Ctrl/Cmd + Enter)

O script irá criar:
- ✅ Tabela `sessions` - Armazena sessões únicas de visitantes
- ✅ Tabela `page_views` - Registra cada visualização de página
- ✅ Tabela `custom_events` - Eventos customizados
- ✅ Views de analytics:
  - `conversion_funnel` - Funil completo de conversão
  - `traffic_sources` - Análise de fontes de tráfego
  - `daily_metrics` - Métricas diárias agregadas

### Passo 2: Verificar as Tabelas

Após executar o script, verifique se as tabelas foram criadas:

```sql
-- Execute esta query para ver todas as tabelas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Você deve ver:
- leads
- video_events
- sessions
- page_views
- custom_events

## Como Funciona o Tracking

### 1. Tracking Automático na Landing Page

O hook `usePageTracking` é chamado automaticamente quando a página carrega:

```typescript
const { updatePageView, trackEvent } = usePageTracking({
  trackScroll: true,        // Rastreia scroll até o final
  trackTimeOnPage: true,    // Mede tempo na página
})
```

### 2. Eventos Rastreados Automaticamente

#### Ao Carregar a Página:
- Cria uma nova sessão (se não existir)
- Registra um page view
- Captura informações do dispositivo e origem

#### Quando o Visitante Inicia o Vídeo:
```typescript
updatePageView({ started_video: true })
trackEvent('video_started')
```

#### Quando Clica no CTA:
```typescript
updatePageView({ clicked_cta: true })
trackEvent('cta_clicked', { section: 'main' })
```

#### Quando Preenche o Formulário:
```typescript
updatePageView({ completed_form: true })
trackEvent('form_submitted', { lead_id: id })
```

#### Ao Sair da Página:
- Registra o tempo total na página
- Usa `navigator.sendBeacon` para garantir que os dados sejam enviados

## Dashboard de Marketing

Acesse: `http://seu-site.com/dashboard`

### Métricas Disponíveis:

#### Linha 1 - Métricas de Tráfego (cards coloridos)
- **Visitantes Únicos**: Total de sessões únicas
- **Taxa de Visualização do Vídeo**: % que iniciou o vídeo
- **Taxa de Clique no CTA**: % que clicou no botão
- **Taxa de Conversão de Formulário**: % que completou o cadastro

#### Linha 2 - Métricas de Leads
- **Total de Leads**: Quantos se cadastraram
- **Taxa de Conversão**: % que viraram clientes
- **Conclusão Média do Vídeo**: % assistido em média
- **Potencial de Receita**: Soma do faturamento dos leads

#### Funil de Conversão Visual
Gráfico com barras mostrando cada etapa:
- 100% - Visitantes
- X% - Iniciaram Vídeo
- Y% - Clicaram CTA
- Z% - Preencheram Formulário
- W% - Converteram

#### Tabela de Fontes de Tráfego
Mostra de onde vêm os visitantes:
- Fonte (Facebook, Google, Direct, etc.)
- Meio (CPC, Organic, Referral, etc.)
- Campanha
- Número de sessões
- Conversões

## Testando o Sistema

### 1. Teste em Modo de Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173` e:
1. Abra a página
2. Role até o final
3. Inicie o vídeo
4. Clique no CTA
5. Preencha o formulário

### 2. Verificar no Supabase

No Supabase, execute estas queries para ver os dados:

```sql
-- Ver sessões criadas
SELECT * FROM sessions ORDER BY created_at DESC LIMIT 10;

-- Ver page views
SELECT * FROM page_views ORDER BY created_at DESC LIMIT 10;

-- Ver funil de conversão
SELECT * FROM conversion_funnel;

-- Ver fontes de tráfego
SELECT * FROM traffic_sources;

-- Ver eventos customizados
SELECT * FROM custom_events ORDER BY created_at DESC LIMIT 20;
```

### 3. Testar com Parâmetros UTM

Acesse o site com parâmetros UTM para testar tracking de campanha:

```
http://localhost:5173/?utm_source=facebook&utm_medium=cpc&utm_campaign=lancamento
```

No dashboard, você verá a fonte "facebook" / "cpc" / "lancamento" na tabela de fontes de tráfego.

## Métricas Importantes Para o Marketing

### Taxa de Abandono
Se muitos visitantes não iniciam o vídeo, considere:
- Melhorar o headline
- Adicionar uma thumbnail mais atrativa
- Reduzir tempo de carregamento

### Taxa de Conversão do Vídeo → Formulário
Se muitos assistem mas não preenchem:
- Ajustar o momento de aparecer o CTA
- Melhorar o copy do botão
- Simplificar o formulário

### Análise por Fonte
Compare a performance de diferentes fontes:
- Qual traz mais visitantes?
- Qual tem melhor taxa de conversão?
- Qual traz leads com maior faturamento?

## Privacidade e LGPD

O sistema armazena apenas:
- Session ID anônimo (gerado no browser)
- Informações técnicas do dispositivo
- Comportamento de navegação

**Não coleta**:
- Endereço IP real
- Dados pessoais antes do preenchimento do formulário
- Cookies de terceiros

Para compliance completa com LGPD:
1. Adicione um banner de cookies
2. Obtenha consentimento antes de rastrear
3. Permita que usuários solicitem exclusão dos dados

## Próximos Passos

### Melhorias Sugeridas:
1. **Heatmaps**: Adicionar tracking de onde os usuários clicam
2. **Session Replay**: Gravar sessões dos usuários (considerar privacidade)
3. **A/B Testing**: Testar diferentes versões da página
4. **Email Triggers**: Enviar emails automáticos baseados no comportamento
5. **Retargeting**: Integrar com Facebook Pixel para remarketing

### Integrações Externas:
- Google Analytics 4
- Facebook Pixel (já configurado no HTML)
- Google Tag Manager
- HubSpot / RD Station

## Suporte

Se tiver problemas:

1. **Verifique o Console**: Abra DevTools (F12) e veja se há erros
2. **Verifique o Supabase**: Confirme que as tabelas existem
3. **Teste as Queries**: Execute as queries SQL manualmente
4. **SessionStorage**: Verifique se o session_id está sendo criado

Para limpar os dados de teste:

```sql
-- CUIDADO: Isto apaga todos os dados!
TRUNCATE sessions CASCADE;
TRUNCATE page_views CASCADE;
TRUNCATE custom_events CASCADE;
```

## Conclusão

O sistema completo de tracking está pronto! Agora você tem visibilidade total sobre:
- ✅ Quantas pessoas visitam o site
- ✅ Como se comportam na página
- ✅ De onde vêm
- ✅ Qual é o funil de conversão completo
- ✅ Quais campanhas performam melhor

Use essas informações para otimizar sua landing page e aumentar conversões! 🚀

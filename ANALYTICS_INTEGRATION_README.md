# 📊 Integração Google Analytics + Facebook Pixel - Landing Page Dnotas

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Google Analytics](#google-analytics)
3. [Facebook Pixel](#facebook-pixel)
4. [Dashboard Integrado](#dashboard-integrado)
5. [Checklist Completo](#checklist-completo)
6. [Suporte e Troubleshooting](#suporte-e-troubleshooting)

---

## 🎯 Visão Geral

Este documento reúne todas as informações necessárias para configurar e usar as integrações de analytics na landing page Dnotas.

### O que foi implementado:

- ✅ **Google Analytics 4 (GA4)** - Rastreamento no frontend + API integrada ao dashboard
- ✅ **Facebook Pixel** - Pronto para configurar (aguardando credenciais do time de marketing)
- ✅ **Dashboard Unificado** - Exibe dados do GA, Facebook e Supabase em um único lugar
- ✅ **Supabase Tracking** - Sistema próprio de rastreamento de leads e conversões

### URLs do Projeto:

- **Landing Page:** https://marketing.dnotas.com.br
- **Dashboard:** https://marketing.dnotas.com.br/dashboard
- **Repositório:** https://github.com/UiWill/marketing-notas

---

## 📊 Google Analytics

### Status: ✅ CONFIGURADO

O Google Analytics está **ativo e funcionando** no frontend. Para integração completa no dashboard, siga os passos abaixo.

### Configuração Atual:

- **Measurement ID:** `G-4ZH7JJL2YK`
- **Property ID:** *(Pendente - ver guia de configuração)*
- **Domínio:** marketing.dnotas.com.br

### O que o Google Analytics rastreia:

**No Frontend (já funcionando):**
- ✅ Visualizações de página
- ✅ Eventos personalizados
- ✅ Sessões de usuários
- ✅ Origem do tráfego

**No Dashboard (após configuração da API):**
- 📊 Usuários ativos em tempo real
- 📊 Sessões e visualizações por período
- 📊 Taxa de rejeição
- 📊 Duração média da sessão
- 📊 Top 10 fontes de tráfego
- 📊 Páginas mais visitadas
- 📊 Dispositivos (mobile vs desktop)
- 📊 Localização geográfica
- 📊 Gráficos e métricas avançadas

### Guias de Configuração:

1. **[GOOGLE_ANALYTICS_API_SETUP.md](./GOOGLE_ANALYTICS_API_SETUP.md)**
   - Como criar Service Account no Google Cloud
   - Como habilitar a Google Analytics Data API
   - Como obter credenciais (arquivo JSON)
   - Como adicionar permissões no GA

2. **[SUPABASE_ENV_SETUP.md](./SUPABASE_ENV_SETUP.md)**
   - Como configurar as credenciais no Supabase
   - Como fazer deploy da Edge Function
   - Como testar a integração

### Passos Resumidos:

1. **Configurar API** ➜ Seguir `GOOGLE_ANALYTICS_API_SETUP.md`
2. **Obter credenciais** ➜ Baixar arquivo JSON
3. **Configurar Supabase** ➜ Seguir `SUPABASE_ENV_SETUP.md`
4. **Deploy Edge Function** ➜ `supabase functions deploy google-analytics`
5. **Testar** ➜ Acessar dashboard e verificar dados

---

## 📘 Facebook Pixel

### Status: ⏳ AGUARDANDO CONFIGURAÇÃO

O código está pronto, aguardando apenas o **Pixel ID** do time de marketing.

### Guia de Configuração:

**[FACEBOOK_PIXEL_SETUP.md](./FACEBOOK_PIXEL_SETUP.md)**
- Como criar conta Business Manager
- Como criar o Pixel
- Como obter o Pixel ID

### Como configurar após receber o ID:

**1. O time de marketing envia:**
```
Facebook Pixel ID: 123456789012345
```

**2. Equipe de TI atualiza o código:**

Editar arquivo `index.html` (linhas 29-43):
```html
<!-- Remover os comentários e substituir YOUR_PIXEL_ID -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '123456789012345'); // ← COLOCAR O ID AQUI
  fbq('track', 'PageView');
</script>
```

**3. Fazer build e deploy:**
```bash
npm run build
npm run deploy
```

### Eventos que serão rastreados:

- `PageView` - Visualização da landing page
- `ViewContent` - Assistiu parte do vídeo
- `InitiateCheckout` - Começou a preencher formulário
- `Lead` - Enviou o formulário
- `CompleteRegistration` - Lead qualificado

---

## 🖥️ Dashboard Integrado

### Acesso:
```
https://marketing.dnotas.com.br/dashboard
```

### O que o Dashboard exibe:

#### 🟢 Seção Google Analytics (em tempo real)
- Usuários ativos agora
- Sessões (últimos 7 dias)
- Usuários únicos
- Taxa de rejeição
- Duração média da sessão
- Top 10 fontes de tráfego
- Páginas mais visitadas
- Distribuição por dispositivos
- Top 10 localizações geográficas

#### 🔵 Seção Conversão (Supabase)
- Visitantes únicos (tracking interno)
- Taxa de visualização do vídeo
- Taxa de clique no CTA
- Taxa de conversão do formulário
- Total de leads capturados
- Potencial de receita
- Conclusão média do vídeo
- Funil de conversão completo
- Leads por fonte (UTM)
- Segmentos de faturamento

#### 📋 Tabela de Leads
- Nome, email, telefone
- Faturamento mensal
- Progresso do vídeo
- Status (lead → qualificado → convertido)
- Data de cadastro
- Parâmetros UTM

### Arquitetura do Dashboard:

```
Frontend (React)
    ↓
Hooks (useGoogleAnalytics)
    ↓
Supabase Edge Function
    ↓
Google Analytics Data API
    ↓
Retorna dados formatados
```

---

## ✅ Checklist Completo

### Google Analytics - Frontend (✅ CONCLUÍDO)
- [x] Measurement ID configurado
- [x] Script adicionado no index.html
- [x] Deploy realizado
- [x] Rastreamento ativo

### Google Analytics - API (⏳ AGUARDANDO CONFIGURAÇÃO)
- [ ] Criar projeto no Google Cloud Console
- [ ] Habilitar Google Analytics Data API
- [ ] Criar Service Account
- [ ] Baixar arquivo JSON de credenciais
- [ ] Adicionar email da Service Account no GA
- [ ] Obter Property ID
- [ ] Configurar variáveis no Supabase
- [ ] Deploy da Edge Function
- [ ] Testar integração no dashboard

### Facebook Pixel (⏳ AGUARDANDO PIXEL ID)
- [ ] Time de marketing criar Business Manager
- [ ] Time de marketing criar Pixel
- [ ] Time de marketing enviar Pixel ID
- [ ] Equipe de TI configurar no código
- [ ] Deploy realizado
- [ ] Testar eventos no Gerenciador de Eventos

### Dashboard (✅ CONCLUÍDO)
- [x] Componente GoogleAnalyticsSection criado
- [x] Hooks de integração criados
- [x] Interface integrada
- [x] Cards e gráficos implementados
- [x] Separação visual entre seções

### Infraestrutura (✅ CONCLUÍDO)
- [x] Domínio customizado configurado (marketing.dnotas.com.br)
- [x] HTTPS ativo
- [x] DNS propagado
- [x] GitHub Pages configurado
- [x] Supabase configurado

---

## 🔧 Suporte e Troubleshooting

### Google Analytics não aparece no dashboard

**Possíveis causas:**
1. Edge Function não foi deployed
2. Credenciais não configuradas corretamente no Supabase
3. Service Account sem permissão no GA
4. Property ID incorreto

**Soluções:**
- Verificar logs da Edge Function no Supabase
- Revalidar credenciais (JSON completo)
- Conferir permissões no Google Analytics
- Usar Property ID correto (9 dígitos, não Measurement ID)

### Facebook Pixel não rastreia eventos

**Possíveis causas:**
1. Pixel ID não configurado
2. Código comentado no HTML
3. AdBlocker ativo
4. Demora na propagação do Pixel

**Soluções:**
- Verificar se o código está descomentado
- Testar em navegador privado sem extensões
- Aguardar 10-15 minutos após ativação
- Usar Facebook Pixel Helper (extensão Chrome)

### Dashboard carrega lento

**Possíveis causas:**
1. Muitas requisições simultâneas ao GA
2. Timeout nas Edge Functions
3. Muitos dados sendo processados

**Soluções:**
- Implementar cache nas Edge Functions
- Reduzir intervalo de atualização automática
- Limitar quantidade de dados retornados

---

## 📚 Documentação Adicional

### Arquivos de Guia:
- `GOOGLE_ANALYTICS_API_SETUP.md` - Setup completo da API do GA
- `SUPABASE_ENV_SETUP.md` - Configuração do Supabase
- `FACEBOOK_PIXEL_SETUP.md` - Configuração do Facebook Pixel
- `CLAUDE.md` - Documentação do projeto

### Código Relevante:
- `index.html` - Scripts de tracking (GA + Facebook)
- `src/hooks/useGoogleAnalytics.ts` - Hooks React para GA
- `src/components/GoogleAnalyticsSection.tsx` - Componente do dashboard
- `supabase/functions/google-analytics/index.ts` - Edge Function

### APIs Utilizadas:
- Google Analytics Data API v1beta
- Facebook Graph API (Pixel)
- Supabase Edge Functions
- Supabase Database

---

## 🎯 Próximos Passos

### Para o Time de Marketing:
1. ✅ Enviar arquivo JSON do Google Analytics (GOOGLE_ANALYTICS_API_SETUP.md)
2. ⏳ Enviar Facebook Pixel ID (FACEBOOK_PIXEL_SETUP.md)

### Para Equipe de TI:
1. ⏳ Aguardar credenciais do Google Analytics
2. ⏳ Configurar variáveis no Supabase
3. ⏳ Deploy da Edge Function
4. ⏳ Testar integração
5. ⏳ Configurar Facebook Pixel quando receber ID

### Melhorias Futuras (Opcional):
- [ ] Implementar cache para reduzir chamadas à API
- [ ] Adicionar gráficos interativos (Chart.js ou Recharts)
- [ ] Exportação de relatórios em PDF
- [ ] Notificações por email de novos leads
- [ ] Integração com CRM
- [ ] A/B testing automatizado

---

## 📞 Contato

**Dúvidas sobre configuração:**
- Equipe de TI

**Dúvidas sobre métricas:**
- Time de Marketing

**Suporte técnico:**
- Documentação: https://docs.google.com/analytics/
- Supabase: https://supabase.com/docs

---

**Última atualização:** 06/11/2025

**Versão do projeto:** 1.0.0

🚀 **Status:** Pronto para configuração final do Google Analytics API e Facebook Pixel

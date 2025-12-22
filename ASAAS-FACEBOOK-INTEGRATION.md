# Integração Asaas + Facebook Conversions API

## Visão Geral

Esta integração conecta os webhooks do Asaas com o Facebook Conversions API para rastrear eventos de pagamento (compra, cancelamento, estorno) diretamente no servidor. Isso permite:

1. **Otimização de campanhas**: Facebook recebe dados de conversão em tempo real
2. **Atribuição precisa**: Eventos são vinculados aos usuários que clicaram nos anúncios
3. **Deduplicação**: Event IDs únicos evitam contagem duplicada
4. **Privacidade**: Dados sensíveis (PII) são hasheados antes do envio

---

## Eventos Rastreados

### 1. Purchase (Compra Confirmada)
- **Quando**: Pagamento aprovado pelo Asaas
- **Webhooks Asaas**: `PAYMENT_RECEIVED`, `PAYMENT_CONFIRMED`
- **Dados enviados**:
  - Valor: R$ 525,00
  - Moeda: BRL
  - Email, telefone, nome (hasheados)
  - Event ID: `purchase_{payment_id}`

### 2. PaymentOverdue (Pagamento Vencido)
- **Quando**: Cobrança não paga até a data de vencimento
- **Webhook Asaas**: `PAYMENT_OVERDUE`
- **Uso**: Criar públicos de remarketing para recuperação

### 3. PaymentRefunded (Pagamento Estornado)
- **Quando**: Pagamento foi estornado
- **Webhook Asaas**: `PAYMENT_REFUNDED`
- **Uso**: Excluir usuários de públicos de compradores

---

## Configuração

### Passo 1: Obter Access Token do Facebook

1. Acesse o [Facebook Business Manager](https://business.facebook.com/)
2. Vá em **Configurações de Negócio** > **Origens de Dados** > **Pixels**
3. Selecione seu Pixel (ID: `1279949890819385`)
4. Clique em **Configurações** > **API de Conversões**
5. Clique em **Gerar Token de Acesso**
6. **IMPORTANTE**: Copie o token e guarde em local seguro

**Escopos necessários**: `ads_management`, `business_management`

**Exemplo de token**: `EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### Passo 2: Configurar no Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Project Settings** > **Edge Functions** > **Secrets**
3. Adicione a variável de ambiente:

```
Nome: FACEBOOK_ACCESS_TOKEN
Valor: [cole o token copiado no Passo 1]
```

4. Clique em **Save**

---

### Passo 3: Deploy da Edge Function Atualizada

Execute no terminal:

```bash
npx supabase functions deploy asaas-webhook
```

**Output esperado**:
```
Deploying asaas-webhook (project ref: [seu-project-ref])
✓ Deployed Function asaas-webhook
```

---

### Passo 4: Configurar Webhook no Asaas

1. Acesse o [Painel do Asaas](https://www.asaas.com/)
2. Vá em **Configurações** > **Integrações** > **Webhooks**
3. Clique em **Adicionar webhook**
4. Configure:

**URL do Webhook**:
```
https://[seu-project-ref].supabase.co/functions/v1/asaas-webhook
```

**Eventos a serem notificados** (marque todos):
- ✅ Cobrança recebida (`PAYMENT_RECEIVED`)
- ✅ Cobrança confirmada (`PAYMENT_CONFIRMED`)
- ✅ Cobrança vencida (`PAYMENT_OVERDUE`)
- ✅ Cobrança estornada (`PAYMENT_REFUNDED`)

**Formato**: JSON

5. Clique em **Salvar**

---

## Como Funciona

### Fluxo de Dados

```
Cliente paga → Asaas processa → Webhook dispara → Supabase Function →
→ Atualiza lead no banco → Envia evento ao Facebook → Facebook otimiza anúncios
```

### Deduplicação de Eventos

O Facebook pode receber o mesmo evento de duas fontes:
1. **Browser** (Pixel JavaScript na página)
2. **Servidor** (Conversions API via webhook)

Para evitar contagem duplicada, usamos **Event IDs únicos**:
- Purchase: `purchase_{payment_id}`
- Overdue: `overdue_{payment_id}`
- Refund: `refund_{payment_id}`

Se o Facebook receber eventos com mesmo `event_id` e `event_name` em 48h, conta apenas 1.

### Privacidade (Hash de PII)

Dados pessoais são hasheados com SHA-256 antes do envio:
```typescript
email: "joao@exemplo.com" → "a1b2c3..." (hash SHA-256)
phone: "11999999999" → "d4e5f6..." (hash SHA-256)
name: "João Silva" → fn: "x7y8z9...", ln: "i1j2k3..." (hash)
```

O Facebook usa esses hashes para vincular eventos aos usuários corretos sem expor dados sensíveis.

---

## Validação

### 1. Testar no Supabase

Após deploy, acesse:
**Project > Edge Functions > asaas-webhook > Logs**

Execute um pagamento de teste e verifique os logs:
```
✅ PAGAMENTO CONFIRMADO! Lead: João Silva
✅ Evento Purchase enviado ao Facebook com sucesso
```

### 2. Verificar no Facebook Events Manager

1. Acesse [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Selecione seu Pixel (1279949890819385)
3. Vá em **Teste de Eventos**
4. Execute um pagamento de teste
5. Em até 20 minutos, o evento deve aparecer com:
   - ✅ **Event Source**: Server (Conversions API)
   - ✅ **Event Name**: Purchase
   - ✅ **Value**: 525.00 BRL
   - ✅ **Match Quality**: High (7-10 parâmetros matched)

---

## Uso no Facebook Ads

### Otimizar Campanhas para Compras

1. Acesse **Gerenciador de Anúncios**
2. Crie uma campanha com objetivo **Conversões**
3. Em **Conjunto de Anúncios**:
   - Evento de conversão: **Purchase**
   - Otimizar para: **Valor de conversão**
4. O Facebook agora otimizará para pessoas que completam pagamentos

### Criar Públicos Avançados

**Públicos de Compradores** (para exclusão):
```
Pixel Events > Purchase > Últimos 180 dias
```

**Públicos de Carrinhos Abandonados** (remarketing):
```
Pixel Events > InitiateCheckout
EXCLUIR: Purchase (últimos 30 dias)
```

**Públicos de Pagamentos Vencidos** (recuperação):
```
Pixel Events > PaymentOverdue > Últimos 7 dias
EXCLUIR: Purchase (últimos 7 dias)
```

**Públicos de Estornos** (excluir de todos):
```
Pixel Events > PaymentRefunded > Últimos 90 dias
```

---

## Troubleshooting

### Eventos não aparecem no Facebook

**1. Verificar Access Token**
```bash
# Testar token manualmente
curl -X GET "https://graph.facebook.com/v18.0/me?access_token=SEU_TOKEN"
```

Resposta esperada: `{ "name": "Seu Nome", "id": "..." }`

**2. Verificar logs do Supabase**
- Acesse Edge Functions > asaas-webhook > Logs
- Procure por erros como:
  - `FACEBOOK_ACCESS_TOKEN não configurado`
  - `Erro ao enviar evento para Facebook`

**3. Verificar Match Quality**
- No Events Manager, clique no evento
- Verifique **Match Quality Score**
- Se baixo (<4), adicione mais dados:
  - IP do cliente
  - User Agent
  - FBC/FBP cookies

### Eventos duplicados

Se você vê 2x o mesmo evento:
- Certifique-se de usar o mesmo `event_id` no browser e servidor
- Use `fbq('track', 'Purchase', {}, { eventID: 'purchase_123' })` no browser

### Token expirado

Tokens de usuário expiram em 60 dias. Para token permanente:
1. Use **System User Token** do Business Manager
2. Gere um token de **never expires**

---

## Monitoramento

### KPIs a acompanhar

1. **Match Rate**: % de eventos com Match Quality > 6
   - Meta: >80%
   - Como melhorar: Enviar mais parâmetros (IP, UA, FBC/FBP)

2. **Event Deduplication Rate**: % de eventos deduplicados
   - Meta: 20-40% (indica que browser + server estão funcionando)
   - Como verificar: Events Manager > Diagnostics

3. **Server vs Browser Events**: Proporção de eventos de cada fonte
   - Ideal: 70% Server, 30% Browser
   - Server é mais confiável (não bloqueado por ad blockers)

---

## Custos

- **Facebook Conversions API**: Gratuita
- **Supabase Edge Functions**:
  - 500K invocações/mês grátis
  - Depois: $2 por 1M de invocações
  - Estimativa para 1000 vendas/mês: $0 (dentro do free tier)

---

## Segurança

### Dados Sensíveis
- ✅ Todos os PIIs são hasheados (SHA-256)
- ✅ Access Token armazenado como secret no Supabase
- ✅ Webhook Asaas usa HTTPS

### Boas Práticas
1. **Nunca** commite o Access Token no código
2. Use **System User Tokens** para produção (não expiram)
3. Rotacione tokens a cada 90 dias
4. Configure **IP Whitelist** no Asaas (opcional)

---

## Referências

- [Facebook Conversions API Docs](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Asaas Webhooks Docs](https://docs.asaas.com/reference/webhooks)
- [Event Deduplication](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events)
- [Advanced Matching](https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching)

---

## Suporte

Se precisar de ajuda:
1. Verifique os logs no Supabase
2. Teste eventos no Facebook Test Events Tool
3. Consulte a documentação oficial do Facebook

**Status da Integração**: ✅ Implementada e pronta para uso
**Última Atualização**: 2025-12-17

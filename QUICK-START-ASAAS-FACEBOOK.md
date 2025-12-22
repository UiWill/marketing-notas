# Quick Start: Asaas + Facebook

## Checklist de Configuração Rápida

### 1. Obter Token do Facebook (5 minutos)

1. Acesse: https://business.facebook.com/settings/pixels
2. Selecione seu Pixel: **1279949890819385**
3. Vá em **API de Conversões** > **Gerar Token de Acesso**
4. Copie o token (começa com `EAA...`)

### 2. Configurar no Supabase (2 minutos)

1. Acesse: https://app.supabase.com
2. Vá em **Project Settings** > **Edge Functions** > **Secrets**
3. Adicione:
   ```
   Nome: FACEBOOK_ACCESS_TOKEN
   Valor: [cole o token]
   ```

### 3. Deploy da Function (1 minuto)

```bash
npx supabase functions deploy asaas-webhook
```

### 4. Configurar Webhook no Asaas (3 minutos)

1. Acesse: https://www.asaas.com/
2. Vá em **Configurações** > **Integrações** > **Webhooks**
3. URL: `https://[seu-project].supabase.co/functions/v1/asaas-webhook`
4. Marque eventos:
   - ✅ PAYMENT_RECEIVED
   - ✅ PAYMENT_CONFIRMED
   - ✅ PAYMENT_OVERDUE
   - ✅ PAYMENT_REFUNDED

### 5. Testar (5 minutos)

1. Execute um pagamento de teste
2. Verifique logs no Supabase: **Edge Functions > asaas-webhook > Logs**
3. Procure por: `✅ Evento Purchase enviado ao Facebook com sucesso`
4. Verifique no Facebook: https://business.facebook.com/events_manager2

---

## Eventos que Serão Rastreados

| Evento | Quando Dispara | Uso no Facebook |
|--------|----------------|-----------------|
| **Purchase** | Pagamento aprovado | Otimizar campanhas para vendas |
| **PaymentOverdue** | Cobrança vencida | Remarketing para recuperação |
| **PaymentRefunded** | Pagamento estornado | Excluir de públicos de compradores |

---

## Teste Rápido

Execute este comando para testar o token do Facebook:

```bash
curl -X GET "https://graph.facebook.com/v18.0/1279949890819385?access_token=SEU_TOKEN_AQUI&fields=name"
```

Resposta esperada:
```json
{
  "name": "Dnotas Pixel",
  "id": "1279949890819385"
}
```

---

## Troubleshooting Rápido

**Problema**: Eventos não aparecem no Facebook
- ✅ Verificar se `FACEBOOK_ACCESS_TOKEN` está configurado no Supabase
- ✅ Verificar logs da function para erros
- ✅ Aguardar até 20 minutos (delay de processamento do Facebook)

**Problema**: Token inválido
- ✅ Gerar novo token no Business Manager
- ✅ Atualizar secret no Supabase
- ✅ Re-deployar function

**Problema**: Webhook não dispara
- ✅ Verificar URL do webhook no Asaas
- ✅ Verificar se eventos estão marcados
- ✅ Testar com pagamento real (não simulado)

---

## Próximos Passos

Após configuração, você poderá:

1. **Otimizar Campanhas**
   - Usar evento Purchase como conversão
   - Facebook aprende quem compra

2. **Criar Públicos**
   - Compradores (para exclusão)
   - Pagamentos vencidos (para remarketing)
   - Estornos (para análise)

3. **Melhorar Match Quality**
   - Adicionar IP do cliente
   - Adicionar User Agent
   - Adicionar FBC/FBP cookies

---

Documentação completa: `ASAAS-FACEBOOK-INTEGRATION.md`

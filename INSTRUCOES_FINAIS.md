# Instruções Finais - Sistema de Pagamento Asaas

## ✅ O que já foi feito:

1. ✅ Vídeo atualizado para YouTube (https://youtu.be/vmmBD2Rxb9M)
2. ✅ Página sempre liberada (sem bloqueio de 11 minutos)
3. ✅ Botão CTA abaixo do vídeo
4. ✅ Modal de captura de leads
5. ✅ Página de checkout com Asaas (PIX, Boleto, Cartão)
6. ✅ Página de agradecimento
7. ✅ Edge Functions do Supabase criadas
8. ✅ Migration SQL criada

## 🚀 Próximos Passos (VOCÊ DEVE EXECUTAR):

### 1. Executar Migration no Banco de Dados

Acesse o Supabase Dashboard em: https://app.supabase.com/project/xtxuoqcunnlccnujbbhk/editor

1. Vá em "SQL Editor"
2. Clique em "New Query"
3. Copie e cole o conteúdo do arquivo `supabase-payment-migration.sql`
4. Execute o SQL
5. Verifique se os campos foram adicionados na tabela `leads`

### 2. Fazer Deploy das Edge Functions

Você precisa fazer o deploy de 3 funções:

```bash
# 1. Login no Supabase CLI (se ainda não estiver logado)
npx supabase login

# 2. Link do projeto
npx supabase link --project-ref xtxuoqcunnlccnujbbhk

# 3. Deploy das funções
npx supabase functions deploy asaas-payment
npx supabase functions deploy asaas-get-payment
npx supabase functions deploy asaas-webhook
```

### 3. Configurar Webhook no Asaas

1. Acesse o painel do Asaas: https://www.asaas.com
2. Vá em Configurações > Webhooks
3. Adicione uma nova URL de webhook:
   ```
   https://xtxuoqcunnlccnujbbhk.supabase.co/functions/v1/asaas-webhook
   ```
4. Marque os eventos:
   - PAYMENT_RECEIVED
   - PAYMENT_CONFIRMED
   - PAYMENT_OVERDUE
   - PAYMENT_REFUNDED

### 4. Testar o Sistema

```bash
# Rodar em dev para testar
npm run dev
```

Fluxo de teste:
1. Acesse a landing page
2. Clique no botão "CLIQUE AQUI E RECEBA NOSSOS SERVIÇOS EXCLUSIVOS"
3. Preencha o formulário no modal
4. Será redirecionado para o checkout
5. Escolha a forma de pagamento e preencha os dados
6. Confirme o pagamento
7. Será redirecionado para a página de agradecimento

### 5. Verificar Logs

Para ver os logs das Edge Functions:
```bash
npx supabase functions logs asaas-payment
npx supabase functions logs asaas-webhook
```

## 📋 Checklist Final

- [ ] Migration executada no banco de dados
- [ ] Edge Functions deployadas
- [ ] Webhook configurado no Asaas
- [ ] Teste de pagamento com PIX realizado
- [ ] Teste de pagamento com Cartão realizado
- [ ] Teste de pagamento com Boleto realizado
- [ ] Webhook funcionando (verificar logs)
- [ ] Página de agradecimento exibindo corretamente

## 🔑 Informações Importantes

### Token Asaas (já configurado no código):
```
$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjhlMDdlOTZlLTBiOTUtNGFkYS1hNmI4LWNlODFkYzQzNDI0Mjo6JGFhY2hfY2Y2Mjc2MjItZjg4OC00MmZjLThlNmItMWRlMGZkMjAzNmI1
```

### Valores:
- Taxa de adesão: R$ 575,00
- Mensalidade: R$ 375,00

### URLs:
- Landing: https://seu-dominio.com/
- Checkout: https://seu-dominio.com/#/checkout?leadId=xxx
- Obrigado: https://seu-dominio.com/#/obrigado?paymentId=xxx&method=PIX

## ⚠️ Observações

1. O token do Asaas está em **PRODUÇÃO**. Cuidado ao testar!
2. Para testes, recomendo criar uma conta de sandbox no Asaas
3. Os webhooks podem demorar alguns segundos para chegar
4. Verifique os logs do Supabase em caso de erros
5. Certifique-se de que as RLS policies estão desabilitadas ou configuradas corretamente

## 🐛 Troubleshooting

### Edge Function retorna erro 404:
- Verifique se o deploy foi feito corretamente
- Confirme que está usando a URL correta do Supabase

### Webhook não está funcionando:
- Verifique a URL configurada no Asaas
- Veja os logs: `npx supabase functions logs asaas-webhook`
- Teste manualmente enviando um POST para a URL do webhook

### Pagamento não atualiza no banco:
- Verifique os logs da Edge Function
- Confirme que o payment_id está sendo salvo corretamente
- Verifique se a migration foi executada

## 📞 Contato

Em caso de dúvidas, consulte a documentação:
- Asaas: https://docs.asaas.com
- Supabase Edge Functions: https://supabase.com/docs/guides/functions

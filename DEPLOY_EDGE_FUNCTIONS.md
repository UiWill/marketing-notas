# Como Fazer Deploy das Edge Functions

## Passo 1: Login no Supabase

Execute este comando e siga as instruções no navegador:

```bash
npx supabase login
```

Isso vai abrir o navegador para você fazer login na sua conta Supabase.

## Passo 2: Link do Projeto

Depois de fazer login, execute:

```bash
npx supabase link --project-ref xtxuoqcunnlccnujbbhk
```

Quando perguntar a senha do banco de dados, você pode encontrá-la em:
- Supabase Dashboard > Settings > Database > Database password

## Passo 3: Deploy das Funções

Execute estes 3 comandos, um por vez:

```bash
npx supabase functions deploy asaas-payment
npx supabase functions deploy asaas-get-payment
npx supabase functions deploy asaas-webhook
```

## Passo 4: Configurar Secrets (Variáveis de Ambiente)

As Edge Functions precisam de acesso às variáveis de ambiente. Execute:

```bash
npx supabase secrets set SUPABASE_URL=https://xtxuoqcunnlccnujbbhk.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY_AQUI
```

Para encontrar a `SERVICE_ROLE_KEY`:
1. Acesse: https://app.supabase.com/project/xtxuoqcunnlccnujbbhk/settings/api
2. Copie a chave "service_role" (não a "anon" key!)

## Verificar Deploy

Após o deploy, você pode testar se as funções estão funcionando:

```bash
# Ver logs da função
npx supabase functions logs asaas-payment

# Testar localmente antes do deploy
npx supabase functions serve
```

## URLs das Funções (após deploy)

- **Processar Pagamento**: `https://xtxuoqcunnlccnujbbhk.supabase.co/functions/v1/asaas-payment`
- **Buscar Pagamento**: `https://xtxuoqcunnlccnujbbhk.supabase.co/functions/v1/asaas-get-payment/{id}`
- **Webhook**: `https://xtxuoqcunnlccnujbbhk.supabase.co/functions/v1/asaas-webhook`

## Configurar Webhook no Asaas

Depois do deploy, configure o webhook no painel do Asaas:

1. Acesse: https://www.asaas.com
2. Vá em **Configurações > Webhooks**
3. Adicione a URL: `https://xtxuoqcunnlccnujbbhk.supabase.co/functions/v1/asaas-webhook`
4. Selecione os eventos:
   - ✅ PAYMENT_RECEIVED
   - ✅ PAYMENT_CONFIRMED
   - ✅ PAYMENT_OVERDUE
   - ✅ PAYMENT_REFUNDED

## Troubleshooting

### Erro de autenticação:
```bash
npx supabase logout
npx supabase login
```

### Função não aparece no dashboard:
- Verifique se o deploy foi bem-sucedido
- Aguarde 1-2 minutos para a função aparecer
- Recarregue a página do dashboard

### Erro 404 ao chamar a função:
- Confirme que usou `npx supabase functions deploy nome-da-funcao`
- Verifique a URL completa incluindo `/functions/v1/`
- Veja os logs: `npx supabase functions logs nome-da-funcao`

### Erro de CORS:
- As funções já têm headers CORS configurados
- Se mesmo assim der erro, verifique se está enviando o header `Authorization`

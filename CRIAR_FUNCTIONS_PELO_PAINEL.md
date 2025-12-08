# Como Criar Edge Functions pelo Painel do Supabase

## Passo a Passo

1. **Acesse o Dashboard do Supabase**
   - URL: https://app.supabase.com/project/xtxuoqcunnlccnujbbhk/functions

2. **Clique em "Create a new function"**

3. **Crie as 3 funções abaixo:**

---

## FUNÇÃO 1: asaas-payment

**Nome da função:** `asaas-payment`

**Código (copie e cole):**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ASAAS_API_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjhlMDdlOTZlLTBiOTUtNGFkYS1hNmI4LWNlODFkYzQzNDI0Mjo6JGFhY2hfY2Y2Mjc2MjItZjg4OC00MmZjLThlNmItMWRlMGZkMjAzNmI1'
const ASAAS_BASE_URL = 'https://api.asaas.com/v3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function asaasRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${ASAAS_BASE_URL}${endpoint}`
  const headers = {
    'access_token': ASAAS_API_KEY,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.description || data.message || 'Erro na requisição ao Asaas')
  }

  return data
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customer, billingType, value, dueDate, creditCard, creditCardHolderInfo, leadId } = await req.json()

    // 1. Criar ou buscar cliente no Asaas
    let asaasCustomer
    try {
      const existingCustomers = await asaasRequest(`/customers?cpfCnpj=${customer.cpfCnpj}`)
      if (existingCustomers.data && existingCustomers.data.length > 0) {
        asaasCustomer = existingCustomers.data[0]
      } else {
        asaasCustomer = await asaasRequest('/customers', {
          method: 'POST',
          body: JSON.stringify(customer)
        })
      }
    } catch (err) {
      asaasCustomer = await asaasRequest('/customers', {
        method: 'POST',
        body: JSON.stringify(customer)
      })
    }

    // 2. Criar cobrança
    const paymentData: any = {
      customer: asaasCustomer.id,
      billingType,
      value,
      dueDate,
      description: 'Dnotas - Pacote Completo de Regularização (Taxa de Adesão)',
      externalReference: leadId
    }

    if (billingType === 'CREDIT_CARD' && creditCard && creditCardHolderInfo) {
      paymentData.creditCard = creditCard
      paymentData.creditCardHolderInfo = creditCardHolderInfo
    }

    const payment = await asaasRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    })

    // 3. Se for PIX, buscar QR Code
    let pixQrCode = null
    if (billingType === 'PIX') {
      const pixData = await asaasRequest(`/payments/${payment.id}/pixQrCode`)
      pixQrCode = pixData.encodedImage
    }

    // 4. Atualizar lead no banco de dados
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabaseClient
      .from('leads')
      .update({
        payment_status: payment.status,
        payment_id: payment.id,
        payment_method: billingType,
        asaas_customer_id: asaasCustomer.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)

    return new Response(
      JSON.stringify({
        success: true,
        id: payment.id,
        status: payment.status,
        invoiceUrl: payment.invoiceUrl,
        bankSlipUrl: payment.bankSlipUrl,
        pixQrCode: pixQrCode,
        payment: payment
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erro ao processar pagamento'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
```

---

## FUNÇÃO 2: asaas-get-payment

**Nome da função:** `asaas-get-payment`

**Código (copie e cole):**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ASAAS_API_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjhlMDdlOTZlLTBiOTUtNGFkYS1hNmI4LWNlODFkYzQzNDI0Mjo6JGFhY2hfY2Y2Mjc2MjItZjg4OC00MmZjLThlNmItMWRlMGZkMjAzNmI1'
const ASAAS_BASE_URL = 'https://api.asaas.com/v3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function asaasRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${ASAAS_BASE_URL}${endpoint}`
  const headers = {
    'access_token': ASAAS_API_KEY,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.description || data.message || 'Erro na requisição ao Asaas')
  }

  return data
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const paymentId = url.pathname.split('/').pop()

    if (!paymentId) {
      throw new Error('ID do pagamento não fornecido')
    }

    const payment = await asaasRequest(`/payments/${paymentId}`)

    let pixQrCode = null
    if (payment.billingType === 'PIX') {
      try {
        const pixData = await asaasRequest(`/payments/${paymentId}/pixQrCode`)
        pixQrCode = pixData.encodedImage
      } catch (err) {
        console.log('Erro ao buscar QR Code PIX:', err)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...payment,
        pixQrCode
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erro ao buscar pagamento'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
```

---

## FUNÇÃO 3: asaas-webhook

**Nome da função:** `asaas-webhook`

**Código (copie e cole):**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log('Webhook recebido:', payload)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { event, payment } = payload

    if (!payment || !payment.id) {
      throw new Error('Dados de pagamento inválidos')
    }

    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('payment_id', payment.id)
      .single()

    if (leadError || !lead) {
      console.error('Lead não encontrado para payment_id:', payment.id)
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    let updateData: any = {
      payment_status: payment.status,
      updated_at: new Date().toISOString()
    }

    switch (event) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED':
        updateData.payment_status = 'confirmed'
        updateData.conversion_stage = 'converted'
        updateData.converted_at = new Date().toISOString()
        break

      case 'PAYMENT_OVERDUE':
        updateData.payment_status = 'overdue'
        break

      case 'PAYMENT_REFUNDED':
        updateData.payment_status = 'refunded'
        break

      default:
        updateData.payment_status = payment.status.toLowerCase()
    }

    const { error: updateError } = await supabaseClient
      .from('leads')
      .update(updateData)
      .eq('id', lead.id)

    if (updateError) {
      console.error('Erro ao atualizar lead:', updateError)
      throw updateError
    }

    console.log(`Lead ${lead.id} atualizado com sucesso. Status: ${updateData.payment_status}`)

    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      console.log(`✅ PAGAMENTO CONFIRMADO! Lead: ${lead.name} (${lead.email})`)
    }

    return new Response(
      JSON.stringify({
        received: true,
        leadId: lead.id,
        event: event,
        status: updateData.payment_status
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return new Response(
      JSON.stringify({
        received: true,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }
})
```

---

## Depois de Criar as Funções

1. **Teste se estão funcionando** - Cada função terá uma URL no formato:
   - `https://xtxuoqcunnlccnujbbhk.supabase.co/functions/v1/nome-da-funcao`

2. **Configure o Webhook no Asaas:**
   - URL: `https://xtxuoqcunnlccnujbbhk.supabase.co/functions/v1/asaas-webhook`
   - Eventos: PAYMENT_RECEIVED, PAYMENT_CONFIRMED, PAYMENT_OVERDUE, PAYMENT_REFUNDED

3. **Teste a aplicação** rodando:
   ```bash
   npm run dev
   ```

## Observações Importantes

⚠️ **O token do Asaas já está no código** - É o token de produção que você forneceu
⚠️ **As variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY** são injetadas automaticamente pelo Supabase
⚠️ **Teste com valores pequenos primeiro** - Como está usando token de produção!

## Troubleshooting

Se as funções não funcionarem:
1. Verifique os logs na aba "Logs" de cada função
2. Teste chamando as URLs diretamente com Postman ou curl
3. Verifique se as permissões da tabela `leads` permitem UPDATE

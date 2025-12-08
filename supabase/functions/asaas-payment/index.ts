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
  // Handle CORS preflight requests
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

    // Adicionar dados do cartão se for pagamento por cartão
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

    // 5. Retornar resposta
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

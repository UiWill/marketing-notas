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
    const { customer, billingType, value, dueDate, creditCard, creditCardHolderInfo, leadId, companiesCount = 1, additionalCnpjs = [] } = await req.json()

    const valuePerCompany = 525.00 // Valor por empresa
    const payments: any[] = []
    const allPaymentIds: string[] = []

    // Função auxiliar para criar ou buscar cliente
    async function getOrCreateCustomer(customerData: any) {
      try {
        const existingCustomers = await asaasRequest(`/customers?cpfCnpj=${customerData.cpfCnpj}`)
        if (existingCustomers.data && existingCustomers.data.length > 0) {
          return existingCustomers.data[0]
        }
      } catch (err) {
        // Cliente não encontrado, criar novo
      }
      return await asaasRequest('/customers', {
        method: 'POST',
        body: JSON.stringify(customerData)
      })
    }

    // 1. Criar cobrança para a empresa principal (CNPJ do cliente)
    const mainCustomer = await getOrCreateCustomer(customer)

    const mainPaymentData: any = {
      customer: mainCustomer.id,
      billingType,
      value: valuePerCompany,
      dueDate,
      description: 'Dnotas - Taxa de Adesão (Empresa Principal)',
      externalReference: leadId
    }

    if (billingType === 'CREDIT_CARD' && creditCard && creditCardHolderInfo) {
      mainPaymentData.creditCard = creditCard
      mainPaymentData.creditCardHolderInfo = creditCardHolderInfo
    }

    const mainPayment = await asaasRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(mainPaymentData)
    })

    payments.push(mainPayment)
    allPaymentIds.push(mainPayment.id)

    // 2. Criar cobranças para empresas adicionais
    for (let i = 0; i < additionalCnpjs.length; i++) {
      const cnpj = additionalCnpjs[i]
      if (!cnpj || cnpj.trim() === '') continue

      // Criar cliente para o CNPJ adicional
      const additionalCustomerData = {
        name: `${customer.name} - Empresa ${i + 2}`,
        email: customer.email,
        cpfCnpj: cnpj.replace(/\D/g, ''),
        phone: customer.phone
      }

      const additionalCustomer = await getOrCreateCustomer(additionalCustomerData)

      const additionalPaymentData: any = {
        customer: additionalCustomer.id,
        billingType,
        value: valuePerCompany,
        dueDate,
        description: `Dnotas - Taxa de Adesão (Empresa ${i + 2})`,
        externalReference: leadId
      }

      if (billingType === 'CREDIT_CARD' && creditCard && creditCardHolderInfo) {
        additionalPaymentData.creditCard = creditCard
        additionalPaymentData.creditCardHolderInfo = creditCardHolderInfo
      }

      const additionalPayment = await asaasRequest('/payments', {
        method: 'POST',
        body: JSON.stringify(additionalPaymentData)
      })

      payments.push(additionalPayment)
      allPaymentIds.push(additionalPayment.id)
    }

    // 3. Se for PIX, buscar QR Code do primeiro pagamento
    let pixQrCode = null
    if (billingType === 'PIX' && payments.length > 0) {
      const pixData = await asaasRequest(`/payments/${payments[0].id}/pixQrCode`)
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
        payment_status: payments[0].status,
        payment_id: allPaymentIds.join(','), // Guardar todos os IDs separados por vírgula
        payment_method: billingType,
        asaas_customer_id: mainCustomer.id,
        companies_count: companiesCount,
        additional_cnpjs: additionalCnpjs.filter((c: string) => c && c.trim() !== ''),
        final_value: valuePerCompany * payments.length,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)

    // 5. Retornar resposta com todos os pagamentos
    return new Response(
      JSON.stringify({
        success: true,
        id: payments[0].id,
        allPaymentIds: allPaymentIds,
        status: payments[0].status,
        invoiceUrl: payments[0].invoiceUrl,
        bankSlipUrl: payments[0].bankSlipUrl,
        pixQrCode: pixQrCode,
        payments: payments,
        totalPayments: payments.length
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

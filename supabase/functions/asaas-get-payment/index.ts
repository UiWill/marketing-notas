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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const paymentId = url.pathname.split('/').pop()

    if (!paymentId) {
      throw new Error('ID do pagamento não fornecido')
    }

    // Buscar dados do pagamento
    const payment = await asaasRequest(`/payments/${paymentId}`)

    // Se for PIX, buscar QR Code
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

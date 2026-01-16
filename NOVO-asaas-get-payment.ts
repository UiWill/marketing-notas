import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ASAAS_BASE_URL = 'https://api.asaas.com/v3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Buscar chave da API do banco de dados
async function getAsaasApiKey(): Promise<string> {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { data, error } = await supabaseClient
    .from('api_config')
    .select('api_key')
    .eq('provider', 'asaas')
    .single()

  if (error || !data) {
    throw new Error('Chave da API Asaas não encontrada no banco de dados')
  }

  return data.api_key
}

async function asaasRequest(endpoint: string, apiKey: string, options: RequestInit = {}) {
  const url = `${ASAAS_BASE_URL}${endpoint}`
  const headers = {
    'access_token': apiKey,
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

    // Buscar chave da API do banco
    const apiKey = await getAsaasApiKey()

    // Buscar dados do pagamento
    const payment = await asaasRequest(`/payments/${paymentId}`, apiKey)

    // Se for PIX, buscar QR Code
    let pixQrCode = null
    if (payment.billingType === 'PIX') {
      try {
        const pixData = await asaasRequest(`/payments/${paymentId}/pixQrCode`, apiKey)
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

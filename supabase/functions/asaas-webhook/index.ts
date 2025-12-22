import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHash } from 'https://deno.land/std@0.168.0/hash/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, asaas-access-token, x-asaas-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Facebook Conversions API Config
const FB_PIXEL_ID = '1279949890819385'
const FB_ACCESS_TOKEN = Deno.env.get('FACEBOOK_ACCESS_TOKEN') ?? ''

// Função para hash de dados sensíveis (PII) conforme requisito do Facebook
function hashSHA256(text: string): string {
  const hash = createHash('sha256')
  hash.update(text.toLowerCase().trim())
  return hash.toString()
}

// Enviar evento para Facebook Conversions API
async function sendFacebookConversion(eventData: {
  eventName: string
  email: string
  phone: string
  name: string
  value?: number
  currency?: string
  eventId: string
}) {
  if (!FB_ACCESS_TOKEN) {
    console.warn('FACEBOOK_ACCESS_TOKEN não configurado. Eventos não serão enviados ao Facebook.')
    return
  }

  const url = `https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events`

  const userData: any = {
    em: hashSHA256(eventData.email),
    ph: hashSHA256(eventData.phone.replace(/\D/g, '')),
    fn: hashSHA256(eventData.name.split(' ')[0]),
    ln: hashSHA256(eventData.name.split(' ').slice(-1)[0])
  }

  const eventPayload = {
    data: [
      {
        event_name: eventData.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventData.eventId,
        event_source_url: 'https://dnotas-contabilidade.com',
        action_source: 'website',
        user_data: userData,
        custom_data: eventData.value ? {
          value: eventData.value,
          currency: eventData.currency || 'BRL'
        } : undefined
      }
    ],
    access_token: FB_ACCESS_TOKEN
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventPayload)
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Erro ao enviar evento para Facebook:', result)
    } else {
      console.log(`✅ Evento ${eventData.eventName} enviado ao Facebook com sucesso`)
    }

    return result
  } catch (error) {
    console.error('Erro ao chamar Facebook Conversions API:', error)
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Log headers para debug
  console.log('Headers recebidos:', Object.fromEntries(req.headers.entries()))

  try {
    // Ler o corpo da requisição
    const payload = await req.json()
    console.log('Webhook recebido do Asaas:', JSON.stringify(payload, null, 2))

    // Criar cliente Supabase com service role key (não requer auth do frontend)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // O Asaas envia diferentes eventos, vamos lidar com os principais
    const { event, payment } = payload

    if (!payment || !payment.id) {
      throw new Error('Dados de pagamento inválidos')
    }

    // Buscar o lead associado a este pagamento
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('payment_id', payment.id)
      .single()

    if (leadError || !lead) {
      console.error('Lead não encontrado para payment_id:', payment.id)
      // Mesmo assim retornamos 200 para não reenviar o webhook
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Atualizar status do pagamento conforme o evento
    let updateData: any = {
      payment_status: payment.status,
      updated_at: new Date().toISOString()
    }

    // Eventos do Asaas:
    // PAYMENT_RECEIVED - Pagamento confirmado
    // PAYMENT_CONFIRMED - Pagamento confirmado (alias)
    // PAYMENT_CREATED - Cobrança criada
    // PAYMENT_UPDATED - Cobrança atualizada
    // PAYMENT_OVERDUE - Cobrança vencida
    // PAYMENT_DELETED - Cobrança removida
    // PAYMENT_RESTORED - Cobrança restaurada
    // PAYMENT_REFUNDED - Pagamento estornado
    // PAYMENT_RECEIVED_IN_CASH - Recebido em dinheiro
    // PAYMENT_CHARGEBACK_REQUESTED - Chargeback solicitado
    // PAYMENT_CHARGEBACK_DISPUTE - Disputa de chargeback
    // PAYMENT_AWAITING_CHARGEBACK_REVERSAL - Aguardando reversão de chargeback
    // PAYMENT_DUNNING_RECEIVED - Cobrança recebida (recuperação)
    // PAYMENT_DUNNING_REQUESTED - Cobrança solicitada (recuperação)
    // PAYMENT_BANK_SLIP_VIEWED - Boleto visualizado
    // PAYMENT_CHECKOUT_VIEWED - Checkout visualizado

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
        // Para outros eventos, apenas atualizamos o status
        updateData.payment_status = payment.status.toLowerCase()
    }

    // Atualizar o lead
    const { error: updateError } = await supabaseClient
      .from('leads')
      .update(updateData)
      .eq('id', lead.id)

    if (updateError) {
      console.error('Erro ao atualizar lead:', updateError)
      throw updateError
    }

    console.log(`Lead ${lead.id} atualizado com sucesso. Status: ${updateData.payment_status}`)

    // Processar eventos e enviar ao Facebook
    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      console.log(`✅ PAGAMENTO CONFIRMADO! Lead: ${lead.name} (${lead.email})`)

      // 🎯 ENVIAR EVENTO DE COMPRA PARA O FACEBOOK
      try {
        await sendFacebookConversion({
          eventName: 'Purchase',
          email: lead.email,
          phone: lead.phone,
          name: lead.name,
          value: 525, // Valor do produto
          currency: 'BRL',
          eventId: `purchase_${payment.id}` // ID único para deduplicação
        })
        console.log('✅ Evento Purchase enviado ao Facebook')
      } catch (fbError) {
        console.error('Erro ao enviar evento Purchase ao Facebook:', fbError)
      }

      // Enviar WhatsApp para o cliente
      try {
        const customerMessage = `Olá ${lead.name}!

Recebemos seu pagamento! ✅

Em breve nossa equipe entrará em contato.`

        await fetch('https://backend.uaiviu.com.br/api/messages/send', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer dnotas2023',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            number: lead.phone.replace(/\D/g, ''),
            body: customerMessage
          })
        })
        console.log(`WhatsApp enviado para cliente: ${lead.phone}`)
      } catch (whatsappError) {
        console.error('Erro ao enviar WhatsApp para cliente:', whatsappError)
      }

      // Enviar WhatsApp para o proprietário (Eli)
      try {
        const ownerMessage = `🎉 *NOVA VENDA CONFIRMADA!* 🎉

*Cliente:* ${lead.name}
*E-mail:* ${lead.email}
*Telefone:* ${lead.phone}
*Método:* ${lead.payment_method === 'PIX' ? 'PIX' : lead.payment_method === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'Boleto'}
*Valor:* R$ 525,00

Acesse o painel para mais detalhes! 💰`

        await fetch('https://backend.uaiviu.com.br/api/messages/send', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer dnotas2023',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            number: '5518996682525', // Número do Eli
            body: ownerMessage
          })
        })
        console.log(`WhatsApp enviado para proprietário`)
      } catch (whatsappError) {
        console.error('Erro ao enviar WhatsApp para proprietário:', whatsappError)
      }
    }

    // 🎯 ENVIAR EVENTO DE CANCELAMENTO/VENCIMENTO PARA O FACEBOOK
    if (event === 'PAYMENT_OVERDUE') {
      console.log(`⚠️ PAGAMENTO VENCIDO! Lead: ${lead.name} (${lead.email})`)

      try {
        await sendFacebookConversion({
          eventName: 'PaymentOverdue', // Evento customizado
          email: lead.email,
          phone: lead.phone,
          name: lead.name,
          eventId: `overdue_${payment.id}`
        })
        console.log('✅ Evento PaymentOverdue enviado ao Facebook')
      } catch (fbError) {
        console.error('Erro ao enviar evento PaymentOverdue ao Facebook:', fbError)
      }
    }

    // 🎯 ENVIAR EVENTO DE ESTORNO PARA O FACEBOOK
    if (event === 'PAYMENT_REFUNDED') {
      console.log(`💰 PAGAMENTO ESTORNADO! Lead: ${lead.name} (${lead.email})`)

      try {
        await sendFacebookConversion({
          eventName: 'PaymentRefunded', // Evento customizado
          email: lead.email,
          phone: lead.phone,
          name: lead.name,
          value: 525,
          currency: 'BRL',
          eventId: `refund_${payment.id}`
        })
        console.log('✅ Evento PaymentRefunded enviado ao Facebook')
      } catch (fbError) {
        console.error('Erro ao enviar evento PaymentRefunded ao Facebook:', fbError)
      }
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
    // Retornar 200 mesmo em caso de erro para evitar reenvios desnecessários
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

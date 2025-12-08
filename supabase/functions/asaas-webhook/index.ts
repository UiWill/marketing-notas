import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Se o pagamento foi confirmado, podemos enviar e-mail, notificar equipe, etc.
    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      console.log(`✅ PAGAMENTO CONFIRMADO! Lead: ${lead.name} (${lead.email})`)
      // Aqui você pode adicionar lógica para:
      // - Enviar e-mail de boas-vindas
      // - Notificar equipe de vendas
      // - Criar registro de assinatura
      // - etc.
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

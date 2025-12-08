// Configuração da API de WhatsApp
const WHATSAPP_API_URL = 'https://backend.uaiviu.com.br/api/messages/send'
const WHATSAPP_TOKEN = 'dnotas2023'
const OWNER_PHONE = '5518996682525' // Número do Eli (proprietário)

interface SendWhatsAppParams {
  number: string
  body: string
}

export const sendWhatsApp = async ({ number, body }: SendWhatsAppParams) => {
  try {
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        number: number.replace(/\D/g, ''), // Remove formatação
        body
      })
    })

    if (!response.ok) {
      throw new Error('Erro ao enviar WhatsApp')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error)
    throw error
  }
}

// Notificar cliente sobre pagamento
export const notifyCustomerPayment = async (customerName: string, customerPhone: string, paymentMethod: string) => {
  const message = `Olá ${customerName}! 👋

Recebemos seu pagamento via ${paymentMethod === 'PIX' ? 'PIX' : paymentMethod === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'Boleto'}! ✅

Em breve nossa equipe entrará em contato para dar continuidade ao processo de regularização do seu negócio.

Qualquer dúvida, estamos à disposição!

*Equipe Dnotas* 📋`

  return sendWhatsApp({
    number: customerPhone,
    body: message
  })
}

// Notificar proprietário sobre nova venda
export const notifyOwnerNewSale = async (customerName: string, customerEmail: string, customerPhone: string, paymentMethod: string, amount: number) => {
  const message = `🎉 *NOVA VENDA CONFIRMADA!* 🎉

*Cliente:* ${customerName}
*E-mail:* ${customerEmail}
*Telefone:* ${customerPhone}
*Método:* ${paymentMethod === 'PIX' ? 'PIX' : paymentMethod === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'Boleto'}
*Valor:* R$ ${amount.toFixed(2)}

Acesse o painel para mais detalhes! 💰`

  return sendWhatsApp({
    number: OWNER_PHONE,
    body: message
  })
}

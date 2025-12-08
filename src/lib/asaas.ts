// Configuração do cliente Asaas
const ASAAS_API_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjhlMDdlOTZlLTBiOTUtNGFkYS1hNmI4LWNlODFkYzQzNDI0Mjo6JGFhY2hfY2Y2Mjc2MjItZjg4OC00MmZjLThlNmItMWRlMGZkMjAzNmI1'
const ASAAS_BASE_URL = 'https://api.asaas.com/v3'

interface AsaasCustomer {
  name: string
  email: string
  cpfCnpj: string
  phone: string
}

interface AsaasPayment {
  customer: string
  billingType: 'CREDIT_CARD' | 'BOLETO' | 'PIX'
  value: number
  dueDate: string
  description?: string
  externalReference?: string
}

interface AsaasCreditCard {
  holderName: string
  number: string
  expiryMonth: string
  expiryYear: string
  ccv: string
}

interface AsaasCreditCardHolderInfo {
  name: string
  email: string
  cpfCnpj: string
  phone: string
}

export class AsaasClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = ASAAS_API_KEY
    this.baseUrl = ASAAS_BASE_URL
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'access_token': this.apiKey,
      'Content-Type': 'application/json',
      ...options.headers
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

  // Criar ou buscar cliente
  async createOrGetCustomer(customerData: AsaasCustomer): Promise<any> {
    // Primeiro, tentar buscar cliente existente por CPF/CNPJ
    try {
      const existingCustomers = await this.request(`/customers?cpfCnpj=${customerData.cpfCnpj}`)
      if (existingCustomers.data && existingCustomers.data.length > 0) {
        return existingCustomers.data[0]
      }
    } catch (err) {
      console.log('Cliente não encontrado, criando novo...')
    }

    // Se não existir, criar novo cliente
    return await this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData)
    })
  }

  // Criar cobrança
  async createPayment(
    paymentData: AsaasPayment,
    creditCard?: AsaasCreditCard,
    creditCardHolderInfo?: AsaasCreditCardHolderInfo
  ): Promise<any> {
    const payload: any = { ...paymentData }

    // Se for cartão de crédito, adicionar dados do cartão
    if (paymentData.billingType === 'CREDIT_CARD' && creditCard && creditCardHolderInfo) {
      payload.creditCard = creditCard
      payload.creditCardHolderInfo = creditCardHolderInfo
    }

    return await this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Buscar cobrança por ID
  async getPayment(paymentId: string): Promise<any> {
    return await this.request(`/payments/${paymentId}`)
  }

  // Gerar PIX QR Code
  async getPixQrCode(paymentId: string): Promise<any> {
    return await this.request(`/payments/${paymentId}/pixQrCode`)
  }

  // Criar assinatura (para mensalidade recorrente)
  async createSubscription(customerId: string, value: number): Promise<any> {
    const subscriptionData = {
      customer: customerId,
      billingType: 'CREDIT_CARD',
      value: value,
      nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
      cycle: 'MONTHLY',
      description: 'Mensalidade Dnotas - Emissão de Notas Fiscais'
    }

    return await this.request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData)
    })
  }

  // Confirmar pagamento (webhook)
  async confirmPayment(paymentId: string): Promise<any> {
    return await this.getPayment(paymentId)
  }
}

export const asaasClient = new AsaasClient()

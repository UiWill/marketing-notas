import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle, CreditCard, Smartphone, FileText, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface PaymentData {
  customer: {
    name: string
    email: string
    cpfCnpj: string
    phone: string
  }
  billingType: 'CREDIT_CARD' | 'BOLETO' | 'PIX'
  value: number
  dueDate: string
}

export const Checkout = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const leadId = searchParams.get('leadId')

  const [loading, setLoading] = useState(true)
  const [leadData, setLeadData] = useState<any>(null)
  const [selectedPayment, setSelectedPayment] = useState<'CREDIT_CARD' | 'BOLETO' | 'PIX'>('PIX')
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [cardData, setCardData] = useState({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: ''
  })
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!leadId) {
      navigate('/')
      return
    }
    loadLeadData()
  }, [leadId])

  const loadLeadData = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()

      if (error) throw error
      setLeadData(data)
      setLoading(false)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      navigate('/')
    }
  }

  const formatCPFCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      // CPF
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else {
      // CNPJ
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
  }

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{4})/g, '$1 ').trim()
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  const processPayment = async () => {
    setProcessing(true)
    setError('')

    try {
      // Preparar dados do pagamento
      const valorPagamento = 525.00 // R$ 575,00 - R$ 50,00 de desconto (já inclui primeira mensalidade)

      const paymentData: PaymentData = {
        customer: {
          name: leadData.name,
          email: leadData.email,
          cpfCnpj: cpfCnpj.replace(/\D/g, ''),
          phone: leadData.phone
        },
        billingType: selectedPayment,
        value: valorPagamento,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 dias
      }

      // Adicionar dados do cartão se for cartão de crédito
      if (selectedPayment === 'CREDIT_CARD') {
        Object.assign(paymentData, {
          creditCard: {
            holderName: cardData.holderName,
            number: cardData.number.replace(/\s/g, ''),
            expiryMonth: cardData.expiryMonth,
            expiryYear: cardData.expiryYear,
            ccv: cardData.ccv
          },
          creditCardHolderInfo: {
            name: cardData.holderName,
            email: leadData.email,
            cpfCnpj: cpfCnpj.replace(/\D/g, ''),
            postalCode: postalCode.replace(/\D/g, ''),
            addressNumber: '0',
            phone: leadData.phone
          }
        })
      }

      // Chamar Edge Function do Supabase para processar pagamento
      const SUPABASE_URL = 'https://xtxuoqcunnlccnujbbhk.supabase.co'
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0eHVvcWN1bm5sY2NudWpiYmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NzI3NDMsImV4cCI6MjA3NDU0ODc0M30.MQ96oAiZNnJXNQJmordG78C_s8c6wSGGtTzgva00-nQ'
      const response = await fetch(`${SUPABASE_URL}/functions/v1/asaas-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          ...paymentData,
          leadId: leadId
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao processar pagamento')
      }

      // A Edge Function já atualiza o banco de dados, apenas redirecionar
      navigate(`/obrigado?paymentId=${result.id}&method=${selectedPayment}&leadId=${leadId}`)
    } catch (err: any) {
      console.error('Erro ao processar pagamento:', err)
      setError(err.message || 'Erro ao processar pagamento. Tente novamente.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Finalize Sua Contratação
          </h1>
          <p className="text-xl text-white/80">
            <span className="line-through opacity-60">R$ 575,00</span> por Apenas <span className="text-green-400 font-bold">R$ 525,00</span> <span className="font-bold">HOJE</span>
          </p>
          <p className="text-lg text-green-400 font-semibold mb-2">
            Economize R$ 50,00 na Taxa de Adesão!
          </p>
          <p className="text-lg text-white/60">
            depois passa a pagar R$ 375,00 mensalmente
          </p>
        </div>

        {/* Payment Options */}
        <div className="bg-white rounded-3xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Escolha a Forma de Pagamento
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setSelectedPayment('PIX')}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedPayment === 'PIX'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <Smartphone className={`w-12 h-12 mx-auto mb-3 ${
                selectedPayment === 'PIX' ? 'text-green-600' : 'text-gray-400'
              }`} />
              <h3 className="font-bold text-lg mb-1">PIX</h3>
              <p className="text-sm text-gray-600">Aprovação instantânea</p>
            </button>

            <button
              onClick={() => setSelectedPayment('CREDIT_CARD')}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedPayment === 'CREDIT_CARD'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <CreditCard className={`w-12 h-12 mx-auto mb-3 ${
                selectedPayment === 'CREDIT_CARD' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <h3 className="font-bold text-lg mb-1">Cartão de Crédito</h3>
              <p className="text-sm text-gray-600">Parcelamento disponível</p>
            </button>

            <button
              onClick={() => setSelectedPayment('BOLETO')}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedPayment === 'BOLETO'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <FileText className={`w-12 h-12 mx-auto mb-3 ${
                selectedPayment === 'BOLETO' ? 'text-orange-600' : 'text-gray-400'
              }`} />
              <h3 className="font-bold text-lg mb-1">Boleto</h3>
              <p className="text-sm text-gray-600">Vence em 7 dias</p>
            </button>
          </div>

          {/* CPF/CNPJ */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF ou CNPJ *
            </label>
            <input
              type="text"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(formatCPFCNPJ(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="000.000.000-00"
              maxLength={18}
            />
          </div>

          {/* Card Form */}
          {selectedPayment === 'CREDIT_CARD' && (
            <div className="space-y-4 mb-6 bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-4">Dados do Cartão</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome no Cartão *
                </label>
                <input
                  type="text"
                  value={cardData.holderName}
                  onChange={(e) => setCardData({ ...cardData, holderName: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP do Titular *
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(formatCEP(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do Cartão *
                </label>
                <input
                  type="text"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mês *
                  </label>
                  <input
                    type="text"
                    value={cardData.expiryMonth}
                    onChange={(e) => setCardData({ ...cardData, expiryMonth: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="MM"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ano *
                  </label>
                  <input
                    type="text"
                    value={cardData.expiryYear}
                    onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="AAAA"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    value={cardData.ccv}
                    onChange={(e) => setCardData({ ...cardData, ccv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={processPayment}
            disabled={processing || !cpfCnpj || (selectedPayment === 'CREDIT_CARD' && !postalCode)}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando Pagamento...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Confirmar Pagamento
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            🔒 Pagamento seguro e criptografado
          </p>
        </div>

        {/* Summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-4">Resumo do Pedido</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Taxa de Adesão:</span>
              <span className="line-through opacity-60">R$ 575,00</span>
            </div>
            <div className="flex justify-between text-green-400">
              <span>Desconto Especial:</span>
              <span className="font-bold">- R$ 50,00</span>
            </div>
            <div className="flex justify-between text-sm text-white/60 pt-2">
              <span>Mensalidade após hoje:</span>
              <span>R$ 375,00/mês</span>
            </div>
          </div>
          <div className="border-t border-white/20 pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total Hoje:</span>
              <span className="text-green-400">R$ 525,00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

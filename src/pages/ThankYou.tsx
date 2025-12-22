import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, MessageCircle, Loader2, Smartphone, FileText, Copy, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { initFacebookPixel, fbTrackPageView } from '@/utils/facebookPixel'

export const ThankYou = () => {
  const [searchParams] = useSearchParams()
  const paymentId = searchParams.get('paymentId')
  const leadId = searchParams.get('leadId')
  const method = searchParams.get('method')

  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [paymentStatus, setPaymentStatus] = useState<string>('pending')
  const [copied, setCopied] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Monitorar status do pagamento em tempo real
  useEffect(() => {
    // Initialize Facebook Pixel
    initFacebookPixel()
    fbTrackPageView()

    if (paymentId && leadId && method === 'PIX') {
      // Carregar dados iniciais
      loadPaymentData()

      // Iniciar polling para verificar status a cada 5 segundos
      pollingIntervalRef.current = setInterval(() => {
        checkPaymentStatus()
      }, 5000)

      // Limpar interval quando componente desmontar ou pagamento for confirmado
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
        }
      }
    } else if (paymentId) {
      loadPaymentData()
    } else {
      setLoading(false)
    }
  }, [paymentId, leadId, method])

  // Parar polling quando pagamento for confirmado
  useEffect(() => {
    if (paymentStatus === 'RECEIVED' || paymentStatus === 'CONFIRMED') {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [paymentStatus])

  const checkPaymentStatus = async () => {
    try {
      if (!leadId) return

      // Verificar status diretamente no banco de dados
      const { data, error } = await supabase
        .from('leads')
        .select('payment_status')
        .eq('id', leadId)
        .single()

      if (error) throw error

      if (data?.payment_status) {
        setPaymentStatus(data.payment_status)
      }
    } catch (err) {
      console.error('Erro ao verificar status do pagamento:', err)
    }
  }

  const loadPaymentData = async () => {
    try {
      // Buscar dados do pagamento via Edge Function
      const SUPABASE_URL = 'https://xtxuoqcunnlccnujbbhk.supabase.co'
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0eHVvcWN1bm5sY2NudWpiYmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NzI3NDMsImV4cCI6MjA3NDU0ODc0M30.MQ96oAiZNnJXNQJmordG78C_s8c6wSGGtTzgva00-nQ'
      const response = await fetch(`${SUPABASE_URL}/functions/v1/asaas-get-payment/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      })
      const data = await response.json()
      setPaymentData(data)

      // Atualizar status inicial
      if (data.status) {
        setPaymentStatus(data.status)
      }
    } catch (err) {
      console.error('Erro ao carregar dados do pagamento:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyPixCode = () => {
    if (paymentData?.payload) {
      navigator.clipboard.writeText(paymentData.payload)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="bg-white rounded-3xl p-8 md:p-12 text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pedido Aguardando Pagamento
          </h1>

          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Obrigado por escolher a <span className="font-bold text-orange-500">Dnotas</span>.<br />
            Assim que confirmarmos o pagamento, entraremos em contato para iniciar a regularização do seu negócio.
          </p>

          {/* Payment Method Specific Info */}
          {method === 'PIX' && (
            <div className={`border-2 rounded-2xl p-6 mb-6 ${
              paymentStatus === 'RECEIVED' || paymentStatus === 'CONFIRMED'
                ? 'bg-green-100 border-green-400'
                : 'bg-green-50 border-green-200'
            }`}>
              {paymentStatus === 'RECEIVED' || paymentStatus === 'CONFIRMED' ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-2xl font-bold text-green-800 mb-3">
                    🎉 Pagamento Confirmado! 🎉
                  </h3>
                  <p className="text-gray-800 mb-4 text-lg">
                    Seu pagamento PIX foi recebido com sucesso!<br />
                    Em breve nossa equipe entrará em contato.
                  </p>
                </>
              ) : (
                <>
                  <Smartphone className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Pagamento via PIX
                    {paymentStatus === 'pending' && (
                      <span className="ml-2 text-sm text-gray-600">(Aguardando...)</span>
                    )}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Escaneie o QR Code ou copie o código abaixo para realizar o pagamento:
                  </p>
                </>
              )}
              {/* Mostrar QR Code apenas se pagamento ainda não foi confirmado */}
              {(paymentStatus !== 'RECEIVED' && paymentStatus !== 'CONFIRMED') && paymentData?.pixQrCode && (
                <div className="bg-white p-4 rounded-lg mb-4">
                  <img
                    src={`data:image/png;base64,${paymentData.pixQrCode}`}
                    alt="QR Code PIX"
                    className="w-64 h-64 mx-auto"
                  />
                  <p className="text-sm text-gray-600 mt-4">
                    Escaneie o QR Code acima com o app do seu banco
                  </p>
                </div>
              )}

              {/* Botão Copia e Cola - Mostrar apenas se pagamento ainda não foi confirmado */}
              {(paymentStatus !== 'RECEIVED' && paymentStatus !== 'CONFIRMED') && paymentData?.payload && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Ou copie o código PIX:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={paymentData.payload}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
                    />
                    <button
                      onClick={copyPixCode}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600 mt-4">
                Assim que recebermos a confirmação do pagamento, entraremos em contato.
              </p>
            </div>
          )}

          {method === 'BOLETO' && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-6">
              <FileText className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Pagamento via Boleto
              </h3>
              <p className="text-gray-700 mb-4">
                O boleto foi enviado para seu e-mail e também está disponível abaixo:
              </p>
              {paymentData?.bankSlipUrl && (
                <a
                  href={paymentData.bankSlipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mb-4"
                >
                  Baixar Boleto
                </a>
              )}
              <p className="text-sm text-gray-600">
                O boleto vence em 7 dias. Após o pagamento, entraremos em contato.
              </p>
            </div>
          )}

          {method === 'CREDIT_CARD' && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
              <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Pagamento Aprovado!
              </h3>
              <p className="text-gray-700">
                Seu pagamento via cartão de crédito foi processado com sucesso.<br />
                Você receberá um e-mail com os detalhes da compra.
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Próximos Passos
            </h3>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <span>Nossa equipe analisará suas informações</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <span>Entraremos em contato em até 24 horas para iniciar o processo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <span>Começaremos a regularização e emissão das suas notas fiscais</span>
              </li>
            </ol>
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
            <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Tem alguma dúvida?
            </h3>
            <p className="text-gray-700 mb-4">
              Nossa equipe está disponível no WhatsApp para te ajudar!
            </p>
            <a
              href="https://wa.me/5518996682525?text=Olá! Acabei de realizar o pagamento e gostaria de mais informações sobre os próximos passos."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="w-6 h-6" />
              Falar no WhatsApp
            </a>
          </div>
        </div>

        {/* Important Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white text-center">
          <p className="text-sm">
            📧 Um e-mail de confirmação foi enviado para o endereço cadastrado.<br />
            Verifique também sua caixa de spam.
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, Users, Clock, Award, FileText, CreditCard, Building, MessageCircle } from 'lucide-react'
import { VideoPlayer } from '@/components/VideoPlayer'
import { LeadForm } from '@/components/LeadForm'
import { ScrollAnimation } from '@/components/ScrollAnimation'
import { trackPageView } from '@/utils/analytics'
import { usePageTracking } from '@/hooks/usePageTracking'

export const LandingPage = () => {
  const [leadId, setLeadId] = useState<string | undefined>(undefined)
  const [showContent, setShowContent] = useState(true) // Página sempre liberada
  const [showModal, setShowModal] = useState(false)

  // Page tracking com visitantes anônimos
  const { updatePageView, trackEvent } = usePageTracking({
    trackScroll: true,
    trackTimeOnPage: true,
  })

  useEffect(() => {
    trackPageView('/')
  }, [])

  const handleLeadSubmit = (id: string) => {
    setLeadId(id)
    setShowContent(true)
    // Track form completion
    updatePageView({ completed_form: true })
    trackEvent('form_submitted', { lead_id: id })
  }

  const handleVideoTimeUpdate = (time: number) => {
    // Track video start only once
    if (time >= 1 && time < 5) {
      updatePageView({ started_video: true })
      trackEvent('video_started')
    }
  }

  const handleWhatsAppFloatingClick = () => {
    trackEvent('whatsapp_click', {
      source: 'floating_button',
      timestamp: new Date().toISOString()
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 bg-gradient-to-br from-purple-900/80 to-blue-900/80">
        <div className="text-center">
          {/* VERSÃO A - Copy Original da Cliente (Para Testes A/B) */}
          {/* 
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Se você fatura mais de <span className="text-accent-400">12.000 por mês</span> e não emite NF, <span className="text-red-400">cuidado...</span>
          </h1>
          */}
          
          {/* VERSÃO B - Título Atual (Ativo) */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Você Pode Estar Correndo <span className="text-red-400">Sérios Riscos Fiscais</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto">
            Se você fatura mais de <span className="text-accent-400 font-bold">12.000 por mês</span> e não emite Nota Fiscal das suas vendas, <span className="text-red-400 font-bold">cuidado...</span>
          </p>
        </div>
      </header>

      {/* Video Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <VideoPlayer
            url="https://youtu.be/vmmBD2Rxb9M"
            leadId={leadId}
            onTimeUpdate={handleVideoTimeUpdate}
            showControlsAfter={0} // Controles sempre disponíveis
            className="aspect-video w-full"
          />

          {/* Botão CTA abaixo do vídeo */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setShowModal(true)
                trackEvent('cta_clicked', { location: 'below_video' })
              }}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-6 px-12 rounded-full text-xl md:text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl uppercase w-full md:w-auto"
            >
              CLIQUE AQUI E RECEBA NOSSOS<br />SERVIÇOS EXCLUSIVOS
            </button>
          </div>
        </div>
      </section>

      {/* Content sempre visível */}
      {showContent && (
        <>

          {/* Testimonials Section - FUNDO BRANCO FULL WIDTH */}
          <section className="bg-white py-16">
            <div className="max-w-6xl mx-auto">
              <ScrollAnimation animation="slideUp">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                  Veja o Que Nossos Clientes Dizem
                </h2>
                <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
                  Já são mais de <span className="text-orange-500 font-bold">300 clientes</span> que confiaram na Dnotas e transformaram sua gestão fiscal
                </p>
              </ScrollAnimation>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Carlos Silva',
                    business: 'Loja de Eletrônicos',
                    text: 'Nossa, vocês resolveram meu problema em 1 dia! Estava com medo de multa da Receita, agora estou tranquilo 👏',
                    time: '14:32',
                    avatar: '👨‍💼'
                  },
                  {
                    name: 'Marina Costa',
                    business: 'Salão de Beleza',
                    text: 'Meninas, muito obrigada! Agora tenho minhas notas emitidas sem erro nenhum. A equipe é muito atenciosa! 💅✨',
                    time: '16:45',
                    avatar: '👩‍💼'
                  },
                  {
                    name: 'Roberto Almeida',
                    business: 'Restaurante',
                    text: 'Melhor decisão que tomei! Antes ficava horas tentando fazer NF, agora é automático. Equipe nota 10! 🍽️',
                    time: '10:20',
                    avatar: '👨‍🍳'
                  },
                  {
                    name: 'Juliana Souza',
                    business: 'Loja de Roupas',
                    text: 'Estava desesperada com a fiscalização. A equipe da Dnotas resolveu tudo em 2 dias! Super recomendo 👗✨',
                    time: '09:15',
                    avatar: '👩‍💼'
                  },
                  {
                    name: 'Pedro Santos',
                    business: 'Oficina Mecânica',
                    text: 'Achei que ia ser complicado, mas foi super tranquilo. Suporte excelente, sempre que preciso eles respondem rápido! 🔧',
                    time: '15:30',
                    avatar: '👨‍🔧'
                  },
                  {
                    name: 'Ana Paula',
                    business: 'Consultoria',
                    text: 'Economizei tempo e dinheiro! Não preciso mais de contador só pra emitir nota. Vale muito a pena! 📊',
                    time: '11:50',
                    avatar: '👩‍💼'
                  }
                ].map((testimonial, index) => (
                  <ScrollAnimation key={index} animation="slideUp" delay={0.1 * index}>
                    <div className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition-all duration-300 h-full shadow-xl">
                      {/* WhatsApp Style Header */}
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/20">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                          {testimonial.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">{testimonial.name}</p>
                          <p className="text-white/60 text-sm truncate">{testimonial.business}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-white/60 text-xs">{testimonial.time}</span>
                        </div>
                      </div>

                      {/* Message Bubble */}
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 relative">
                        <p className="text-white/90 text-sm leading-relaxed">{testimonial.text}</p>
                        <div className="absolute -bottom-2 right-4">
                          <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-green-500/30"></div>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <span className="text-white/60 text-xs flex items-center gap-1">
                          ✓✓ <span>Lido</span>
                        </span>
                      </div>
                    </div>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </section>

          {/* Seção de Benefícios com 4 itens - FUNDO AZUL/ROXO */}
          <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScrollAnimation animation="slideUp" delay={0.1}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-accent-500/20 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-8 h-8 text-accent-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Validação Garantida</h3>
                    </div>
                    <p className="text-white/90 text-lg leading-relaxed">
                      Garanto que suas notas serão validadas pela Receita Federal, sem riscos de rejeição
                    </p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation animation="slideUp" delay={0.2}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-accent-500/20 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-8 h-8 text-accent-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Rapidez na Emissão</h3>
                    </div>
                    <p className="text-white/90 text-lg leading-relaxed">
                      Minha equipe emitirá suas notas em segundos, não em horas
                    </p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation animation="slideUp" delay={0.3}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-accent-500/20 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                        <Award className="w-8 h-8 text-accent-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Suporte Especializado</h3>
                    </div>
                    <p className="text-white/90 text-lg leading-relaxed">
                      Equipe experiente que garanto estar sempre disponível para te ajudar
                    </p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation animation="slideUp" delay={0.4}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="text-center">
                      <p className="text-white/90 text-lg font-semibold flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-1" />
                        <span>Garanto te entregar NF-e, NFC-e e NFS-e sem complicação, com acompanhamento pessoal sem complicações, todos os dias e a qualquer momento que você precisar</span>
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </section>

          {/* CTA Principal com Efeito de Destaque - FUNDO BRANCO */}
          <section className="bg-white py-16 px-4">
            <ScrollAnimation animation="scaleUp">
              <div className="max-w-3xl mx-auto text-center">
                <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-yellow-600 p-1 rounded-3xl shadow-2xl">
                  <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 md:p-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                      Pronto para Regularizar Seu Negócio?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 leading-relaxed">
                      Junte-se a mais de 300 empresários que confiaram na minha equipe para realizar as emissões de notas fiscais sobre suas vendas sem precisar se preocupar com mais nada!
                    </p>

                    <button
                      onClick={() => {
                        const form = document.getElementById('lead-form')
                        form?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="group relative bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-6 px-12 rounded-full text-xl md:text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl mb-6 w-full md:w-auto"
                    >
                      <span className="relative z-10">CONTRATAR SERVIÇO AGORA</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-accent-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-yellow-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300 -z-10"></div>
                    </button>

                    <div className="flex items-center justify-center gap-6 text-white/80 text-sm flex-wrap">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        Sem fidelidade
                      </span>
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        Garantia 30 dias
                      </span>
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        Suporte imediato
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </section>


          {/* Como a Dnotas Simplifica - FUNDO AZUL/ROXO */}
          <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <ScrollAnimation animation="slideUp">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                  Como a Dnotas Simplifica Sua Emissão de Notas
                </h2>
              </ScrollAnimation>

              <div className="space-y-6 max-w-3xl mx-auto">
                <ScrollAnimation animation="slideUp" delay={0.1}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-start gap-4 hover:bg-white/15 transition-all duration-300">
                    <CheckCircle className="w-8 h-8 text-accent-400 flex-shrink-0 mt-1" />
                    <p className="text-xl text-white/90 text-left">
                      Garantimos entregar NF... sem complicações, todos os dias e a qualquer momento que você precisar
                    </p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation animation="slideUp" delay={0.2}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-start gap-4 hover:bg-white/15 transition-all duration-300">
                    <CheckCircle className="w-8 h-8 text-accent-400 flex-shrink-0 mt-1" />
                    <p className="text-xl text-white/90 text-left">
                      Garantimos que suas notas serão validadas pela Receita Federal, sem riscos de rejeição
                    </p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation animation="slideUp" delay={0.3}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-start gap-4 hover:bg-white/15 transition-all duration-300">
                    <CheckCircle className="w-8 h-8 text-accent-400 flex-shrink-0 mt-1" />
                    <p className="text-xl text-white/90 text-left">
                      Equipe experiente, atualizada nas Leis Fiscais do Brasil e sempre disponível para lhe dar acompanhamento pessoal
                    </p>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </section>

          {/* O MEU TIME AO SEU FAVOR - FUNDO BRANCO */}
          <section className="bg-white py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <ScrollAnimation animation="slideUp">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  O MEU TIME AO SEU FAVOR
                </h2>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeIn" delay={0.2}>
                <div className="bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl">
                  <Users className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                  <p className="text-xl md:text-2xl text-white/95 leading-relaxed">
                    Tenho uma <span className="text-yellow-500 font-bold">equipe focada</span> em entregar os serviços prometidos{' '}
                    <span className="text-yellow-500 font-bold">dia e noite</span>, em dias úteis ou feriados, a{' '}
                    <span className="text-yellow-500 font-bold">qualquer momento</span> que o seu cliente precisar de uma nota fiscal no ato da compra ou quando você emitir vendas fiscalizadas.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-gray-700 rounded-xl p-6">
                      <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">24/7 Disponível</h3>
                      <p className="text-white/80 text-sm">Atendimento todos os dias, sem exceção</p>
                    </div>

                    <div className="bg-gray-700 rounded-xl p-6">
                      <Shield className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">Equipe Especializada</h3>
                      <p className="text-white/80 text-sm">Profissionais treinados e experientes</p>
                    </div>

                    <div className="bg-gray-700 rounded-xl p-6">
                      <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">Compromisso Total</h3>
                      <p className="text-white/80 text-sm">Focados em entregar o prometido</p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </section>

          {/* Tabela Comparativa: Com DNOTAS vs Sem DNOTAS - FUNDO AZUL/ROXO */}
          <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollAnimation animation="slideUp">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                  Veja a Diferença Entre Ter e Não Ter a DNOTAS
                </h2>
              </ScrollAnimation>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sem o DNOTAS */}
                <ScrollAnimation animation="slideUp" delay={0.2}>
                  <div className="bg-red-900/20 border-2 border-red-500/30 rounded-2xl p-8 h-full">
                    <div className="text-center mb-6">
                      <div className="bg-red-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">❌</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-red-400 mb-2">
                        Sem o DNOTAS
                      </h3>
                      <p className="text-white/70">você vai precisar...</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        'Correr risco de cair na malha fina',
                        'Pagar + de R$ 1.800 para um profissional em emissões de NF',
                        'Gastar tempo tentando fazer as NF da forma correta',
                        'Se preocupar em mandar ao seu contabilista os relatórios obrigatórios de vendas e de estoque todos os meses',
                        'Se virar sozinho quando um cliente solicitar NF e seu funcionário não estar disponível para emitir',
                        'Correr o risco de fazer NF com dados incorretos e ter dor de cabeça ao tentar arrumar os erros enviados ao SEFAZ'
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3 bg-red-500/10 rounded-lg p-4">
                          <span className="text-red-400 flex-shrink-0 mt-1">👎</span>
                          <p className="text-white/90">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollAnimation>

                {/* Com o DNOTAS */}
                <ScrollAnimation animation="slideUp" delay={0.4}>
                  <div className="bg-green-900/20 border-2 border-accent-500/50 rounded-2xl p-8 h-full relative overflow-hidden">
                    {/* Efeito de brilho */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent"></div>

                    <div className="relative z-10">
                      <div className="text-center mb-6">
                        <div className="bg-accent-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                          <span className="text-4xl">✅</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-accent-400 mb-2">
                          Com o DNOTAS você...
                        </h3>
                        <p className="text-white/70">terá todos esses benefícios</p>
                      </div>

                      <div className="space-y-4">
                        {[
                          'Terá as suas NF emitidas no SEFAZ dentro de 12h após a venda',
                          'Receberá os relatórios diários das emissões de NF via WhatsApp',
                          'Terá relatórios completos do seu estoque e das vendas enviadas ao SEFAZ enviados para o seu contabilista todos os meses',
                          'Terá acesso a minha equipe manhã, tarde e noite para quaisquer eventualidade fiscal sobre vendas',
                          'Receberá aconselhamento fiscal de vendas quando precisar',
                          'Ficará livre de cometer erros',
                          'Terá + tempo para focar em outras áreas do seu comércio'
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-3 bg-accent-500/10 rounded-lg p-4 border border-accent-500/20">
                            <CheckCircle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-1" />
                            <p className="text-white/90">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollAnimation>
              </div>

              {/* CTA após tabela */}
              <ScrollAnimation animation="scaleUp" delay={0.6}>
                <div className="text-center mt-12">
                  <p className="text-2xl text-white mb-6">
                    A escolha é sua: continuar na <span className="text-red-400 font-bold">incerteza</span> ou ter{' '}
                    <span className="text-accent-400 font-bold">segurança total</span>?
                  </p>
                  <button
                    onClick={() => {
                      const form = document.getElementById('lead-form')
                      form?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-5 px-10 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    QUERO TER A DNOTAS AO MEU LADO
                  </button>
                </div>
              </ScrollAnimation>
            </div>
          </section>

          {/* Types of Invoices Section - FUNDO BRANCO */}
          <section className="bg-white py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollAnimation animation="slideUp">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                  Todos os Tipos de Notas Fiscais em Um Só Lugar
                </h2>
              </ScrollAnimation>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ScrollAnimation animation="slideUp" delay={0.2}>
                  <div className="bg-gray-800 rounded-2xl p-8 text-center border border-gray-700 hover:bg-gray-700 transition-all duration-300 group shadow-xl">
                    <FileText className="w-16 h-16 text-yellow-500 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold text-white mb-4">NF-e</h3>
                    <p className="text-white/90 mb-4">Nota Fiscal Eletrônica</p>
                    <p className="text-white/80 text-sm">
                      Para vendas de produtos entre empresas (B2B) e para consumidores finais.
                      Substitui a nota fiscal em papel.
                    </p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation animation="slideUp" delay={0.4}>
                  <div className="bg-gray-800 rounded-2xl p-8 text-center border border-gray-700 hover:bg-gray-700 transition-all duration-300 group shadow-xl">
                    <CreditCard className="w-16 h-16 text-yellow-500 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold text-white mb-4">NFC-e</h3>
                    <p className="text-white/90 mb-4">Nota Fiscal do Consumidor</p>
                    <p className="text-white/80 text-sm">
                      Para vendas diretas ao consumidor final. Substitui o cupom fiscal
                      e pode ser enviada por e-mail ou SMS.
                    </p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation animation="slideUp" delay={0.6}>
                  <div className="bg-gray-800 rounded-2xl p-8 text-center border border-gray-700 hover:bg-gray-700 transition-all duration-300 group shadow-xl">
                    <Building className="w-16 h-16 text-yellow-500 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold text-white mb-4">NFS-e</h3>
                    <p className="text-white/90 mb-4">Nota Fiscal de Serviços</p>
                    <p className="text-white/80 text-sm">
                      Para prestação de serviços. Emitida eletronicamente de acordo
                      com as regras de cada município.
                    </p>
                  </div>
                </ScrollAnimation>
              </div>

              <ScrollAnimation animation="fadeIn" delay={0.8}>
                <div className="mt-12 text-center">
                  <p className="text-xl text-gray-700 mb-6">
                    <span className="text-orange-500 font-bold">Com a Dnotas:</span> Todos os tipos em um serviço único e simples!
                  </p>
                  <button
                    onClick={() => {
                      const form = document.getElementById('lead-form')
                      form?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    COMEÇAR AGORA
                  </button>
                </div>
              </ScrollAnimation>
            </div>
          </section>


          {/* About ELI Section - FUNDO AZUL/ROXO */}
          <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 }}
                className="text-3xl md:text-4xl font-bold text-white text-center mb-8"
              >
                Quem é a Dnotas?
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
              >
                <div className="text-center mb-8">
                  <div className="w-32 h-32 bg-accent-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent-400">Dnotas</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Especialistas em Emissão de Notas Fiscais</h3>
                  <p className="text-xl text-white/90 leading-relaxed">
                    Somos uma empresa especializada em simplificar a emissão de notas fiscais.
                    Nossa missão é eliminar a dor de cabeça administrativa, oferecendo um serviço
                    completo e confiável para todos os tipos de negócio.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-accent-400 mb-2">10+</div>
                    <p className="text-white/80">Anos de Experiência</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent-400 mb-2">300+</div>
                    <p className="text-white/80">Clientes Atendidos</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent-400 mb-2">100%</div>
                    <p className="text-white/80">Taxa de Sucesso</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* O BEM INDISPENSÁVEL - FUNDO BRANCO */}
          <section className="bg-white py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <ScrollAnimation animation="slideUp">
                <div className="bg-gray-100 rounded-3xl p-8 md:p-12 text-center shadow-2xl border-4 border-gray-300">
                  <h2 className="text-3xl md:text-5xl font-bold text-black mb-6 uppercase border-b-4 border-black pb-4">
                    O BEM INDISPENSÁVEL
                  </h2>

                  <div className="space-y-6 text-left">
                    <p className="text-xl md:text-2xl text-black leading-relaxed">
                      Você <span className="font-bold">não pode e não deve</span> correr o risco de ter que pagar multas caríssimas pelo simples ato de <span className="font-bold">não fazer a emissão das notas fiscais das vendas do seu comércio.</span>
                    </p>

                    <p className="text-xl md:text-2xl text-black leading-relaxed">
                      Mas, é por isso que, <span className="font-bold">Eu e a Minha Equipe</span> estará disponível para realizar a entrega das suas obrigações ao <span className="font-bold">SEFAZ</span> (Órgão responsável pelo cruzamento de vendas realizadas no seu comércio).
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </section>

          {/* Single Pricing Plan Section - FUNDO AZUL/ROXO */}
          <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="max-w-2xl mx-auto">
                <ScrollAnimation animation="scaleUp" delay={0.2}>
                  <div className="bg-gradient-to-b from-purple-600/40 to-purple-800/30 border-2 border-accent-500 rounded-3xl p-10 text-center relative hover:bg-purple-700/40 transition-all duration-300 shadow-2xl">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-white text-purple-900 px-6 py-3 rounded-full text-sm font-bold uppercase">
                        OFERTA LIMITADA
                      </span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 mt-4">Pacote Completo de Regularização</h3>

                    <div className="mb-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                      <div className="text-6xl md:text-7xl font-bold text-accent-400 mb-3">R$ 575</div>
                      <p className="text-xl text-white/90 mb-2">Taxa inicial + R$ 375/mês</p>
                      <p className="text-lg text-white/80 font-semibold">Sem contrato de fidelidade</p>
                    </div>

                    <div className="space-y-4 mb-10 text-left bg-white/5 backdrop-blur-sm rounded-2xl p-6">
                      <p className="text-white text-lg flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-accent-400 flex-shrink-0 mt-1" />
                        <span>Garanto a abertura do CNPJ ou regularização completa</span>
                      </p>
                      <p className="text-white text-lg flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-accent-400 flex-shrink-0 mt-1" />
                        <span>Garanto emissão ilimitada de NF-e, NFC-e e NFS-e</span>
                      </p>
                      <p className="text-white text-lg flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-accent-400 flex-shrink-0 mt-1" />
                        <span>Garanto te entregar todas as certidões necessárias</span>
                      </p>
                      <p className="text-white text-lg flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-accent-400 flex-shrink-0 mt-1" />
                        <span>Garanto consultoria fiscal personalizada</span>
                      </p>
                    </div>

                    <div className="mb-8 text-center space-y-2">
                      <p className="text-white text-lg font-bold">Oferta Única e por Tempo Limitado</p>
                      <p className="text-white/90 text-base">
                        Adesão inicial por apenas R$ 575,00 e depois você passa a pagar R$ 375,00 por mês
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const form = document.getElementById('lead-form')
                        form?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-5 px-8 rounded-full text-2xl transition-all duration-300 transform hover:scale-105 mb-6 shadow-xl"
                    >
                      CONTRATAR SERVIÇO AGORA
                    </button>

                    <p className="text-white/80 text-sm flex items-center justify-center gap-4 flex-wrap">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Sem fidelidade
                      </span>
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Garantia 30 dias
                      </span>
                    </p>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </section>



          {/* Guarantee Section - FUNDO BRANCO */}
          <section className="bg-white py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                className="bg-green-100 border-4 border-green-500 rounded-2xl p-8 shadow-xl"
              >
                <Shield className="w-16 h-16 text-green-600 mx-auto mb-6" />
                <h3 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">
                  Garantia de 30 Dias
                </h3>
                <p className="text-xl text-gray-800 leading-relaxed">
                  Se por qualquer motivo você não ficar 100% satisfeito com nosso atendimento
                  nos primeiros 30 dias, devolvemos 100% do seu investimento.
                  <span className="text-green-600 font-bold block mt-2">
                    Sem perguntas, sem burocracia.
                  </span>
                </p>
              </motion.div>
            </div>
          </section>

          {/* Final CTA - Não Deixe para Amanhã - FUNDO AZUL/ROXO */}
          <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 py-16 px-4 text-center">
            <ScrollAnimation animation="scaleUp">
              <div className="bg-white rounded-3xl p-10 md:p-12 max-w-3xl mx-auto shadow-2xl border-4 border-yellow-500">
                <h3 className="text-3xl md:text-4xl font-bold text-black mb-6">
                  Não Deixe para Amanhã!
                </h3>
                <p className="text-gray-800 mb-8 text-xl leading-relaxed">
                  A cada dia que passa, os riscos aumentam. <span className="font-bold text-red-600">Proteja seu negócio</span> agora mesmo e <span className="font-bold">seja uma das 20 empresas a ter nosso serviço garantido ainda hoje.</span>
                </p>
                <button
                  onClick={() => {
                    const form = document.getElementById('lead-form')
                    form?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="bg-black text-white font-bold py-6 px-10 rounded-full text-2xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 mb-6 w-full md:w-auto shadow-xl"
                >
                  QUERO GARANTIR MINHA VAGA AGORA
                </button>
                <div className="flex items-center justify-center gap-6 text-gray-700 text-base flex-wrap">
                  <span className="flex items-center gap-2">
                    🔒 Dados protegidos
                  </span>
                  <span className="flex items-center gap-2">
                    ✅ Atendimento imediato
                  </span>
                  <span className="flex items-center gap-2">
                    📞 Ligamos em até 10 minutos
                  </span>
                </div>
              </div>
            </ScrollAnimation>
          </section>

          {/* WhatsApp Contact Section - FUNDO BRANCO */}
          <section className="bg-white py-16 px-4 text-center">
            <ScrollAnimation animation="slideUp">
              <div className="bg-green-100 border-4 border-green-500 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl">
                <MessageCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ainda está em dúvida se deve ou não garantir os nossos serviços?
                </h3>
                <p className="text-gray-700 mb-6">
                  Fique à vontade para nos chamar no WhatsApp! Nossa equipe está pronta para esclarecer todas as suas dúvidas.
                </p>
                <a
                  href="https://wa.me/5518997900032?text=Olá! Tenho algumas dúvidas sobre os serviços da Dnotas. Podem me ajudar?"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                  onClick={handleWhatsAppFloatingClick}
                >
                  <MessageCircle className="w-6 h-6" />
                  Falar no WhatsApp
                </a>
              </div>
            </ScrollAnimation>
          </section>
        </>
      )}

      {/* Modal de Captura de Lead */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 relative my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Receba Nossos Serviços Exclusivos
            </h2>

            <LeadForm
              className="shadow-none"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/60">
            © 2024 Dnotas Serviços Contábeis. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  )
}
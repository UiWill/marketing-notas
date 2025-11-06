import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, Users, TrendingUp, Clock, Award, FileText, CreditCard, Building, MessageCircle } from 'lucide-react'
import { VideoPlayer } from '@/components/VideoPlayer'
import { LeadForm } from '@/components/LeadForm'
import { ScrollAnimation } from '@/components/ScrollAnimation'
import { trackPageView } from '@/utils/analytics'
import { usePageTracking } from '@/hooks/usePageTracking'

export const LandingPage = () => {
  const [leadId, setLeadId] = useState<string | undefined>(undefined)
  const [showContent, setShowContent] = useState(false)

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
    // Show content and CTA at 11:27 (687 seconds)
    // Track video start only once
    if (time >= 1 && time < 5 && !showContent) {
      updatePageView({ started_video: true })
      trackEvent('video_started')
    }

    // Show CTA button at 11:27
    if (time >= 687 && !showContent) {
      setShowContent(true)
      trackEvent('cta_unlocked', { timestamp: 687 })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-primary-900 to-black">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Emissão de{' '}
            <span className="text-accent-400">Notas Fiscais</span>
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-accent-400 mb-6">
            Simples, Rápida e Segura
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto">
            Se você <span className="text-accent-400 font-bold">fatura mais de R$ 7.000 por mês</span> e precisa{' '}
            <span className="text-accent-400 font-bold">emitir NF-e, NFC-e ou NFS-e</span>, chegou no lugar certo!
          </p>
        </div>
      </header>

      {/* Video Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <VideoPlayer
            url="https://www.youtube.com/watch?v=vmmBD2Rxb9M"
            leadId={leadId}
            onTimeUpdate={handleVideoTimeUpdate}
            showControlsAfter={687} // Show controls at 11:27 (687 seconds)
            className="aspect-video w-full"
          />
        </div>
      </section>

      {/* CTA Button and Content - Only appears at 11:27 */}
      {showContent && (
        <>
          <section className="container mx-auto px-4 py-8">
            <LeadForm
              onSubmitSuccess={handleLeadSubmit}
              className="max-w-lg mx-auto"
            />
          </section>

          {/* Additional content after CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-16"
        >
          {/* Social Proof */}
          <section className="text-center mb-16">
            <ScrollAnimation animation="slideUp" delay={0.2}>
              <h2 className="text-3xl md:text-4xl text-white font-bold mb-4">
                Já são mais de <span className="text-accent-400">300 clientes</span> que confiaram na Dnotas
              </h2>
            </ScrollAnimation>

            <ScrollAnimation animation="slideUp" delay={0.4}>
              <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
                E hoje emitem suas notas fiscais sem erro, sem complicação e com total conformidade fiscal
              </p>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <ScrollAnimation animation="slideUp" delay={0.6}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <Users className="w-12 h-12 text-accent-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">300+ Clientes</h3>
                  <p className="text-white/80">Empresários que já simplificaram sua emissão de notas</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animation="slideUp" delay={0.8}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <Shield className="w-12 h-12 text-accent-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">100% Digital</h3>
                  <p className="text-white/80">Emissão online de NF-e, NFC-e e NFS-e</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animation="slideUp" delay={1.0}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <TrendingUp className="w-12 h-12 text-accent-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Sem Erros</h3>
                  <p className="text-white/80">Sistema automatizado e validado pela Receita</p>
                </div>
              </ScrollAnimation>
            </div>
          </section>

          {/* Problem Agitation Section */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <ScrollAnimation animation="slideUp">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                  Você Sabia Que Emitir Notas Fiscais Erradas Pode Te Custar Caro?
                </h2>
              </ScrollAnimation>

              <ScrollAnimation animation="scaleUp" delay={0.3}>
                <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 mb-8 hover:bg-red-900/30 transition-all duration-300">
                <h3 className="text-2xl font-bold text-red-400 mb-6">
                  ⚠️ ATENÇÃO: Problemas com Notas Fiscais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-4">
                    <p className="text-white flex items-start gap-3">
                      <span className="text-red-400 text-xl">•</span>
                      <span>Notas fiscais rejeitadas por erro de preenchimento</span>
                    </p>
                    <p className="text-white flex items-start gap-3">
                      <span className="text-red-400 text-xl">•</span>
                      <span>Perda de tempo com sistemas complicados</span>
                    </p>
                    <p className="text-white flex items-start gap-3">
                      <span className="text-red-400 text-xl">•</span>
                      <span>Multas por emissão fora do prazo</span>
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-white flex items-start gap-3">
                      <span className="text-red-400 text-xl">•</span>
                      <span>Problemas de integração com sistemas</span>
                    </p>
                    <p className="text-white flex items-start gap-3">
                      <span className="text-red-400 text-xl">•</span>
                      <span>Dificuldade para acompanhar o status das notas</span>
                    </p>
                    <p className="text-white flex items-start gap-3">
                      <span className="text-red-400 text-xl">•</span>
                      <span>Custos altos com sistemas complexos</span>
                    </p>
                  </div>
                </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeIn" delay={0.6}>
                <p className="text-xl text-white/90">
                  <span className="text-accent-400 font-bold">A boa notícia é:</span> você pode emitir suas notas fiscais de forma simples e automatizada!
                </p>
              </ScrollAnimation>
            </div>
          </section>

          {/* Solution Section */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-3xl md:text-4xl font-bold text-white mb-8"
              >
                Como a Dnotas Simplifica Sua Emissão de Notas
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    icon: CheckCircle,
                    title: 'Emissão Automática',
                    description: 'NF-e, NFC-e e NFS-e emitidas automaticamente sem complicação'
                  },
                  {
                    icon: Shield,
                    title: 'Validação Garantida',
                    description: 'Sistema validado pela Receita Federal, sem riscos de rejeição'
                  },
                  {
                    icon: Clock,
                    title: 'Rapidez na Emissão',
                    description: 'Emita suas notas em segundos, não em horas'
                  },
                  {
                    icon: Award,
                    title: 'Suporte Especializado',
                    description: 'Equipe experiente para te ajudar em qualquer dúvida'
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-start gap-4"
                  >
                    <benefit.icon className="w-8 h-8 text-accent-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
                      <p className="text-white/80">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Types of Invoices Section */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <ScrollAnimation animation="slideUp">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                  Todos os Tipos de Notas Fiscais em Um Só Lugar
                </h2>
              </ScrollAnimation>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ScrollAnimation animation="slideUp" delay={0.2}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/10 hover:border-accent-500/30 transition-all duration-300 group">
                    <FileText className="w-16 h-16 text-accent-500 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold text-white mb-4">NF-e</h3>
                    <p className="text-white/90 mb-4">Nota Fiscal Eletrônica</p>
                    <p className="text-white/80 text-sm">
                      Para vendas de produtos entre empresas (B2B) e para consumidores finais.
                      Substitui a nota fiscal em papel.
                    </p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation animation="slideUp" delay={0.4}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/10 hover:border-accent-500/30 transition-all duration-300 group">
                    <CreditCard className="w-16 h-16 text-accent-500 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold text-white mb-4">NFC-e</h3>
                    <p className="text-white/90 mb-4">Nota Fiscal do Consumidor</p>
                    <p className="text-white/80 text-sm">
                      Para vendas diretas ao consumidor final. Substitui o cupom fiscal
                      e pode ser enviada por e-mail ou SMS.
                    </p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation animation="slideUp" delay={0.6}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/10 hover:border-accent-500/30 transition-all duration-300 group">
                    <Building className="w-16 h-16 text-accent-500 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
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
                  <p className="text-xl text-white/90">
                    <span className="text-accent-400 font-bold">Com a Dnotas:</span> Todos os tipos em uma plataforma única e simples!
                  </p>
                </div>
              </ScrollAnimation>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
              >
                Veja o Que Nossos Clientes Dizem
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    name: 'Maria Silva',
                    business: 'Loja de Roupas',
                    text: 'Antes eu perdia horas tentando emitir notas fiscais. Com a Dnotas, em segundos está tudo pronto! Sistema muito fácil.',
                    rating: 5
                  },
                  {
                    name: 'João Santos',
                    business: 'Restaurante',
                    text: 'Emito NFC-e para meus clientes sem dor de cabeça. O sistema nunca falha e o suporte é excelente. Recomendo!',
                    rating: 5
                  },
                  {
                    name: 'Ana Costa',
                    business: 'Consultoria',
                    text: 'Como presto serviços, preciso de NFS-e. A Dnotas integra com todos os municípios. Nunca mais tive nota rejeitada!',
                    rating: 5
                  }
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                  >
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    <p className="text-white/90 mb-4 italic">"{testimonial.text}"</p>
                    <div className="border-t border-white/20 pt-4">
                      <p className="text-accent-400 font-bold">{testimonial.name}</p>
                      <p className="text-white/60 text-sm">{testimonial.business}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* About ELI Section */}
          <section className="mb-16">
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
                    Somos uma startup digital especializada em simplificar a emissão de notas fiscais.
                    Nossa missão é eliminar a dor de cabeça administrativa, oferecendo uma plataforma
                    intuitiva e confiável para todos os tipos de negócio.
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

          {/* Pricing Plans Section */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <ScrollAnimation animation="slideUp">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                  Escolha o Plano Ideal Para Seu Negócio
                </h2>
              </ScrollAnimation>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Basic Plan */}
                <ScrollAnimation animation="slideLeft" delay={0.2}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <h3 className="text-2xl font-bold text-white mb-4">Emissão de Notas Fiscais</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-accent-500">R$ 125</span>
                      <span className="text-white/80">/mês</span>
                    </div>
                    <div className="space-y-3 mb-8">
                      <p className="text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                        Pacote básico
                      </p>
                      <p className="text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                        Emissão de até 4 notas fiscais
                      </p>
                      <p className="text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                        R$ 20,00 por cada nota fiscal adicional
                      </p>
                      <div className="mt-6">
                        <p className="text-white font-bold mb-2">Taxa de Adesão</p>
                        <p className="text-white flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                          Licença de Adesão
                        </p>
                        <p className="text-white flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                          Preço: R$ 125,00 (única vez)
                        </p>
                      </div>
                    </div>
                    <button className="w-full bg-accent-500 hover:bg-white hover:text-black text-black font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
                      Começar Agora
                    </button>
                  </div>
                </ScrollAnimation>

                {/* Complete Plan */}
                <ScrollAnimation animation="slideRight" delay={0.4}>
                  <div className="bg-gradient-to-b from-white/10 to-white/5 border-2 border-accent-500 rounded-2xl p-8 text-center relative hover:bg-white/15 transition-all duration-300">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                        MAIS POPULAR
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Serviço Completo de BPO Fiscal</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-accent-500">R$ 375</span>
                      <span className="text-white/80">/mês</span>
                    </div>
                    <div className="space-y-3 mb-8">
                      <p className="text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                        Pacote Completo
                      </p>
                      <p className="text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                        Emissão ilimitada de notas fiscais
                      </p>
                      <p className="text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                        Serviço completo de terceirização de processos fiscais
                      </p>
                      <p className="text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                        Garantindo conformidade e eficiência nos processos tributários
                      </p>
                      <div className="mt-6">
                        <p className="text-white font-bold mb-2">Taxa de Adesão</p>
                        <p className="text-white flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                          Licença de Adesão
                        </p>
                        <p className="text-white flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                          Preço: R$ 525,00 (única vez)
                        </p>
                      </div>
                    </div>
                    <button className="w-full bg-accent-500 hover:bg-white hover:text-black text-black font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
                      Quero Este Plano
                    </button>
                  </div>
                </ScrollAnimation>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4 }}
                className="mt-8 text-center"
              >
                <p className="text-white/90">
                  💳 Sem taxas de setup • 🔄 Cancele quando quiser • 📞 Suporte especializado
                </p>
              </motion.div>
            </div>
          </section>

          {/* Urgency and Scarcity Section */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 }}
                className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500/50 rounded-2xl p-8 text-center"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-red-400 mb-6">
                  ⏰ TEMPO LIMITADO
                </h3>
                <p className="text-2xl font-bold text-white mb-4">
                  Regularização Express por apenas
                </p>
                <div className="mb-6">
                  <span className="text-lg text-white/60 line-through">De R$ 2.997</span>
                  <span className="text-4xl font-bold text-accent-400 block">
                    Por R$ 997
                  </span>
                  <span className="text-lg text-white/80">ou 12x de R$ 83,08</span>
                </div>
                <div className="bg-red-900/40 rounded-xl p-4 mb-6">
                  <p className="text-white font-bold mb-2">⚠️ ATENÇÃO:</p>
                  <p className="text-white/90">
                    Estamos atendendo apenas <span className="text-accent-400 font-bold">10 novos clientes por mês</span> para
                    garantir a qualidade do atendimento. Restam apenas <span className="text-red-400 font-bold">3 vagas</span> para este mês!
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* What's Included Section */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.3 }}
                className="text-3xl md:text-4xl font-bold text-white text-center mb-8"
              >
                O Que Está Incluso no Serviço
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    'Abertura de CNPJ ou regularização completa',
                    'Emissão de todas as certidões necessárias',
                    'Configuração do sistema de notas fiscais',
                    'Treinamento completo da equipe',
                    'Consultoria fiscal personalizada',
                    'Suporte durante todo o processo',
                    'Garantia de conformidade legal',
                    'Acompanhamento pós-regularização'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-accent-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-accent-500/20 rounded-xl border border-accent-400/30">
                  <p className="text-center text-white font-bold text-xl mb-2">
                    BÔNUS EXCLUSIVO
                  </p>
                  <p className="text-center text-white/90">
                    Consultoria tributária gratuita por <span className="text-accent-400 font-bold">3 meses</span>
                    para otimizar seus impostos (Valor: R$ 897)
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Guarantee Section */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8"
              >
                <Shield className="w-16 h-16 text-green-400 mx-auto mb-6" />
                <h3 className="text-2xl md:text-3xl font-bold text-green-400 mb-4">
                  Garantia de 30 Dias
                </h3>
                <p className="text-xl text-white/90 leading-relaxed">
                  Se por qualquer motivo você não ficar 100% satisfeito com nosso atendimento
                  nos primeiros 30 dias, devolvemos 100% do seu investimento.
                  <span className="text-green-400 font-bold block mt-2">
                    Sem perguntas, sem burocracia.
                  </span>
                </p>
              </motion.div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center mb-16">
            <ScrollAnimation animation="scaleUp">
              <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl">
                <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">
                  Não Deixe para Amanhã!
                </h3>
                <p className="text-gray-700 mb-6 text-lg">
                  A cada dia que passa, os riscos aumentam. Proteja seu negócio agora mesmo
                  e garante uma das últimas vagas deste mês.
                </p>
                <button className="bg-black text-white font-bold py-4 px-8 rounded-full text-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 mb-4">
                  QUERO GARANTIR MINHA VAGA AGORA
                </button>
                <p className="text-gray-600 text-sm">
                  🔒 Dados protegidos | ✅ Atendimento imediato | 📞 Ligamos em até 10 minutos
                </p>
              </div>
            </ScrollAnimation>
          </section>
        </motion.div>
        </>
      )}

      {/* Footer */}
      <footer className="bg-black/20 mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/60">
            © 2024 Dnotas Serviços Contábeis. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <a
          href="https://wa.me/5518997900032?text=Olá! Gostaria de saber mais sobre os planos da Dnotas para emissão de notas fiscais."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Falar no WhatsApp"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </a>
      </motion.div>
    </div>
  )
}
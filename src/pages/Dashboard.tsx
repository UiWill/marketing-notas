import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, TrendingUp, PlayCircle, Target, Eye, Clock, Phone, Mail, DollarSign, MousePointer, FileCheck, Globe } from 'lucide-react'
import type { Lead, AnalyticsData, ConversionFunnel, TrafficSource } from '@/types'

export const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel | null>(null)
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (leadsError) throw leadsError

      setLeads(leadsData || [])

      // Fetch conversion funnel
      const { data: funnelData, error: funnelError } = await supabase
        .from('conversion_funnel')
        .select('*')
        .single()

      if (!funnelError && funnelData) {
        setConversionFunnel(funnelData)
      }

      // Fetch traffic sources
      const { data: trafficData, error: trafficError } = await supabase
        .from('traffic_sources')
        .select('*')
        .limit(10)

      if (!trafficError && trafficData) {
        setTrafficSources(trafficData)
      }

      // Calculate analytics
      const totalLeads = leadsData?.length || 0
      const conversions = leadsData?.filter(lead => lead.conversion_stage === 'converted').length || 0

      const avgCompletion = totalLeads > 0
        ? leadsData.reduce((sum, lead) => sum + lead.video_progress, 0) / totalLeads
        : 0

      const sourceCount = leadsData?.reduce((acc, lead) => {
        acc[lead.source] = (acc[lead.source] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const revenueBySegment = leadsData?.reduce((acc, lead) => {
        const segment = lead.revenue >= 50000 ? 'Alto (50k+)' :
                      lead.revenue >= 20000 ? 'Médio (20k-50k)' :
                      'Baixo (7k-20k)'
        acc[segment] = (acc[segment] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      // Calculate visitor metrics
      const totalVisitors = funnelData?.total_visitors || 0
      const videoStartRate = totalVisitors > 0
        ? ((funnelData?.video_started || 0) / totalVisitors) * 100
        : 0
      const ctaClickRate = totalVisitors > 0
        ? ((funnelData?.cta_clicked || 0) / totalVisitors) * 100
        : 0
      const formCompletionRate = totalVisitors > 0
        ? ((funnelData?.form_submitted || 0) / totalVisitors) * 100
        : 0

      setAnalytics({
        totalLeads,
        conversionRate: totalLeads > 0 ? (conversions / totalLeads) * 100 : 0,
        averageVideoCompletion: avgCompletion * 100,
        topDropOffPoints: [], // Would need video events data
        leadsBySource: sourceCount,
        revenueBySegment,
        totalVisitors,
        videoStartRate,
        ctaClickRate,
        formCompletionRate,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'bg-yellow-100 text-yellow-800'
      case 'qualified': return 'bg-blue-100 text-blue-800'
      case 'converted': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'lead': return 'Lead'
      case 'qualified': return 'Qualificado'
      case 'converted': return 'Convertido'
      default: return stage
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Marketing - Dnotas</h1>
          <p className="text-gray-600">Acompanhe o desempenho da sua campanha em tempo real</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Visitor Metrics - New Row */}
        {analytics && analytics.totalVisitors && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center">
                <Globe className="h-8 w-8 opacity-80" />
                <div className="ml-4">
                  <p className="text-sm font-medium opacity-90">Visitantes Únicos</p>
                  <p className="text-2xl font-bold">{analytics.totalVisitors}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center">
                <PlayCircle className="h-8 w-8 opacity-80" />
                <div className="ml-4">
                  <p className="text-sm font-medium opacity-90">Taxa de Visualização do Vídeo</p>
                  <p className="text-2xl font-bold">{analytics.videoStartRate?.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center">
                <MousePointer className="h-8 w-8 opacity-80" />
                <div className="ml-4">
                  <p className="text-sm font-medium opacity-90">Taxa de Clique no CTA</p>
                  <p className="text-2xl font-bold">{analytics.ctaClickRate?.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center">
                <FileCheck className="h-8 w-8 opacity-80" />
                <div className="ml-4">
                  <p className="text-sm font-medium opacity-90">Taxa de Conversão de Formulário</p>
                  <p className="text-2xl font-bold">{analytics.formCompletionRate?.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalLeads}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <PlayCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Conclusão Média do Vídeo</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.averageVideoCompletion.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-accent-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Potencial de Receita</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(leads.reduce((sum, lead) => sum + lead.revenue, 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversion Funnel */}
        {conversionFunnel && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Funil de Conversão</h3>
            <div className="space-y-4">
              {/* Visitors */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Visitantes Únicos</span>
                  <span className="text-gray-900 font-bold">{conversionFunnel.total_visitors}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div className="bg-blue-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ width: '100%' }}>
                    100%
                  </div>
                </div>
              </div>

              {/* Video Started */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Iniciaram o Vídeo</span>
                  <span className="text-gray-900 font-bold">{conversionFunnel.video_started}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div
                    className="bg-purple-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${(conversionFunnel.video_started / conversionFunnel.total_visitors) * 100}%` }}
                  >
                    {((conversionFunnel.video_started / conversionFunnel.total_visitors) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* CTA Clicked */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Clicaram no CTA</span>
                  <span className="text-gray-900 font-bold">{conversionFunnel.cta_clicked}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div
                    className="bg-orange-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${(conversionFunnel.cta_clicked / conversionFunnel.total_visitors) * 100}%` }}
                  >
                    {((conversionFunnel.cta_clicked / conversionFunnel.total_visitors) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Form Submitted */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Preencheram o Formulário</span>
                  <span className="text-gray-900 font-bold">{conversionFunnel.form_submitted}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div
                    className="bg-green-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${(conversionFunnel.form_submitted / conversionFunnel.total_visitors) * 100}%` }}
                  >
                    {((conversionFunnel.form_submitted / conversionFunnel.total_visitors) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Converted */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Converteram</span>
                  <span className="text-gray-900 font-bold">{conversionFunnel.converted}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div
                    className="bg-emerald-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${(conversionFunnel.converted / conversionFunnel.total_visitors) * 100}%` }}
                  >
                    {((conversionFunnel.converted / conversionFunnel.total_visitors) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Sources */}
          {trafficSources.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Fontes de Tráfego</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Fonte</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">Sessões</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">Conv.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trafficSources.map((source, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3">
                          <div>
                            <div className="font-medium text-gray-900">{source.source}</div>
                            <div className="text-xs text-gray-500">{source.medium} / {source.campaign}</div>
                          </div>
                        </td>
                        <td className="text-right font-semibold text-gray-900">{source.sessions}</td>
                        <td className="text-right font-semibold text-green-600">{source.conversions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Leads by Source */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Leads por Fonte</h3>
            <div className="space-y-3">
              {analytics && Object.entries(analytics.leadsBySource).map(([source, count]) => (
                <div key={source} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{source}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Segments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Segmentos de Faturamento</h3>
            <div className="space-y-3">
              {analytics && Object.entries(analytics.revenueBySegment).map(([segment, count]) => (
                <div key={segment} className="flex justify-between items-center">
                  <span className="text-gray-600">{segment}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Leads Recentes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faturamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progresso do Vídeo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {formatCurrency(lead.revenue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${lead.video_progress * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {(lead.video_progress * 100).toFixed(0)}%
                        </span>
                      </div>
                      {lead.video_completed && (
                        <div className="text-xs text-green-600 mt-1">✓ Completou</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(lead.conversion_stage)}`}>
                        {getStageLabel(lead.conversion_stage)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(lead.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-primary-600 hover:text-primary-900 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Detalhes do Lead</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <p className="text-gray-900">{selectedLead.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{selectedLead.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <p className="text-gray-900">{selectedLead.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Faturamento Mensal</label>
                <p className="text-gray-900">{formatCurrency(selectedLead.revenue)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Progresso do Vídeo</label>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${selectedLead.video_progress * 100}%` }}
                    />
                  </div>
                  <span>{(selectedLead.video_progress * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(selectedLead.conversion_stage)}`}>
                  {getStageLabel(selectedLead.conversion_stage)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Cadastro</label>
                <p className="text-gray-900">{formatDate(selectedLead.created_at)}</p>
              </div>
              {selectedLead.utm_source && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fonte UTM</label>
                  <p className="text-gray-900">
                    {selectedLead.utm_source} / {selectedLead.utm_medium} / {selectedLead.utm_campaign}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
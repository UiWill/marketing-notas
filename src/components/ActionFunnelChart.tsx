import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { GitBranch, ArrowRight } from 'lucide-react'

interface FunnelTransition {
  previous_event: string
  next_event: string
  transition_count: number
  unique_sessions: number
  avg_time_between_events: number
}

export const ActionFunnelChart = () => {
  const [funnelData, setFunnelData] = useState<FunnelTransition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFunnelData()
  }, [])

  const fetchFunnelData = async () => {
    try {
      const { data, error } = await supabase
        .from('action_funnel')
        .select('*')
        .limit(15)

      if (error) throw error
      setFunnelData(data || [])
    } catch (error) {
      console.error('Erro ao buscar dados de funil:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatEventName = (eventName: string) => {
    const eventMap: Record<string, string> = {
      'video_started': 'Iniciou Vídeo',
      'cta_clicked': 'Clicou CTA',
      'form_submitted': 'Enviou Formulário',
      'section_viewed_testimonials': 'Viu Depoimentos',
      'section_viewed_pricing': 'Viu Preços',
      'section_viewed_benefits': 'Viu Benefícios',
      'section_viewed_comparison': 'Viu Comparação',
      'section_viewed_guarantee': 'Viu Garantia',
      'pricing_cta_clicked': 'CTA Preço',
      'whatsapp_click': 'WhatsApp',
    }
    return eventMap[eventName] || eventName
  }

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '-'
    if (seconds < 60) return `${Math.round(seconds)}s`
    const minutes = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${minutes}m ${secs}s`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (funnelData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Funil de Ações Sequenciais</h3>
        <div className="text-center py-8 text-gray-500">
          Nenhum dado de sequência de ações disponível ainda
        </div>
      </div>
    )
  }

  // Agrupa por evento anterior para criar fluxos
  const topTransitions = funnelData.slice(0, 10)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <GitBranch className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-medium text-gray-900">Funil de Ações Sequenciais</h3>
      </div>

      <div className="space-y-3">
        {topTransitions.map((transition, index) => {
          const maxCount = topTransitions[0].transition_count
          const percentage = (transition.transition_count / maxCount) * 100

          return (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {formatEventName(transition.previous_event)}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {formatEventName(transition.next_event)}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-gray-900">
                    {transition.transition_count}
                  </div>
                  <div className="text-xs text-gray-600">
                    {transition.unique_sessions} sessões
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 font-medium w-12 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>

              <div className="text-xs text-gray-500">
                Tempo médio entre ações: {formatTime(transition.avg_time_between_events)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Insights */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-medium text-gray-900 mb-3">💡 Insights</h4>
        <div className="space-y-2 text-sm text-gray-700">
          {topTransitions[0] && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="font-medium">Sequência mais comum:</span>{' '}
              {formatEventName(topTransitions[0].previous_event)} → {formatEventName(topTransitions[0].next_event)}
              {' '}({topTransitions[0].transition_count} vezes)
            </div>
          )}

          {/* Encontra a transição mais rápida */}
          {(() => {
            const fastestTransition = topTransitions.reduce((min, t) =>
              t.avg_time_between_events < min.avg_time_between_events ? t : min
            , topTransitions[0])

            return (
              <div className="bg-green-50 p-3 rounded-lg">
                <span className="font-medium">Transição mais rápida:</span>{' '}
                {formatEventName(fastestTransition.previous_event)} → {formatEventName(fastestTransition.next_event)}
                {' '}({formatTime(fastestTransition.avg_time_between_events)})
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

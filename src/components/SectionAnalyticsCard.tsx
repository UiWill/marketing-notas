import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Eye, Clock, TrendingUp } from 'lucide-react'

interface SectionAnalytics {
  total_views: number
  hero_views: number
  video_views: number
  testimonials_views: number
  benefits_views: number
  comparison_views: number
  pricing_views: number
  guarantee_views: number
  avg_time_hero: number
  avg_time_video: number
  avg_time_testimonials: number
  avg_time_benefits: number
  avg_time_comparison: number
  avg_time_pricing: number
  avg_time_guarantee: number
  testimonials_conversion_rate: number
  pricing_conversion_rate: number
}

export const SectionAnalyticsCard = () => {
  const [analytics, setAnalytics] = useState<SectionAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSectionAnalytics()
  }, [])

  const fetchSectionAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('section_analytics')
        .select('*')
        .single()

      if (error) throw error
      setAnalytics(data)
    } catch (error) {
      console.error('Erro ao buscar analytics de seções:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics || analytics.total_views === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Análise de Seções</h3>
        <div className="text-center py-8 text-gray-500">
          Nenhum dado disponível ainda
        </div>
      </div>
    )
  }

  const sections = [
    { name: 'Hero', views: analytics.hero_views, time: analytics.avg_time_hero, icon: '🎯' },
    { name: 'Vídeo', views: analytics.video_views, time: analytics.avg_time_video, icon: '🎬' },
    { name: 'Depoimentos', views: analytics.testimonials_views, time: analytics.avg_time_testimonials, icon: '💬', conversionRate: analytics.testimonials_conversion_rate },
    { name: 'Benefícios', views: analytics.benefits_views, time: analytics.avg_time_benefits, icon: '✨' },
    { name: 'Comparação', views: analytics.comparison_views, time: analytics.avg_time_comparison, icon: '⚖️' },
    { name: 'Preços', views: analytics.pricing_views, time: analytics.avg_time_pricing, icon: '💰', conversionRate: analytics.pricing_conversion_rate },
    { name: 'Garantia', views: analytics.guarantee_views, time: analytics.avg_time_guarantee, icon: '🛡️' },
  ]

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const minutes = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${minutes}m ${secs}s`
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Análise de Seções da Página</h3>

      <div className="space-y-4">
        {sections.map((section, index) => {
          const viewRate = analytics.total_views > 0
            ? (section.views / analytics.total_views) * 100
            : 0

          return (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{section.icon}</span>
                  <span className="font-medium text-gray-900">{section.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-600">
                    <Eye className="w-4 h-4" />
                    {section.views} ({viewRate.toFixed(1)}%)
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    {formatTime(section.time)}
                  </span>
                  {section.conversionRate !== undefined && (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <TrendingUp className="w-4 h-4" />
                      {section.conversionRate?.toFixed(1)}% conv.
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${viewRate}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Seção Mais Vista</div>
            <div className="text-lg font-bold text-blue-600">
              {sections.reduce((max, s) => s.views > max.views ? s : max, sections[0]).name}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Maior Tempo Médio</div>
            <div className="text-lg font-bold text-purple-600">
              {formatTime(Math.max(...sections.map(s => s.time)))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AlertTriangle } from 'lucide-react'

interface DropoffData {
  time_range: string
  dropoff_count: number
  avg_completion_percentage: number
}

export const VideoDropoffChart = () => {
  const [dropoffData, setDropoffData] = useState<DropoffData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDropoffData()
  }, [])

  const fetchDropoffData = async () => {
    try {
      const { data, error } = await supabase
        .from('video_dropoff_analysis')
        .select('*')

      if (error) throw error
      setDropoffData(data || [])
    } catch (error) {
      console.error('Erro ao buscar dados de drop-off:', error)
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

  if (dropoffData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Análise de Drop-off do Vídeo</h3>
        <div className="text-center py-8 text-gray-500">
          Nenhum dado de drop-off disponível ainda
        </div>
      </div>
    )
  }

  const totalDropoffs = dropoffData.reduce((sum, d) => sum + d.dropoff_count, 0)
  const maxDropoffs = Math.max(...dropoffData.map(d => d.dropoff_count))

  // Encontra o período com mais drop-offs
  const criticalPeriod = dropoffData.reduce((max, d) =>
    d.dropoff_count > max.dropoff_count ? d : max
  , dropoffData[0])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-6 h-6 text-orange-600" />
        <h3 className="text-lg font-medium text-gray-900">Análise de Drop-off do Vídeo</h3>
      </div>

      {/* Critical Alert */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 mr-2" />
          <div>
            <p className="text-sm font-medium text-orange-800">
              Período crítico: {criticalPeriod.time_range}
            </p>
            <p className="text-sm text-orange-700">
              {criticalPeriod.dropoff_count} viewers abandonaram o vídeo neste período
              ({((criticalPeriod.dropoff_count / totalDropoffs) * 100).toFixed(1)}% dos drop-offs)
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {dropoffData.map((data, index) => {
          const percentage = totalDropoffs > 0
            ? (data.dropoff_count / totalDropoffs) * 100
            : 0
          const barWidth = maxDropoffs > 0
            ? (data.dropoff_count / maxDropoffs) * 100
            : 0

          // Determina a cor baseado na severidade
          const getColor = () => {
            if (data.dropoff_count === maxDropoffs) return 'bg-red-500'
            if (percentage > 20) return 'bg-orange-500'
            if (percentage > 10) return 'bg-yellow-500'
            return 'bg-blue-500'
          }

          const getTextColor = () => {
            if (data.dropoff_count === maxDropoffs) return 'text-red-600'
            if (percentage > 20) return 'text-orange-600'
            if (percentage > 10) return 'text-yellow-600'
            return 'text-blue-600'
          }

          return (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-medium text-gray-900">{data.time_range}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({data.avg_completion_percentage.toFixed(1)}% do vídeo)
                  </span>
                </div>
                <div className={`font-bold ${getTextColor()}`}>
                  {data.dropoff_count} drop-offs
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${getColor()} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{totalDropoffs}</div>
          <div className="text-sm text-gray-600">Total Drop-offs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {criticalPeriod.time_range}
          </div>
          <div className="text-sm text-gray-600">Período Crítico</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {dropoffData.length > 0
              ? (dropoffData.reduce((sum, d) => sum + d.avg_completion_percentage, 0) / dropoffData.length).toFixed(1)
              : 0}%
          </div>
          <div className="text-sm text-gray-600">Conclusão Média</div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-medium text-gray-900 mb-3">💡 Recomendações</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              Revise o conteúdo no período {criticalPeriod.time_range} para identificar possíveis melhorias
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              Considere adicionar elementos visuais ou hooks mais fortes nos primeiros momentos
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              Teste diferentes abordagens no período crítico com testes A/B
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PlayCircle, TrendingDown } from 'lucide-react'

interface RetentionData {
  minute: number
  viewers: number
  dropoffs: number
  avg_percentage: number
}

export const VideoRetentionChart = () => {
  const [retentionData, setRetentionData] = useState<RetentionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRetentionData()
  }, [])

  const fetchRetentionData = async () => {
    try {
      const { data, error } = await supabase
        .from('video_retention_by_minute')
        .select('*')
        .order('minute', { ascending: true })

      if (error) throw error
      setRetentionData(data || [])
    } catch (error) {
      console.error('Erro ao buscar dados de retenção:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const maxViewers = Math.max(...retentionData.map(d => d.viewers), 1)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PlayCircle className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Retenção do Vídeo por Minuto</h3>
        </div>
        <div className="text-sm text-gray-600">
          Total: {retentionData.length > 0 ? retentionData[0].viewers : 0} visualizações
        </div>
      </div>

      {retentionData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum dado de retenção disponível ainda
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {retentionData.map((data) => {
              const retentionRate = maxViewers > 0 ? (data.viewers / maxViewers) * 100 : 0

              return (
                <div key={data.minute} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      Minuto {data.minute}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">
                        {data.viewers} viewers ({retentionRate.toFixed(1)}%)
                      </span>
                      {data.dropoffs > 0 && (
                        <span className="text-red-600 flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          {data.dropoffs} drop-offs
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-300 flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${retentionRate}%` }}
                      >
                        {retentionRate > 15 && `${retentionRate.toFixed(0)}%`}
                      </div>
                    </div>
                    {data.dropoffs > 0 && (
                      <div
                        className="bg-red-500 rounded-full h-6 px-2 flex items-center justify-center text-xs text-white font-medium"
                        style={{ minWidth: '40px' }}
                      >
                        -{data.dropoffs}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {retentionData[0]?.viewers || 0}
              </div>
              <div className="text-sm text-gray-600">Iniciaram</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {retentionData[retentionData.length - 1]?.viewers || 0}
              </div>
              <div className="text-sm text-gray-600">Completaram</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {retentionData.reduce((sum, d) => sum + d.dropoffs, 0)}
              </div>
              <div className="text-sm text-gray-600">Drop-offs Totais</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface GoogleAnalyticsData {
  activeUsers?: number
  sessions?: any[]
  pageviews?: any[]
  trafficSources?: any[]
  devices?: any[]
  locations?: any[]
}

export const useGoogleAnalytics = (type: 'realtime' | 'sessions' | 'pageviews' | 'traffic_sources' | 'devices' | 'locations', options?: {
  startDate?: string
  endDate?: string
  refreshInterval?: number
}) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: functionData, error: functionError } = await supabase.functions.invoke('google-analytics', {
        body: {
          type,
          startDate: options?.startDate || '30daysAgo',
          endDate: options?.endDate || 'today',
        },
      })

      if (functionError) throw functionError

      setData(functionData)
    } catch (err: any) {
      console.error('Error fetching Google Analytics data:', err)
      setError(err.message || 'Failed to fetch Google Analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Auto-refresh if interval is specified
    if (options?.refreshInterval) {
      const interval = setInterval(fetchData, options.refreshInterval)
      return () => clearInterval(interval)
    }
  }, [type, options?.startDate, options?.endDate])

  return { data, loading, error, refetch: fetchData }
}

// Hook específico para dados em tempo real
export const useGoogleAnalyticsRealtime = (refreshInterval: number = 60000) => {
  return useGoogleAnalytics('realtime', { refreshInterval })
}

// Hook específico para sessões
export const useGoogleAnalyticsSessions = (startDate: string = '30daysAgo', endDate: string = 'today') => {
  return useGoogleAnalytics('sessions', { startDate, endDate })
}

// Hook específico para visualizações de página
export const useGoogleAnalyticsPageviews = (startDate: string = '7daysAgo', endDate: string = 'today') => {
  return useGoogleAnalytics('pageviews', { startDate, endDate })
}

// Hook específico para fontes de tráfego
export const useGoogleAnalyticsTrafficSources = (startDate: string = '30daysAgo', endDate: string = 'today') => {
  return useGoogleAnalytics('traffic_sources', { startDate, endDate })
}

// Hook específico para dispositivos
export const useGoogleAnalyticsDevices = (startDate: string = '30daysAgo', endDate: string = 'today') => {
  return useGoogleAnalytics('devices', { startDate, endDate })
}

// Hook específico para localizações
export const useGoogleAnalyticsLocations = (startDate: string = '30daysAgo', endDate: string = 'today') => {
  return useGoogleAnalytics('locations', { startDate, endDate })
}

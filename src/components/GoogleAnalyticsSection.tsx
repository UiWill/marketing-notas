import { useState } from 'react'
import { Activity, Users, Eye, TrendingUp, Smartphone, MapPin, Calendar } from 'lucide-react'
import {
  useGoogleAnalyticsRealtime,
  useGoogleAnalyticsSessions,
  useGoogleAnalyticsPageviews,
  useGoogleAnalyticsTrafficSources,
  useGoogleAnalyticsDevices,
  useGoogleAnalyticsLocations
} from '@/hooks/useGoogleAnalytics'

type DateRange = {
  startDate: string
  endDate: string
  label: string
}

const DATE_RANGES: Record<string, DateRange> = {
  today: { startDate: 'today', endDate: 'today', label: 'Hoje' },
  yesterday: { startDate: 'yesterday', endDate: 'yesterday', label: 'Ontem' },
  last7days: { startDate: '7daysAgo', endDate: 'today', label: 'Últimos 7 dias' },
  last30days: { startDate: '30daysAgo', endDate: 'today', label: 'Últimos 30 dias' },
  thisMonth: { startDate: '1monthAgo', endDate: 'today', label: 'Este mês' },
  allTime: { startDate: '2020-01-01', endDate: 'today', label: 'Todo o período' },
}

export const GoogleAnalyticsSection = () => {
  const [selectedRange, setSelectedRange] = useState<string>('last7days')
  const dateRange = DATE_RANGES[selectedRange]

  // Fetch real-time data (updates every minute)
  const { data: realtimeData, loading: realtimeLoading } = useGoogleAnalyticsRealtime(60000)

  // Fetch sessions data with selected date range
  const { data: sessionsData, loading: sessionsLoading } = useGoogleAnalyticsSessions(dateRange.startDate, dateRange.endDate)

  // Fetch pageviews with selected date range
  const { data: pageviewsData, loading: pageviewsLoading } = useGoogleAnalyticsPageviews(dateRange.startDate, dateRange.endDate)

  // Fetch traffic sources with selected date range
  const { data: trafficData, loading: trafficLoading } = useGoogleAnalyticsTrafficSources(dateRange.startDate, dateRange.endDate)

  // Fetch devices with selected date range
  const { data: devicesData, loading: devicesLoading } = useGoogleAnalyticsDevices(dateRange.startDate, dateRange.endDate)

  // Fetch locations with selected date range
  const { data: locationsData, loading: locationsLoading } = useGoogleAnalyticsLocations(dateRange.startDate, dateRange.endDate)

  // Calculate totals from sessions data
  const calculateSessionsTotals = () => {
    if (!sessionsData?.rows || sessionsData.rows.length === 0) {
      return { sessions: 0, users: 0, bounceRate: 0, avgDuration: 0 }
    }

    const totals = sessionsData.rows.reduce((acc: any, row: any) => {
      return {
        sessions: acc.sessions + (parseInt(row.metricValues?.[0]?.value) || 0),
        users: acc.users + (parseInt(row.metricValues?.[1]?.value) || 0),
        bounceRate: acc.bounceRate + (parseFloat(row.metricValues?.[2]?.value) || 0),
        avgDuration: acc.avgDuration + (parseFloat(row.metricValues?.[3]?.value) || 0),
      }
    }, { sessions: 0, users: 0, bounceRate: 0, avgDuration: 0 })

    const rowCount = sessionsData.rows.length
    return {
      sessions: totals.sessions,
      users: totals.users,
      bounceRate: (totals.bounceRate / rowCount).toFixed(1),
      avgDuration: Math.round(totals.avgDuration / rowCount),
    }
  }

  const totals = calculateSessionsTotals()

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  }

  const anyLoading = realtimeLoading || sessionsLoading || pageviewsLoading || trafficLoading || devicesLoading || locationsLoading

  if (anyLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3"></div>
          <p className="text-gray-600">Carregando dados do Google Analytics...</p>
        </div>
        <p className="text-sm text-gray-500 text-center mt-2">Conectando com a API do Google Analytics...</p>
      </div>
    )
  }

  // Check if we have any data to confirm API is working
  const hasData = realtimeData || sessionsData?.rows?.length > 0 || pageviewsData?.rows?.length > 0

  return (
    <div className="space-y-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Google Analytics</h2>
          <p className="text-gray-600">Dados em tempo real e métricas de tráfego</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Date Range Selector */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
              }}
            >
              {Object.entries(DATE_RANGES).map(([key, range]) => (
                <option key={key} value={key}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Live Indicator */}
          <div className="flex items-center gap-2 text-green-600">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">Ao vivo</span>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      {hasData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800">Google Analytics conectado com sucesso!</h3>
              <p className="text-xs text-green-700 mt-1">Os dados estão sendo atualizados em tempo real da API do Google Analytics.</p>
            </div>
          </div>
        </div>
      )}

      {/* Real-time & Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Users */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Usuários Ativos Agora</p>
              <p className="text-3xl font-bold mt-1">{realtimeData?.activeUsers || 0}</p>
              <div className="flex items-center gap-1 mt-2 text-xs opacity-80">
                <Activity className="w-3 h-3" />
                <span>Tempo real</span>
              </div>
            </div>
            <Users className="h-12 w-12 opacity-30" />
          </div>
        </div>

        {/* Sessions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sessões</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totals.sessions.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500 mt-2">{dateRange.label}</p>
            </div>
            <Eye className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        {/* Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuários Únicos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totals.users.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500 mt-2">{dateRange.label}</p>
            </div>
            <Users className="h-10 w-10 text-purple-500" />
          </div>
        </div>

        {/* Bounce Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Rejeição</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totals.bounceRate}%</p>
              <p className="text-xs text-gray-500 mt-2">Média - {dateRange.label}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        {trafficData?.rows && trafficData.rows.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              Fontes de Tráfego (Top 10)
            </h3>
            <div className="space-y-3">
              {trafficData.rows.slice(0, 10).map((row: any, index: number) => {
                const source = row.dimensionValues?.[0]?.value || 'Desconhecido'
                const medium = row.dimensionValues?.[1]?.value || 'none'
                const sessions = parseInt(row.metricValues?.[0]?.value) || 0
                const users = parseInt(row.metricValues?.[1]?.value) || 0

                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{source}</p>
                      <p className="text-xs text-gray-500">{medium}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{sessions.toLocaleString('pt-BR')}</p>
                      <p className="text-xs text-gray-500">{users} usuários</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Top Pages */}
        {pageviewsData?.rows && pageviewsData.rows.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Páginas Mais Visitadas
            </h3>
            <div className="space-y-3">
              {pageviewsData.rows.slice(0, 10).map((row: any, index: number) => {
                const title = row.dimensionValues?.[0]?.value || 'Sem título'
                const path = row.dimensionValues?.[1]?.value || '/'
                const views = parseInt(row.metricValues?.[0]?.value) || 0

                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{title}</p>
                      <p className="text-xs text-gray-500 truncate">{path}</p>
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">{views.toLocaleString('pt-BR')}</p>
                      <p className="text-xs text-gray-500">visualizações</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Devices */}
        {devicesData?.rows && devicesData.rows.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
              Dispositivos
            </h3>
            <div className="space-y-4">
              {devicesData.rows.map((row: any, index: number) => {
                const device = row.dimensionValues?.[0]?.value || 'Desconhecido'
                const sessions = parseInt(row.metricValues?.[0]?.value) || 0
                const totalSessions = devicesData.rows.reduce((sum: number, r: any) =>
                  sum + (parseInt(r.metricValues?.[0]?.value) || 0), 0
                )
                const percentage = ((sessions / totalSessions) * 100).toFixed(1)

                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium capitalize">{device}</span>
                      <span className="text-gray-900 font-bold">{sessions.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{percentage}% do total</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Locations */}
        {locationsData?.rows && locationsData.rows.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Principais Localizações
            </h3>
            <div className="space-y-3">
              {locationsData.rows.slice(0, 10).map((row: any, index: number) => {
                const city = row.dimensionValues?.[0]?.value || 'Desconhecida'
                const country = row.dimensionValues?.[1]?.value || 'Desconhecido'
                const sessions = parseInt(row.metricValues?.[0]?.value) || 0

                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{city}</p>
                      <p className="text-xs text-gray-500">{country}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{sessions.toLocaleString('pt-BR')}</p>
                      <p className="text-xs text-gray-500">sessões</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Session Duration Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Duração Média da Sessão</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{formatDuration(totals.avgDuration)}</p>
            <p className="text-xs text-gray-500 mt-2">Tempo médio que os usuários passam no site</p>
          </div>
          <div className="text-6xl opacity-20">⏱️</div>
        </div>
      </div>
    </div>
  )
}

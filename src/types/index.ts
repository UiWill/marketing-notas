export interface Lead {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  revenue: number
  source: string
  video_progress: number
  video_completed: boolean
  video_dropped_at: number | null
  conversion_stage: 'lead' | 'qualified' | 'converted'
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
}

export interface VideoEvent {
  id: string
  lead_id: string
  event_type: 'play' | 'pause' | 'progress' | 'complete' | 'drop'
  timestamp: number
  created_at: string
}

export interface LeadFormData {
  name: string
  email: string
  phone: string
  revenue: number
}

export interface VideoPlayerProps {
  url: string
  onProgress: (progress: number) => void
  onPlay: () => void
  onPause: () => void
  onEnded: () => void
  showControls?: boolean
  autoPlay?: boolean
}

export interface AnalyticsData {
  totalLeads: number
  conversionRate: number
  averageVideoCompletion: number
  topDropOffPoints: number[]
  leadsBySource: Record<string, number>
  revenueBySegment: Record<string, number>
  totalVisitors?: number
  videoStartRate?: number
  ctaClickRate?: number
  formCompletionRate?: number
}

export interface ConversionFunnel {
  total_visitors: number
  video_started: number
  cta_clicked: number
  form_submitted: number
  converted: number
}

export interface TrafficSource {
  source: string
  medium: string
  campaign: string
  sessions: number
  pageviews: number
  video_starts: number
  conversions: number
}
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// Gera ou recupera um session_id único do sessionStorage
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('visitor_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('visitor_session_id', sessionId)
  }
  return sessionId
}

// Extrai parâmetros UTM da URL
const getUTMParams = () => {
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
  }
}

// Detecta tipo de dispositivo
const getDeviceType = (): string => {
  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile'
  }
  return 'desktop'
}

// Detecta navegador
const getBrowser = (): string => {
  const ua = navigator.userAgent
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Edge')) return 'Edge'
  if (ua.includes('Opera')) return 'Opera'
  return 'Unknown'
}

// Detecta sistema operacional
const getOS = (): string => {
  const ua = navigator.userAgent
  if (ua.includes('Win')) return 'Windows'
  if (ua.includes('Mac')) return 'MacOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iOS')) return 'iOS'
  return 'Unknown'
}

interface PageTrackingOptions {
  trackScroll?: boolean
  trackTimeOnPage?: boolean
}

export const usePageTracking = (options: PageTrackingOptions = {}) => {
  const { trackScroll = true, trackTimeOnPage = true } = options
  const [sessionId] = useState(getSessionId())
  const [pageViewId, setPageViewId] = useState<string | null>(null)
  const pageLoadTime = useRef(Date.now())
  const scrolledToBottom = useRef(false)
  const hasTrackedSession = useRef(false)

  // Tracking de sessão (primeira visita)
  useEffect(() => {
    const trackSession = async () => {
      if (hasTrackedSession.current) return
      hasTrackedSession.current = true

      try {
        const utmParams = getUTMParams()

        const { error } = await supabase
          .from('sessions')
          .upsert({
            session_id: sessionId,
            user_agent: navigator.userAgent,
            referrer: document.referrer || 'direct',
            landing_page: window.location.pathname,
            device_type: getDeviceType(),
            browser: getBrowser(),
            os: getOS(),
            ...utmParams,
          }, { onConflict: 'session_id' })

        if (error) console.error('Erro ao rastrear sessão:', error)
      } catch (error) {
        console.error('Erro ao rastrear sessão:', error)
      }
    }

    trackSession()
  }, [sessionId])

  // Tracking de page view (cada vez que a página é carregada)
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const { data, error } = await supabase
          .from('page_views')
          .insert({
            session_id: sessionId,
            page_path: window.location.pathname,
            page_title: document.title,
          })
          .select()
          .single()

        if (error) {
          console.error('Erro ao rastrear page view:', error)
          return
        }

        if (data) {
          setPageViewId(data.id)
        }
      } catch (error) {
        console.error('Erro ao rastrear page view:', error)
      }
    }

    trackPageView()
  }, [sessionId])

  // Tracking de scroll
  useEffect(() => {
    if (!trackScroll || !pageViewId) return

    const handleScroll = () => {
      if (scrolledToBottom.current) return

      const scrollPercentage =
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight

      if (scrollPercentage >= 0.95) {
        scrolledToBottom.current = true
        updatePageView({ scrolled_to_bottom: true })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pageViewId, trackScroll])

  // Tracking de tempo na página (ao sair)
  useEffect(() => {
    if (!trackTimeOnPage || !pageViewId) return

    const handleBeforeUnload = () => {
      const timeOnPage = Math.floor((Date.now() - pageLoadTime.current) / 1000)

      // Usa sendBeacon para enviar dados mesmo quando a página está sendo fechada
      const payload = {
        id: pageViewId,
        time_on_page: timeOnPage,
      }

      navigator.sendBeacon(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/page_views?id=eq.${pageViewId}`,
        JSON.stringify(payload)
      )
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [pageViewId, trackTimeOnPage])

  // Função auxiliar para atualizar page view
  const updatePageView = async (updates: Partial<{
    scrolled_to_bottom: boolean
    clicked_cta: boolean
    started_video: boolean
    completed_form: boolean
  }>) => {
    if (!pageViewId) return

    try {
      const { error } = await supabase
        .from('page_views')
        .update(updates)
        .eq('id', pageViewId)

      if (error) console.error('Erro ao atualizar page view:', error)
    } catch (error) {
      console.error('Erro ao atualizar page view:', error)
    }
  }

  // Função para rastrear eventos customizados
  const trackEvent = async (
    eventName: string,
    properties?: Record<string, any>
  ) => {
    try {
      const { error } = await supabase
        .from('custom_events')
        .insert({
          session_id: sessionId,
          event_name: eventName,
          event_properties: properties || {},
          page_path: window.location.pathname,
        })

      if (error) console.error('Erro ao rastrear evento:', error)
    } catch (error) {
      console.error('Erro ao rastrear evento:', error)
    }
  }

  return {
    sessionId,
    pageViewId,
    trackEvent,
    updatePageView,
  }
}

declare global {
  interface Window {
    fbq: any
    gtag: any
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters)
  }

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

export const trackPageView = (page: string) => {
  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView')
  }

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: page,
    })
  }
}

export const trackLead = (leadData: { name: string; email: string; revenue: number }) => {
  trackEvent('Lead', {
    content_name: 'ELI Landing Page',
    content_category: 'Lead Generation',
    value: leadData.revenue,
    currency: 'BRL',
  })
}

export const trackVideoEvent = (event: string, progress?: number) => {
  trackEvent('VideoEvent', {
    event_type: event,
    progress: progress,
    content_name: 'ELI Presentation Video',
  })
}

export const getUtmParams = () => {
  if (typeof window === 'undefined') return {}

  const urlParams = new URLSearchParams(window.location.search)
  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
  }
}
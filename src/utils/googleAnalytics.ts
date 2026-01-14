// Google Analytics 4 (GA4) Tracking Utilities

declare global {
  interface Window {
    gtag: any
    dataLayer: any
  }
}

export const GA_MEASUREMENT_ID = 'G-M62S0P61Z8'

// Verificar se gtag está disponível
const isGtagAvailable = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

// Eventos de E-commerce do GA4
export const gaTrackBeginCheckout = (data: {
  value: number
  currency: string
  items?: any[]
}) => {
  if (!isGtagAvailable()) return

  window.gtag('event', 'begin_checkout', {
    value: data.value,
    currency: data.currency,
    items: data.items || [{
      item_id: 'taxa_adesao_dnotas',
      item_name: 'Taxa de Adesão - Dnotas',
      price: data.value,
      quantity: 1
    }]
  })
}

export const gaTrackAddPaymentInfo = (data: {
  value: number
  currency: string
  payment_type: string
}) => {
  if (!isGtagAvailable()) return

  window.gtag('event', 'add_payment_info', {
    value: data.value,
    currency: data.currency,
    payment_type: data.payment_type
  })
}

export const gaTrackPurchase = (data: {
  transaction_id: string
  value: number
  currency: string
  payment_type?: string
  items?: any[]
}) => {
  if (!isGtagAvailable()) return

  window.gtag('event', 'purchase', {
    transaction_id: data.transaction_id,
    value: data.value,
    currency: data.currency,
    payment_type: data.payment_type,
    items: data.items || [{
      item_id: 'taxa_adesao_dnotas',
      item_name: 'Taxa de Adesão - Dnotas',
      price: data.value,
      quantity: 1
    }]
  })
}

// Eventos de Lead Generation
export const gaTrackGenerateLead = (data?: {
  value?: number
  currency?: string
}) => {
  if (!isGtagAvailable()) return

  window.gtag('event', 'generate_lead', data || {})
}

// Eventos Customizados
export const gaTrackVideoStart = (data: {
  video_title: string
  video_url?: string
}) => {
  if (!isGtagAvailable()) return

  window.gtag('event', 'video_start', {
    video_title: data.video_title,
    video_url: data.video_url
  })
}

export const gaTrackVideoProgress = (data: {
  video_title: string
  video_percent: number
  video_current_time: number
}) => {
  if (!isGtagAvailable()) return

  window.gtag('event', 'video_progress', {
    video_title: data.video_title,
    video_percent: data.video_percent,
    video_current_time: data.video_current_time
  })
}

export const gaTrackVideoComplete = (data: {
  video_title: string
  video_duration?: number
}) => {
  if (!isGtagAvailable()) return

  window.gtag('event', 'video_complete', {
    video_title: data.video_title,
    video_duration: data.video_duration
  })
}

// Evento de Conversão Customizada
export const gaTrackConversion = (data: {
  conversion_type: string
  value?: number
  currency?: string
}) => {
  if (!isGtagAvailable()) return

  window.gtag('event', 'conversion', {
    send_to: GA_MEASUREMENT_ID,
    conversion_type: data.conversion_type,
    value: data.value,
    currency: data.currency
  })
}

// Evento de Page View
export const gaTrackPageView = (data?: {
  page_title?: string
  page_location?: string
  page_path?: string
}) => {
  if (!isGtagAvailable()) return

  window.gtag('event', 'page_view', data || {})
}

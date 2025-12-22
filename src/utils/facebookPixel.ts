// Facebook Pixel Tracking Utilities

declare global {
  interface Window {
    fbq: any
  }
}

export const FB_PIXEL_ID = '1279949890819385'

// Inicializar Facebook Pixel
export const initFacebookPixel = () => {
  if (typeof window === 'undefined') return

  // Verificar se já foi inicializado
  if (window.fbq) return

  // Script do Facebook Pixel
  const script = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${FB_PIXEL_ID}');
    fbq('track', 'PageView');
  `

  const scriptElement = document.createElement('script')
  scriptElement.innerHTML = script
  document.head.appendChild(scriptElement)

  // Adicionar noscript fallback
  const noscript = document.createElement('noscript')
  noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1" />`
  document.body.appendChild(noscript)
}

// Eventos Padrão do Facebook
export const fbTrackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView')
  }
}

export const fbTrackLead = (data?: { value?: number; currency?: string }) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', data || {})
  }
}

export const fbTrackCompleteRegistration = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration')
  }
}

export const fbTrackInitiateCheckout = (data?: { value?: number; currency?: string }) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', data || {})
  }
}

export const fbTrackAddPaymentInfo = (data?: { value?: number; currency?: string }) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddPaymentInfo', data || {})
  }
}

export const fbTrackPurchase = (data: { value: number; currency: string }) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', data)
  }
}

// Eventos Customizados - Vídeo
export const fbTrackVideoStart = (data?: { video_title?: string; video_url?: string }) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'VideoStart', data || {})
  }
}

export const fbTrackVideoProgress = (data: {
  video_title?: string
  percentage: number
  current_time: number
  duration?: number
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'VideoProgress', data)
  }
}

export const fbTrackVideoComplete = (data?: {
  video_title?: string
  duration?: number
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'VideoComplete', data || {})
  }
}

export const fbTrackVideoDropoff = (data: {
  video_title?: string
  dropped_at: number
  percentage: number
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'VideoDropoff', data)
  }
}

// Eventos Customizados - Seções
export const fbTrackSectionView = (data: {
  section: string
  time_spent: number
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'SectionView', data)
  }
}

export const fbTrackSectionEngagement = (data: {
  section: string
  engagement_type: string
  time_spent: number
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'SectionEngagement', data)
  }
}

// Eventos Customizados - CTAs
export const fbTrackCTAClick = (data: {
  cta_location: string
  cta_text?: string
  target?: string
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'CTAClick', data)
  }
}

export const fbTrackButtonClick = (data: {
  button_name: string
  button_location: string
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'ButtonClick', data)
  }
}

// Eventos Customizados - Funil
export const fbTrackFunnelStep = (data: {
  step_name: string
  step_number: number
  previous_step?: string
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'FunnelStep', data)
  }
}

export const fbTrackActionSequence = (data: {
  action_name: string
  sequence_number: number
  previous_action?: string
  time_since_previous?: number
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'ActionSequence', data)
  }
}

// Eventos Customizados - Formulário
export const fbTrackFormStart = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'FormStart')
  }
}

export const fbTrackFormFieldComplete = (data: { field_name: string }) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'FormFieldComplete', data)
  }
}

export const fbTrackFormSubmit = (data?: {
  form_name?: string
  revenue?: number
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'FormSubmit', data || {})
    // Também envia evento padrão Lead
    fbTrackLead({ value: data?.revenue })
  }
}

// Eventos Customizados - Engagement
export const fbTrackScrollDepth = (data: { depth: number }) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'ScrollDepth', data)
  }
}

export const fbTrackTimeOnPage = (data: { seconds: number }) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'TimeOnPage', data)
  }
}

export const fbTrackHighEngagement = (data?: {
  engagement_score?: number
  sections_viewed?: number
  time_on_page?: number
  video_completion?: number
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'HighEngagement', data || {})
  }
}

// Evento de Conversão Completa (para otimização de anúncios)
export const fbTrackConversion = (data: {
  conversion_type: string
  value?: number
  currency?: string
  video_completed?: boolean
  sections_viewed?: string[]
  time_on_page?: number
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'Conversion', data)
  }
}

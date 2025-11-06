import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GoogleAnalyticsRequest {
  type: 'realtime' | 'sessions' | 'pageviews' | 'traffic_sources' | 'devices' | 'locations'
  startDate?: string
  endDate?: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, startDate = '30daysAgo', endDate = 'today' }: GoogleAnalyticsRequest = await req.json()

    // Get credentials from environment variables
    const propertyId = Deno.env.get('GA_PROPERTY_ID')
    const credentials = Deno.env.get('GA_CREDENTIALS_JSON')

    if (!propertyId || !credentials) {
      throw new Error('Missing Google Analytics credentials')
    }

    const credentialsObj = JSON.parse(credentials)

    // Get access token
    const accessToken = await getAccessToken(credentialsObj)

    // Fetch data based on type
    let data
    switch (type) {
      case 'realtime':
        data = await getRealtimeData(propertyId, accessToken)
        break
      case 'sessions':
        data = await getSessionsData(propertyId, accessToken, startDate, endDate)
        break
      case 'pageviews':
        data = await getPageviewsData(propertyId, accessToken, startDate, endDate)
        break
      case 'traffic_sources':
        data = await getTrafficSourcesData(propertyId, accessToken, startDate, endDate)
        break
      case 'devices':
        data = await getDevicesData(propertyId, accessToken, startDate, endDate)
        break
      case 'locations':
        data = await getLocationsData(propertyId, accessToken, startDate, endDate)
        break
      default:
        throw new Error('Invalid request type')
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function getAccessToken(credentials: any): Promise<string> {
  const jwtHeader = {
    alg: 'RS256',
    typ: 'JWT',
  }

  const now = Math.floor(Date.now() / 1000)
  const jwtClaimSet = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  // Sign JWT (simplified - in production use proper JWT library)
  const token = await signJWT(jwtHeader, jwtClaimSet, credentials.private_key)

  // Exchange JWT for access token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token}`,
  })

  const data = await response.json()
  return data.access_token
}

async function signJWT(header: any, payload: any, privateKey: string): Promise<string> {
  const encoder = new TextEncoder()

  // Base64url encode (not regular base64)
  const base64urlEncode = (data: string) => {
    return btoa(data)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  const headerB64 = base64urlEncode(JSON.stringify(header))
  const payloadB64 = base64urlEncode(JSON.stringify(payload))
  const unsignedToken = `${headerB64}.${payloadB64}`

  // Import private key
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )

  // Sign
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    encoder.encode(unsignedToken)
  )

  // Base64url encode signature
  const signatureB64 = base64urlEncode(String.fromCharCode(...new Uint8Array(signature)))
  return `${unsignedToken}.${signatureB64}`
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '')
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

async function makeGARequest(propertyId: string, accessToken: string, body: any) {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Google Analytics API error: ${error}`)
  }

  return await response.json()
}

async function getRealtimeData(propertyId: string, accessToken: string) {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metrics: [{ name: 'activeUsers' }],
      }),
    }
  )

  const data = await response.json()
  return {
    activeUsers: data.rows?.[0]?.metricValues?.[0]?.value || 0,
  }
}

async function getSessionsData(propertyId: string, accessToken: string, startDate: string, endDate: string) {
  const data = await makeGARequest(propertyId, accessToken, {
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'bounceRate' },
      { name: 'averageSessionDuration' },
    ],
    dimensions: [{ name: 'date' }],
  })

  return {
    rows: data.rows || [],
    totals: data.totals || [],
  }
}

async function getPageviewsData(propertyId: string, accessToken: string, startDate: string, endDate: string) {
  const data = await makeGARequest(propertyId, accessToken, {
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: 'screenPageViews' }],
    dimensions: [{ name: 'pageTitle' }, { name: 'pagePath' }],
    limit: 10,
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
  })

  return {
    rows: data.rows || [],
  }
}

async function getTrafficSourcesData(propertyId: string, accessToken: string, startDate: string, endDate: string) {
  const data = await makeGARequest(propertyId, accessToken, {
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
    dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
    limit: 10,
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  })

  return {
    rows: data.rows || [],
  }
}

async function getDevicesData(propertyId: string, accessToken: string, startDate: string, endDate: string) {
  const data = await makeGARequest(propertyId, accessToken, {
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: 'sessions' }],
    dimensions: [{ name: 'deviceCategory' }],
  })

  return {
    rows: data.rows || [],
  }
}

async function getLocationsData(propertyId: string, accessToken: string, startDate: string, endDate: string) {
  const data = await makeGARequest(propertyId, accessToken, {
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: 'sessions' }],
    dimensions: [{ name: 'city' }, { name: 'country' }],
    limit: 10,
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  })

  return {
    rows: data.rows || [],
  }
}

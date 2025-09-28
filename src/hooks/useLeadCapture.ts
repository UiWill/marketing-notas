import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { trackLead, getUtmParams } from '@/utils/analytics'
import type { LeadFormData } from '@/types'

export const useLeadCapture = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [leadId, setLeadId] = useState<string | null>(null)

  const submitLead = async (data: LeadFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const utmParams = getUtmParams()

      const { data: leadData, error: insertError } = await supabase
        .from('leads')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          revenue: data.revenue,
          source: 'landing_page',
          conversion_stage: 'lead',
          ...utmParams,
        })
        .select()
        .single()

      if (insertError) throw insertError

      setLeadId(leadData.id)

      // Track lead in analytics
      trackLead({
        name: data.name,
        email: data.email,
        revenue: data.revenue,
      })

      return leadData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar dados'
      setError(errorMessage)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateLeadStage = async (stage: 'qualified' | 'converted') => {
    if (!leadId) return

    try {
      await supabase
        .from('leads')
        .update({ conversion_stage: stage })
        .eq('id', leadId)
    } catch (err) {
      console.error('Error updating lead stage:', err)
    }
  }

  return {
    submitLead,
    updateLeadStage,
    isSubmitting,
    error,
    leadId,
  }
}
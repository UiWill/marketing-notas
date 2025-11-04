import { useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface UseVideoTrackingProps {
  leadId?: string
}

export const useVideoTracking = ({ leadId }: UseVideoTrackingProps = {}) => {
  const progressRef = useRef<number>(0)
  const lastReportedProgress = useRef<number>(0)

  const trackVideoEvent = useCallback(async (
    eventType: 'play' | 'pause' | 'progress' | 'complete' | 'drop',
    timestamp: number
  ) => {
    if (!leadId) return

    try {
      await supabase.from('video_events').insert({
        lead_id: leadId,
        event_type: eventType,
        timestamp,
      })

      // Track in external analytics
      trackVideoEvent(eventType, timestamp)
    } catch (error) {
      console.error('Error tracking video event:', error)
    }
  }, [leadId])

  const updateProgress = useCallback(async (progress: number) => {
    if (!leadId) return

    progressRef.current = progress

    // Only update database every 10% of progress
    const progressPercent = Math.floor(progress * 100)
    const lastProgressPercent = Math.floor(lastReportedProgress.current * 100)

    if (progressPercent >= lastProgressPercent + 10) {
      try {
        await supabase
          .from('leads')
          .update({
            video_progress: progress,
            video_completed: progress >= 0.95
          })
          .eq('id', leadId)

        lastReportedProgress.current = progress

        // Track progress milestones
        await trackVideoEvent('progress', progress)
      } catch (error) {
        console.error('Error updating video progress:', error)
      }
    }
  }, [leadId, trackVideoEvent])

  const handlePlay = useCallback(() => {
    trackVideoEvent('play', progressRef.current)
  }, [trackVideoEvent])

  const handlePause = useCallback(() => {
    trackVideoEvent('pause', progressRef.current)
  }, [trackVideoEvent])

  const handleEnded = useCallback(async () => {
    if (!leadId) return

    try {
      await supabase
        .from('leads')
        .update({
          video_progress: 1,
          video_completed: true
        })
        .eq('id', leadId)

      await trackVideoEvent('complete', 1)
    } catch (error) {
      console.error('Error handling video end:', error)
    }
  }, [leadId, trackVideoEvent])

  const handleDrop = useCallback(async (timestamp: number) => {
    if (!leadId) return

    try {
      await supabase
        .from('leads')
        .update({
          video_dropped_at: timestamp
        })
        .eq('id', leadId)

      await trackVideoEvent('drop', timestamp)
    } catch (error) {
      console.error('Error handling video drop:', error)
    }
  }, [leadId, trackVideoEvent])

  return {
    updateProgress,
    handlePlay,
    handlePause,
    handleEnded,
    handleDrop,
  }
}
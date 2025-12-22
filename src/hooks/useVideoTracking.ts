import { useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import {
  fbTrackVideoStart,
  fbTrackVideoProgress,
  fbTrackVideoComplete,
  fbTrackVideoDropoff,
} from '@/utils/facebookPixel'

interface UseVideoTrackingProps {
  leadId?: string
  sessionId?: string
  videoDuration?: number
  videoTitle?: string
}

export const useVideoTracking = ({ leadId, sessionId, videoDuration, videoTitle = 'Marketing Video' }: UseVideoTrackingProps = {}) => {
  const progressRef = useRef<number>(0)
  const lastReportedProgress = useRef<number>(0)
  const lastReportedMinute = useRef<number>(-1)
  const hasTrackedStart = useRef(false)

  const trackVideoEvent = useCallback(async (
    eventType: 'play' | 'pause' | 'progress' | 'complete' | 'drop' | 'seek',
    timestamp: number
  ) => {
    try {
      const percentage = videoDuration ? (timestamp / videoDuration) * 100 : 0

      await supabase.from('video_events').insert({
        lead_id: leadId || null,
        session_id: sessionId || null,
        event_type: eventType,
        timestamp,
        video_duration: videoDuration || null,
        percentage: percentage || null,
      })

      // Track in Facebook Pixel
      if (eventType === 'play' && !hasTrackedStart.current) {
        hasTrackedStart.current = true
        fbTrackVideoStart({ video_title: videoTitle })
      } else if (eventType === 'progress') {
        // Track milestone progress (25%, 50%, 75%, 95%)
        if (percentage >= 25 && percentage < 30 && lastReportedProgress.current < 25) {
          fbTrackVideoProgress({
            video_title: videoTitle,
            percentage: 25,
            current_time: timestamp,
            duration: videoDuration,
          })
        } else if (percentage >= 50 && percentage < 55 && lastReportedProgress.current < 50) {
          fbTrackVideoProgress({
            video_title: videoTitle,
            percentage: 50,
            current_time: timestamp,
            duration: videoDuration,
          })
        } else if (percentage >= 75 && percentage < 80 && lastReportedProgress.current < 75) {
          fbTrackVideoProgress({
            video_title: videoTitle,
            percentage: 75,
            current_time: timestamp,
            duration: videoDuration,
          })
        } else if (percentage >= 95 && lastReportedProgress.current < 95) {
          fbTrackVideoProgress({
            video_title: videoTitle,
            percentage: 95,
            current_time: timestamp,
            duration: videoDuration,
          })
        }
      } else if (eventType === 'complete') {
        fbTrackVideoComplete({
          video_title: videoTitle,
          duration: videoDuration,
        })
      } else if (eventType === 'drop') {
        fbTrackVideoDropoff({
          video_title: videoTitle,
          dropped_at: timestamp,
          percentage,
        })
      }
    } catch (error) {
      console.error('Error tracking video event:', error)
    }
  }, [leadId, sessionId, videoDuration, videoTitle])

  const updateProgress = useCallback(async (progress: number, currentTime: number) => {
    progressRef.current = progress

    // Track by minute (every 60 seconds)
    const currentMinute = Math.floor(currentTime / 60)

    if (currentMinute > lastReportedMinute.current) {
      lastReportedMinute.current = currentMinute
      // Track progress at every minute mark
      await trackVideoEvent('progress', currentTime)
    }

    // Also track every 10% for lead progress (if leadId exists)
    if (leadId) {
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
        } catch (error) {
          console.error('Error updating video progress:', error)
        }
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
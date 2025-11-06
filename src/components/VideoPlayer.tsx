import { useState, useRef, useCallback, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useVideoTracking } from '@/hooks/useVideoTracking'

interface VideoPlayerProps {
  url: string
  leadId?: string
  onTimeUpdate?: (currentTime: number) => void
  showControlsAfter?: number // seconds
  autoPlay?: boolean
  className?: string
}

export const VideoPlayer = ({
  url,
  leadId,
  onTimeUpdate,
  showControlsAfter = 0,
  autoPlay = true, // Changed default to true
  className = ''
}: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(true) // Start playing automatically
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(showControlsAfter === 0)
  const [currentTime, setCurrentTime] = useState(0)
  const [muted, setMuted] = useState(true) // Start muted for autoplay
  const [showUnmuteButton, setShowUnmuteButton] = useState(true)

  const playerRef = useRef<ReactPlayer>(null)
  const { updateProgress, handlePlay, handlePause, handleEnded, handleDrop } = useVideoTracking({ leadId })

  const handlePlayPause = useCallback(() => {
    setPlaying(prev => {
      const newPlaying = !prev
      if (newPlaying) {
        handlePlay()
      } else {
        handlePause()
      }
      return newPlaying
    })
  }, [handlePlay, handlePause])

  const handleUnmute = useCallback(() => {
    setMuted(false)
    setShowUnmuteButton(false)
  }, [])

  const handleProgress = useCallback((state: { played: number; playedSeconds: number }) => {
    setPlayed(state.played)
    setCurrentTime(state.playedSeconds)

    // Show controls after specified time
    if (!showControls && state.playedSeconds >= showControlsAfter) {
      setShowControls(true)
    }

    updateProgress(state.played)
    onTimeUpdate?.(state.playedSeconds)
  }, [updateProgress, onTimeUpdate, showControls, showControlsAfter])

  const handleDuration = useCallback((duration: number) => {
    setDuration(duration)
  }, [])

  const handleEnding = useCallback(() => {
    setPlaying(false)
    handleEnded()
  }, [handleEnded])

  // Track when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (playing && played < 0.95) {
        handleDrop(currentTime)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [playing, played, currentTime, handleDrop])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        muted={muted}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnding}
        width="100%"
        height="100%"
        controls={false}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload nofullscreen noremoteplayback',
              disablePictureInPicture: true,
              onContextMenu: (e: Event) => e.preventDefault(),
            }
          },
          youtube: {
            playerVars: {
              disablekb: 1,
              controls: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              autoplay: 1,
              mute: 1,
              fs: 0,
            }
          },
          vimeo: {
            playerOptions: {
              controls: false,
              title: false,
              byline: false,
              portrait: false,
              autoplay: true,
            }
          }
        }}
      />

      {/* Camada invisível que bloqueia o mouse até liberar os controles */}
      {!showControls && (
        <div
          className="absolute inset-0 z-10 cursor-default"
          style={{ background: 'transparent' }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => e.preventDefault()}
          onDoubleClick={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        />
      )}

      {/* Unmute Button */}
      {showUnmuteButton && muted && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={handleUnmute}
            className="flex items-center gap-2 px-4 py-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            aria-label="Ativar som"
          >
            <VolumeX className="w-5 h-5 text-gray-900" />
            <span className="text-sm font-medium text-gray-900">Ativar Som</span>
          </button>
        </div>
      )}

      {/* Custom Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              aria-label={playing ? 'Pausar' : 'Reproduzir'}
            >
              {playing ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>

            <div className="flex-1 flex items-center gap-2 text-white text-sm">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-500 transition-all duration-200"
                  style={{ width: `${played * 100}%` }}
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Play overlay when paused */}
      {!playing && showControls && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center w-20 h-20 bg-accent-500 hover:bg-accent-600 rounded-full transition-colors shadow-lg"
            aria-label="Reproduzir vídeo"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </button>
        </div>
      )}
    </div>
  )
}
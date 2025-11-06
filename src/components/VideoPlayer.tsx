import { useState, useRef, useCallback, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Play, Pause } from 'lucide-react'
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
  const [hasStarted, setHasStarted] = useState(false) // Track if user clicked play
  const [playing, setPlaying] = useState(false) // Start paused, waiting for user click
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(showControlsAfter === 0)
  const [currentTime, setCurrentTime] = useState(0)

  const playerRef = useRef<ReactPlayer>(null)
  const { updateProgress, handlePlay, handlePause, handleEnded, handleDrop } = useVideoTracking({ leadId })

  const handleInitialPlay = useCallback(() => {
    setHasStarted(true)
    setPlaying(true)
    handlePlay()
  }, [handlePlay])

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

      {/* Overlay inicial com botão de Play */}
      {!hasStarted && (
        <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <button
            onClick={handleInitialPlay}
            className="group flex flex-col items-center gap-4 transition-transform hover:scale-110"
            aria-label="Iniciar vídeo"
          >
            <div className="flex items-center justify-center w-24 h-24 bg-accent-500 hover:bg-accent-600 rounded-full shadow-2xl transition-all duration-300">
              <Play className="w-12 h-12 text-white ml-2" />
            </div>
            <span className="text-white text-lg font-semibold opacity-90 group-hover:opacity-100 transition-opacity">
              Clique para Assistir
            </span>
          </button>
        </div>
      )}

      {/* Camada invisível que bloqueia o mouse até liberar os controles */}
      {hasStarted && !showControls && (
        <div
          className="absolute inset-0 z-10 cursor-default"
          style={{ background: 'transparent' }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => e.preventDefault()}
          onDoubleClick={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        />
      )}

      {/* Custom Controls - Apenas visualização, sem controle de play/pause */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-4">
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
    </div>
  )
}
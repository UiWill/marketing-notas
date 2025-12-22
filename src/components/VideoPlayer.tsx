import { useState, useRef, useCallback, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Volume2, VolumeX } from 'lucide-react'
import { useVideoTracking } from '@/hooks/useVideoTracking'

interface VideoPlayerProps {
  url: string
  leadId?: string
  sessionId?: string
  onTimeUpdate?: (currentTime: number) => void
  showControlsAfter?: number // seconds
  autoPlay?: boolean
  className?: string
}

export const VideoPlayer = ({
  url,
  leadId,
  sessionId,
  onTimeUpdate,
  showControlsAfter = 0,
  className = ''
}: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(true) // Autoplay ativado
  const [muted, setMuted] = useState(true) // Começa sem som
  const [showSoundNotice, setShowSoundNotice] = useState(true) // Mostrar aviso de som
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(showControlsAfter === 0)
  const [currentTime, setCurrentTime] = useState(0)

  const playerRef = useRef<ReactPlayer>(null)
  const { updateProgress, handlePlay, handleEnded, handleDrop } = useVideoTracking({
    leadId,
    sessionId,
    videoDuration: duration,
  })

  // Ativar som quando usuário clicar no aviso
  const handleEnableSound = useCallback(() => {
    setMuted(false)
    setShowSoundNotice(false)
    // Voltar o vídeo para o início
    if (playerRef.current) {
      playerRef.current.seekTo(0)
    }
  }, [])

  // Fechar aviso sem ativar som
  const handleCloseSoundNotice = useCallback(() => {
    setShowSoundNotice(false)
  }, [])

  // Iniciar tracking quando vídeo começar
  useEffect(() => {
    if (playing) {
      handlePlay()
    }
  }, [playing, handlePlay])

  const handleProgress = useCallback((state: { played: number; playedSeconds: number }) => {
    setPlayed(state.played)
    setCurrentTime(state.playedSeconds)

    // Show controls after specified time
    if (!showControls && state.playedSeconds >= showControlsAfter) {
      setShowControls(true)
    }

    updateProgress(state.played, state.playedSeconds)
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
        controls={true}
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
              disablekb: 0,
              controls: 1, // Habilitar controles do YouTube
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              autoplay: 1,
              mute: 1, // Começar sem som
              fs: 1, // Permitir fullscreen
              hd: 1, // Preferir HD
              quality: 'hd720',
            }
          },
          vimeo: {
            playerOptions: {
              controls: false,
              title: false,
              byline: false,
              portrait: false,
              autoplay: true,
              muted: true,
            }
          }
        }}
      />

      {/* Aviso de Som */}
      {showSoundNotice && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
          <div className="bg-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-md">
            <VolumeX className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-sm">O vídeo já começou!</p>
              <p className="text-xs opacity-90">Clique aqui para ativar o som</p>
            </div>
            <button
              onClick={handleEnableSound}
              className="bg-white text-orange-500 px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-50 transition-colors flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              Ativar Som
            </button>
            <button
              onClick={handleCloseSoundNotice}
              className="text-white hover:text-orange-200 transition-colors ml-2"
              aria-label="Fechar aviso"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Custom Controls - Apenas visualização, sem controle de play/pause */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-none">
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
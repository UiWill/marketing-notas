import { useEffect, useRef } from 'react'

interface SectionTrackingOptions {
  pageViewId: string | null
  onSectionView?: (sectionId: string, timeSpent: number) => void
  threshold?: number // porcentagem da seção que precisa estar visível (0-1)
}

export const useSectionTracking = ({
  pageViewId,
  onSectionView,
  threshold = 0.5,
}: SectionTrackingOptions) => {
  const sectionsRef = useRef<Map<string, { viewed: boolean; startTime: number | null }>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!pageViewId) return

    // Inicializa o Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section-id')
          if (!sectionId) return

          const sectionData = sectionsRef.current.get(sectionId) || {
            viewed: false,
            startTime: null,
          }

          if (entry.isIntersecting) {
            // Seção entrou na view
            if (!sectionData.startTime) {
              sectionData.startTime = Date.now()
              sectionsRef.current.set(sectionId, sectionData)
            }
          } else {
            // Seção saiu da view
            if (sectionData.startTime && !sectionData.viewed) {
              const timeSpent = Math.floor((Date.now() - sectionData.startTime) / 1000)

              // Marca como visualizada se passou tempo suficiente (pelo menos 1 segundo)
              if (timeSpent >= 1) {
                sectionData.viewed = true
                sectionsRef.current.set(sectionId, sectionData)

                if (onSectionView) {
                  onSectionView(sectionId, timeSpent)
                }
              }

              // Reset do startTime
              sectionData.startTime = null
              sectionsRef.current.set(sectionId, sectionData)
            }
          }
        })
      },
      {
        threshold,
        rootMargin: '0px',
      }
    )

    // Observa todas as seções com data-section-id
    const sections = document.querySelectorAll('[data-section-id]')
    sections.forEach((section) => {
      observerRef.current?.observe(section)
    })

    // Cleanup ao desmontar
    return () => {
      // Processa tempo gasto nas seções que ainda estão visíveis
      sectionsRef.current.forEach((data, sectionId) => {
        if (data.startTime && !data.viewed) {
          const timeSpent = Math.floor((Date.now() - data.startTime) / 1000)
          if (timeSpent >= 1 && onSectionView) {
            onSectionView(sectionId, timeSpent)
          }
        }
      })

      observerRef.current?.disconnect()
    }
  }, [pageViewId, onSectionView, threshold])

  // Retorna função para adicionar tempo extra a uma seção
  const addTimeToSection = (sectionId: string, additionalTime: number) => {
    const sectionData = sectionsRef.current.get(sectionId)
    if (sectionData && onSectionView) {
      onSectionView(sectionId, additionalTime)
    }
  }

  return {
    addTimeToSection,
    sectionsTracked: sectionsRef.current.size,
  }
}

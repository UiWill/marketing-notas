import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { ReactNode } from 'react'

interface ScrollAnimationProps {
  children: ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleUp'
  delay?: number
  duration?: number
  className?: string
}

const animations = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  }
}

export const ScrollAnimation = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6,
  className = ''
}: ScrollAnimationProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={animations[animation]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] // easeOutQuart
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
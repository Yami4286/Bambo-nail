import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Arrow, Close } from './Icons'

/**
 * Full-screen lightbox dialog with prev/next navigation, image counter,
 * keyboard support (Escape, arrows) and scroll lock.
 */
export default function Lightbox({ item, index, total, onClose, onPrev, onNext }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    const key = event => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNext()
      if (event.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [onClose, onNext, onPrev])

  // Move focus into the dialog and lock page scroll while open.
  useEffect(() => {
    const frame = requestAnimationFrame(() => document.querySelector('.lightbox')?.focus())
    document.documentElement.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(frame)
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <motion.div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} image`}
      tabIndex={-1}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? {} : { opacity: 0 }}
    >
      <button type="button" className="icon-button lightbox__close" onClick={onClose} aria-label="Close gallery image"><Close /></button>
      <button type="button" className="lightbox__prev" onClick={onPrev} aria-label="Previous image"><Arrow /></button>
      <motion.img
        key={item.id}
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        src={item.src}
        alt={item.alt}
      />
      <button type="button" className="lightbox__next" onClick={onNext} aria-label="Next image"><Arrow /></button>
      <p>
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} — {item.title} <small>— {item.category}</small>
      </p>
    </motion.div>
  )
}

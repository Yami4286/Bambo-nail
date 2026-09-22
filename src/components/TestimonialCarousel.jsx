import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { testimonials } from '../data/testimonials'
import { Arrow, Star } from './Icons'
import { Reveal } from './Motion'

/**
 * Single featured testimonial carousel with gentle auto-advance,
 * prev/next controls and an index counter. Pauses on hover/touch.
 */
export default function TestimonialCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || paused) return undefined
    const id = setInterval(() => setActive(i => (i + 1) % testimonials.length), 5500)
    return () => clearInterval(id)
  }, [paused, reduce])

  const t = testimonials[active]
  const go = n => setActive((active + n + testimonials.length) % testimonials.length)

  return (
    <Reveal
      className="reviews__card"
      delay={0.1}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? {} : { opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="stars" aria-label={`${t.rating} out of 5 stars`}>
            {Array.from({ length: t.rating }, (_, i) => <Star key={i} />)}
          </div>
          <blockquote>“{t.quote}”</blockquote>
          <p className="reviews__meta">
            <span className="reviews__name">{t.name}</span>
            <span className="reviews__role">Guest review</span>
          </p>
        </motion.div>
      </AnimatePresence>
      <div className="review-controls">
        <button type="button" onClick={() => go(-1)} aria-label="Previous review"><Arrow /></button>
        <span aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span>
        <button type="button" onClick={() => go(1)} aria-label="Next review"><Arrow /></button>
      </div>
    </Reveal>
  )
}

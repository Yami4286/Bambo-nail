import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { gallery, galleryCategories } from '../data/gallery'
import { Close, Arrow } from './Icons'
import { Reveal } from './Motion'

export default function Gallery() {
  const [filter, setFilter] = useState('All')
  const [current, setCurrent] = useState(null)
  const reduce = useReducedMotion()

  const shown = filter === 'All' ? gallery : gallery.filter(item => item.category === filter)
  const index = shown.findIndex(item => item.id === current?.id)
  const move = direction => setCurrent(shown[(index + direction + shown.length) % shown.length])

  // Lightbox keyboard controls.
  useEffect(() => {
    if (!current) return undefined
    const key = event => {
      if (event.key === 'Escape') setCurrent(null)
      if (event.key === 'ArrowRight') move(1)
      if (event.key === 'ArrowLeft') move(-1)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  })

  // While the lightbox is open: lock page scroll and move focus into the dialog.
  useEffect(() => {
    if (!current) return undefined
    const frame = requestAnimationFrame(() => document.querySelector('.lightbox')?.focus())
    document.documentElement.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(frame)
      document.documentElement.style.overflow = ''
    }
  }, [current])

  return (
    <section className="gallery section container" id="gallery">
      <Reveal className="section-head">
        <div>
          <p className="eyebrow">04 — Recent work</p>
          <h2>A close look at<br /><em>the finish.</em></h2>
        </div>
        <p>Every set is a small expression of who you are. Browse a few favourite details.</p>
      </Reveal>
      <div className="filters" role="group" aria-label="Filter gallery by style">
        {galleryCategories.map(category => (
          <button
            key={category}
            type="button"
            aria-pressed={filter === category}
            className={filter === category ? 'active' : ''}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <motion.ul className="gallery-grid" layout>
        {shown.map((item, i) => (
          <motion.li
            layout
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={reduce ? {} : { opacity: 1, scale: 1 }}
            exit={reduce ? {} : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            className={`gallery-item gallery-item--${i % 5}`}
            key={item.id}
          >
            <button
              type="button"
              className="gallery-item__button"
              onClick={() => setCurrent(item)}
              aria-label={`View larger: ${item.title}, ${item.alt}`}
            >
              <img loading="lazy" src={item.src} alt={item.alt} onError={event => { event.currentTarget.classList.add('is-broken') }} />
              <span><i>{item.category}</i>{item.title}</span>
            </button>
          </motion.li>
        ))}
      </motion.ul>
      <AnimatePresence>
        {current && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${current.title} image`}
            tabIndex={-1}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? {} : { opacity: 0 }}
          >
            <button type="button" className="icon-button lightbox__close" onClick={() => setCurrent(null)} aria-label="Close gallery image"><Close /></button>
            <button type="button" className="lightbox__prev" onClick={() => move(-1)} aria-label="Previous image"><Arrow /></button>
            <motion.img
              key={current.id}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={current.src}
              alt={current.alt}
            />
            <button type="button" className="lightbox__next" onClick={() => move(1)} aria-label="Next image"><Arrow /></button>
            <p>{current.title} <small>— {current.category}</small></p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

import { motion, useReducedMotion } from 'framer-motion'
import { Arrow } from './Icons'
import { Link } from 'react-router-dom'

/**
 * Reusable gallery image card. On the gallery page it opens the lightbox;
 * in preview strips it links through to the full gallery.
 */
export default function GalleryCard({ item, onOpen, link, className = '' }) {
  const reduce = useReducedMotion()

  const image = (
    <>
      <img loading="lazy" src={item.src} alt={item.alt} onError={event => { event.currentTarget.classList.add('is-broken') }} />
      <span><i>{item.category}</i>{item.title}</span>
    </>
  )

  return (
    <motion.li
      layout
      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
      animate={reduce ? {} : { opacity: 1, scale: 1 }}
      exit={reduce ? {} : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className={`gallery-item ${className}`}
    >
      {link ? (
        <Link className="gallery-item__button" to={link} aria-label={`View in gallery: ${item.title}, ${item.alt}`}>{image}</Link>
      ) : (
        <button
          type="button"
          className="gallery-item__button"
          onClick={() => onOpen(item)}
          aria-label={`View larger: ${item.title}, ${item.alt}`}
        >
          {image}
        </button>
      )}
    </motion.li>
  )
}

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gallery, galleryCategories } from '../data/gallery'
import { Reveal } from './Motion'
import GalleryCard from './GalleryCard'
import Lightbox from './Lightbox'
import SectionHeading from './SectionHeading'

/**
 * Full gallery experience: category filters, editorial grid and lightbox.
 * All filtering happens in the frontend against the static data.
 */
export default function GalleryGrid() {
  const [filter, setFilter] = useState('All')
  const [current, setCurrent] = useState(null)
  const shown = filter === 'All' ? gallery : gallery.filter(item => item.category === filter)

  const index = shown.findIndex(item => item.id === current?.id)
  const move = direction => setCurrent(shown[(index + direction + shown.length) % shown.length])

  return (
    <section className="gallery section container" id="gallery">
      <SectionHeading
        label="04 — Recent work"
        title={<>A close look at<br /><em>the finish.</em></>}
        aside="Every set is a small expression of who you are. Browse a few favourite details."
      />
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
      <AnimatePresence mode="popLayout">
        <motion.ul className="gallery-grid" layout key={filter}>
          <AnimatePresence mode="popLayout">
            {shown.map((item, i) => (
              <GalleryCard key={item.id} item={item} className={`gallery-item--${i % 5}`} onOpen={setCurrent} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </AnimatePresence>
      <AnimatePresence>
        {current && (
          <Lightbox
            item={current}
            index={index}
            total={shown.length}
            onClose={() => setCurrent(null)}
            onPrev={() => move(-1)}
            onNext={() => move(1)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

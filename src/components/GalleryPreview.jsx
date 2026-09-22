import { gallery } from '../data/gallery'
import { Link } from 'react-router-dom'
import { Arrow } from './Icons'
import GalleryCard from './GalleryCard'
import SectionHeading from './SectionHeading'

const previewIds = [1, 2, 3, 4, 5, 6]
const previewItems = previewIds.map(id => gallery.find(item => item.id === id)).filter(Boolean)

/**
 * Home-page gallery preview: a curated six-image strip linking to the
 * full gallery page.
 */
export default function GalleryPreview() {
  return (
    <section className="gallery-preview section container" aria-labelledby="gallery-preview-title">
      <SectionHeading
        label="04 — Recent work"
        title={<span id="gallery-preview-title">A close look at<br /><em>the finish.</em></span>}
        aside="Every set is a small expression of who you are."
      />
      <ul className="gallery-grid gallery-grid--preview">
        {previewItems.map((item, i) => (
          <GalleryCard key={item.id} item={item} link="/gallery" className={`gallery-item--${i % 5}`} />
        ))}
      </ul>
      <div className="center-cta">
        <Link className="button" to="/gallery">View full gallery <Arrow /></Link>
      </div>
    </section>
  )
}

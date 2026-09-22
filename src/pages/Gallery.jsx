import usePageMeta from '../hooks/usePageMeta'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'
import GalleryGrid from '../components/GalleryGrid'

export default function Gallery() {
  usePageMeta(
    'Nail Gallery | Bambo Nails',
    'Browse recent Bambo Nails work — minimal, French, nude, glam, nail art and seasonal sets in full detail.',
  )

  return (
    <PageTransition>
      <PageHero
        label="04 — Nail gallery"
        title={<>A little<br /><em>inspiration.</em></>}
      >
        <p>
          A curated look at recent sets from the studio. Filter by style, open any image for a closer look,
          and bring your favourites to your next appointment.
        </p>
      </PageHero>

      <GalleryGrid />
    </PageTransition>
  )
}

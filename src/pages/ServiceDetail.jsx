import { Link, useParams } from 'react-router-dom'
import { Arrow } from '../components/Icons'
import usePageMeta from '../hooks/usePageMeta'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'
import GalleryCard from '../components/GalleryCard'
import { Reveal } from '../components/Motion'
import NotFound from './NotFound'
import { findService } from '../data/services'
import { gallery } from '../data/gallery'

/**
 * Individual service page: /services/<slug>. Renders the full detail
 * experience for a service from the static data, or a 404 if unknown.
 */
export default function ServiceDetail() {
  const { slug } = useParams()
  const service = findService(slug)

  usePageMeta(
    service ? `${service.name} | Bambo Nails` : 'Service not found | Bambo Nails',
    service ? service.description : 'This service could not be found.',
  )

  if (!service) return <NotFound />

  const related = service.related.length ? service.related : gallery.slice(0, 3)

  return (
    <PageTransition>
      <PageHero
        className="page-hero--service"
        label={`03 — ${service.category}`}
        title={<>{service.name}</>}
      >
        <p>{service.tagline}</p>
        <div className="page-hero__cta">
          <Link className="button" to={`/booking?service=${service.slug}`}>Book this service <Arrow /></Link>
        </div>
      </PageHero>

      <section className="service-detail section container" aria-labelledby="service-included-title">
        <div className="service-detail__block">
          <Reveal>
            <p className="eyebrow">What is included</p>
            <h2 id="service-included-title">The <em>appointment.</em></h2>
            <ul className="service-detail__list">
              {service.included.map(entry => <li key={entry}>{entry}</li>)}
            </ul>
          </Reveal>
        </div>
        <div className="service-detail__block">
          <Reveal delay={0.1}>
            <p className="eyebrow">The experience</p>
            <h2>What to <em>expect.</em></h2>
            <ol className="service-detail__list service-detail__list--steps">
              {service.experience.map(step => <li key={step}>{step}</li>)}
            </ol>
          </Reveal>
        </div>
        <Reveal className="service-detail__facts" delay={0.15}>
          <div><p className="eyebrow">Duration</p><p>{service.duration}</p></div>
          <div><p className="eyebrow">Price</p><p>{service.price}</p></div>
          <div><p className="eyebrow">Finish</p><p>{service.finish}</p></div>
          <div><p className="eyebrow">Recommended for</p><p>{service.recommendedFor}</p></div>
        </Reveal>
      </section>

      <section className="service-gallery section" aria-labelledby="service-gallery-title">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Gallery</p>
            <h2 id="service-gallery-title">The finish,<br /><em>up close.</em></h2>
          </Reveal>
          <ul className="gallery-grid gallery-grid--service">
            {related.map((item, i) => (
              <GalleryCard key={item.id} item={item} link="/gallery" className={`gallery-item--${i % 5}`} />
            ))}
          </ul>
        </div>
      </section>

      <section className="service-faq section container" aria-labelledby="service-faq-title">
        <Reveal>
          <p className="eyebrow">FAQ</p>
          <h2 id="service-faq-title">Good to <em>know.</em></h2>
        </Reveal>
        <div className="service-faq__list">
          {service.faq.map(([question, answer]) => (
            <Reveal className="service-faq__item" key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="final-cta section" aria-labelledby="service-cta-title">
        <div className="container final-cta__inner">
          <Reveal>
            <p className="eyebrow">Reserve your moment</p>
            <h2 id="service-cta-title">Book your<br /><em>{service.name.toLowerCase()}.</em></h2>
            <Link className="button" to={`/booking?service=${service.slug}`}>Book this service <Arrow /></Link>
            <Link className="text-link final-cta__secondary" to="/services">All services <Arrow /></Link>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  )
}

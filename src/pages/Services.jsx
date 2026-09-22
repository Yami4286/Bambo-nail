import { Link } from 'react-router-dom'
import { Arrow } from '../components/Icons'
import usePageMeta from '../hooks/usePageMeta'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'
import ServiceList from '../components/ServiceList'
import { Reveal } from '../components/Motion'

export default function Services() {
  usePageMeta(
    'Nail Services | Bambo Nails',
    'Manicures, builder gel, extensions and nail art — explore the full Bambo Nails service menu and find your finish.',
  )

  return (
    <PageTransition>
      <PageHero
        label="02 — Services"
        title={<>Find your<br /><em>finish.</em></>}
      >
        <p>
          From timeless manicures to builder gel, extensions and hand-painted art — every service is adapted to
          your nails, your style and the details that matter to you.
        </p>
      </PageHero>

      <section className="services section" aria-label="Service catalogue">
        <div className="container">
          <ServiceList />
        </div>
      </section>

      <section className="final-cta section" aria-labelledby="services-cta-title">
        <div className="container final-cta__inner">
          <Reveal>
            <p className="eyebrow">Not sure where to start?</p>
            <h2 id="services-cta-title">We’ll help you<br /><em>choose.</em></h2>
            <Link className="button" to="/booking">Book a visit <Arrow /></Link>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  )
}

import { Link } from 'react-router-dom'
import { Arrow } from '../components/Icons'
import usePageMeta from '../hooks/usePageMeta'
import PageTransition from '../components/PageTransition'
import Hero from '../components/Hero'
import Intro from '../components/Intro'
import ServiceList from '../components/ServiceList'
import GalleryPreview from '../components/GalleryPreview'
import BeforeAfter from '../components/BeforeAfter'
import TestimonialCarousel from '../components/TestimonialCarousel'
import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Motion'

export default function Home() {
  usePageMeta(
    'Bambo Nails | Modern Manicures & Nail Art',
    'Modern manicures, detailed nail artistry, and a little time dedicated entirely to you. Book your visit to Bambo Nails.',
  )

  return (
    <PageTransition>
      <Hero />
      <Intro />
      <section className="services section" aria-labelledby="home-services-title">
        <div className="container">
          <SectionHeading
            label="02 — Service menu"
            title={<span id="home-services-title">Made for your<br /><em>everyday luxury.</em></span>}
            aside="Every service is adapted to your personal style, nail health and the details that matter to you."
          />
          <ServiceList featured />
          <div className="center-cta">
            <Link className="text-link" to="/services">View all services <Arrow /></Link>
          </div>
        </div>
      </section>
      <GalleryPreview />
      <BeforeAfter />
      <section className="reviews section" aria-label="What our guests say">
        <div className="container reviews__inner">
          <Reveal>
            <p className="eyebrow">06 — Kind words</p>
            <h2>Words from<br /><em>our guests.</em></h2>
          </Reveal>
          <TestimonialCarousel />
        </div>
        <div className="container center-cta">
          <Link className="text-link" to="/reviews">Read more reviews <Arrow /></Link>
        </div>
      </section>
      <section className="final-cta section" aria-labelledby="final-cta-title">
        <div className="container final-cta__inner">
          <Reveal>
            <p className="eyebrow">07 — Reserve your moment</p>
            <h2 id="final-cta-title">Your next set<br />starts <em>here.</em></h2>
            <Link className="button" to="/booking">Book an appointment <Arrow /></Link>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  )
}

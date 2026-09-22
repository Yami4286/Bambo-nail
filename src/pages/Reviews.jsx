import { Link } from 'react-router-dom'
import { Arrow, Star } from '../components/Icons'
import usePageMeta from '../hooks/usePageMeta'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'
import TestimonialCard from '../components/TestimonialCard'
import { Reveal } from '../components/Motion'
import { testimonials, featuredTestimonial } from '../data/testimonials'

export default function Reviews() {
  usePageMeta(
    'Client Reviews | Bambo Nails',
    'Read what guests say about Bambo Nails — meticulous work, calm appointments and finishes that last.',
  )

  return (
    <PageTransition>
      <PageHero
        label="06 — Kind words"
        title={<>Words from<br /><em>our guests.</em></>}
      >
        <p>Real words from real appointments — collected from guests who keep coming back.</p>
      </PageHero>

      <section className="reviews-featured section" aria-label="Featured review">
        <Reveal className="container reviews-featured__inner">
          <div className="stars" aria-label={`${featuredTestimonial.rating} out of 5 stars`}>
            {Array.from({ length: featuredTestimonial.rating }, (_, i) => <Star key={i} />)}
          </div>
          <blockquote>“{featuredTestimonial.quote}”</blockquote>
          <p className="reviews__meta">
            <span className="reviews__name">{featuredTestimonial.name}</span>
            <span className="reviews__role">Featured guest review</span>
          </p>
        </Reveal>
      </section>

      <section className="reviews-collection section container" aria-label="All guest reviews">
        <Reveal>
          <p className="eyebrow">All reviews</p>
          <h2>In their<br /><em>own words.</em></h2>
        </Reveal>
        <div className="reviews-collection__grid">
          {testimonials.map(testimonial => (
            <Reveal key={testimonial.name} delay={0.05}>
              <TestimonialCard testimonial={testimonial} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="final-cta section" aria-labelledby="reviews-cta-title">
        <div className="container final-cta__inner">
          <Reveal>
            <p className="eyebrow">Your words could be next</p>
            <h2 id="reviews-cta-title">Come and<br /><em>see.</em></h2>
            <Link className="button" to="/booking">Book an appointment <Arrow /></Link>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  )
}

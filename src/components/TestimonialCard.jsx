import { Star } from './Icons'

/**
 * Reusable testimonial card: stars, quote, name and "Guest review" label.
 * Name and label sit in a flex row so they can never collide.
 */
export default function TestimonialCard({ testimonial }) {
  const { quote, name, rating } = testimonial
  return (
    <figure className="review-card">
      <div className="stars" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: rating }, (_, i) => <Star key={i} />)}
      </div>
      <blockquote>“{quote}”</blockquote>
      <figcaption className="reviews__meta">
        <span className="reviews__name">{name}</span>
        <span className="reviews__role">Guest review</span>
      </figcaption>
    </figure>
  )
}

import { Link } from 'react-router-dom'
import { Arrow } from './Icons'

/**
 * Reusable service card: number, name, description, duration/price meta
 * and two routes — Learn more (detail page) and Book (booking with service
 * preselected via query param).
 */
export default function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <span>{service.number}</span>
      <h3>{service.name}</h3>
      <p>{service.description || service.tagline}</p>
      <div className="service-card__meta">
        <small>{service.duration}</small>
        <b>{service.price}</b>
      </div>
      <div className="service-card__links">
        <Link to={`/services/${service.slug}`} aria-label={`Learn more about ${service.name}`}>Learn more <Arrow /></Link>
        <Link to={`/booking?service=${service.slug}`} aria-label={`Book ${service.name}`}>Book now <Arrow /></Link>
      </div>
    </article>
  )
}

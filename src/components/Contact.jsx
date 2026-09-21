import { business } from '../data/business'
import { studioImage } from '../data/gallery'
import { Arrow } from './Icons'
import { Reveal } from './Motion'

export default function Contact() {
  return (
    <section className="contact section container" id="contact">
      <Reveal className="contact__lead">
        <p className="eyebrow">08 — Visit us</p>
        <h2>A good nail day<br />awaits <em>you.</em></h2>
        <a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} className="map-card" target="_blank" rel="noreferrer">
          <span>Find the studio <Arrow /></span>
        </a>
      </Reveal>
      <Reveal className="contact__details" delay={0.1}>
        <div>
          <p className="eyebrow">Bambo Nails</p>
          <p>{business.address}</p>
          <a href={business.phoneLink}>{business.phone}</a>
          <a href={business.emailLink}>{business.email}</a>
        </div>
        <div>
          <p className="eyebrow">Studio hours</p>
          {business.hours.map(([day, time]) => <p className="hours" key={day}><span>{day}</span><span>{time}</span></p>)}
        </div>
      </Reveal>
    </section>
  )
}

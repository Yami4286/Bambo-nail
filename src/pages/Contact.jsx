import { business } from '../data/business'
import { Arrow } from '../components/Icons'
import usePageMeta from '../hooks/usePageMeta'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'
import { Reveal } from '../components/Motion'

/**
 * Contact page: information column beside a single deliberate studio
 * image. All contact actions are labelled links (tel / mailto / maps).
 */
export default function Contact() {
  usePageMeta(
    'Contact Bambo Nails',
    'Find the Bambo Nails studio — address, phone, email, opening hours and directions.',
  )

  return (
    <PageTransition>
      <PageHero
        label="08 — Visit us"
        title={<>A good nail day<br />awaits <em>you.</em></>}
      >
        <p>Find the studio, check the hours, or send a message — we are easy to reach.</p>
      </PageHero>

      <section className="contact-page section container" aria-label="Contact details">
        <Reveal className="contact-page__info">
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
          <div className="contact-page__actions">
            <a className="button" href={business.phoneLink}>Call the studio <Arrow /></a>
            <a className="text-link" href={business.whatsappLink}>WhatsApp <Arrow /></a>
            <a className="text-link" href={business.social.Instagram} target="_blank" rel="noreferrer">Instagram <Arrow /></a>
          </div>
        </Reveal>

        <Reveal className="contact-page__media" delay={0.1}>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
            className="map-card"
            target="_blank"
            rel="noreferrer"
          >
            <span>Open in Google Maps <Arrow /></span>
          </a>
        </Reveal>
      </section>
    </PageTransition>
  )
}

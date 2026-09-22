import { business } from '../data/business'
import { Arrow } from '../components/Icons'
import usePageMeta from '../hooks/usePageMeta'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'
import BookingForm from '../components/BookingForm'
import { Reveal } from '../components/Motion'
import { bookingImage } from '../data/gallery'

/**
 * Booking page: request form plus a calm aside with contact actions,
 * studio hours and supporting imagery. Entirely frontend-only.
 */
export default function Booking() {
  usePageMeta(
    'Book an Appointment | Bambo Nails',
    'Request your Bambo Nails appointment — choose your service, preferred date and time, and we will confirm directly.',
  )

  return (
    <PageTransition>
      <PageHero
        label="07 — Reserve your moment"
        title={<>Your next set<br />starts <em>here.</em></>}
      >
        <p>
          Choose your service, pick a preferred time, and prepare your request. We confirm every appointment
          directly — nothing is automated.
        </p>
      </PageHero>

      <section className="booking-page section container" aria-label="Booking request">
        <Reveal className="booking-page__aside">
          <img
            className="booking-page__image"
            loading="lazy"
            src={bookingImage}
            alt="Freshly manicured hands resting during a calm studio appointment"
          />
          <p className="eyebrow">Good to know</p>
          <p>
            This form prepares your request on your device — nothing is sent or stored automatically. To confirm
            your appointment, call the studio, email us or send a message on WhatsApp.
          </p>
          <div className="booking-page__contact">
            <a className="button" href={business.phoneLink}>Call the studio <Arrow /></a>
            <a className="text-link" href={business.whatsappLink}>Message on WhatsApp <Arrow /></a>
            <a className="text-link" href={business.emailLink}>Email us <Arrow /></a>
          </div>
          <div className="booking-page__hours">
            <p className="eyebrow">Studio hours</p>
            {business.hours.map(([day, time]) => <p className="hours" key={day}><span>{day}</span><span>{time}</span></p>)}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="booking-page__form">
          <BookingForm />
        </Reveal>
      </section>
    </PageTransition>
  )
}

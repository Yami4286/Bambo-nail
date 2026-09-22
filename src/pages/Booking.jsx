import { business } from '../data/business'
import { Arrow } from '../components/Icons'
import usePageMeta from '../hooks/usePageMeta'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'
import BookingForm from '../components/BookingForm'
import { Reveal } from '../components/Motion'

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
          <p className="eyebrow">Good to know</p>
          <p>
            This form prepares your request on your device only — nothing is sent or stored. To confirm your
            appointment, call the studio, email us or send a message on WhatsApp.
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

import { useState } from 'react'
import { services } from '../data/services'
import { business } from '../data/business'
import { Arrow } from './Icons'
import { Reveal } from './Motion'

export default function Booking() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (!form.get('name') || !form.get('email') || !form.get('service')) {
      setError('Please complete your name, email and preferred service.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <section className="booking section" id="booking">
      <div className="container booking__grid">
        <Reveal>
          <p className="eyebrow">07 — Reserve your moment</p>
          <h2>Your next set<br />starts <em>here.</em></h2>
          <p>Choose your style, take a little time for yourself, and leave with nails you’ll love.</p>
        </Reveal>
        {sent ? (
          <Reveal className="booking__success">
            <p className="eyebrow">Request prepared</p>
            <h3>Thanks! Your appointment request has been prepared.</h3>
            <p>This demo form does not store or send appointments. Get in touch directly to confirm your preferred time.</p>
            <a className="button" href={business.phoneLink}>Call Bambo Nails <Arrow /></a>
            <a className="text-link" href={business.emailLink}>Email the studio <Arrow /></a>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <form className="booking__form" onSubmit={submit} noValidate>
              <label>Name<input name="name" autoComplete="name" /></label>
              <label>Phone<input name="phone" type="tel" autoComplete="tel" /></label>
              <label>Email<input name="email" type="email" autoComplete="email" /></label>
              <label>Service<select name="service" defaultValue=""><option value="" disabled>Select a service</option>{services.map(s => <option key={s.name}>{s.name}</option>)}</select></label>
              <label>Preferred date<input name="date" type="date" /></label>
              <label>Preferred time<select name="time" defaultValue=""><option value="" disabled>Select a time</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label>
              <label className="booking__full">Additional notes<textarea name="notes" rows="3" /></label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="button booking__full" type="submit">Prepare my request <Arrow /></button>
              <small className="booking__full">Frontend demonstration only — no appointment information is stored.</small>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  )
}

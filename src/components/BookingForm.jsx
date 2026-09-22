import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { services } from '../data/services'
import { business } from '../data/business'
import { Arrow } from './Icons'

/**
 * Frontend-only booking request form. Nothing is stored or sent —
 * submission produces a confirmation state with direct contact actions.
 * Supports preselecting a service via /booking?service=<slug>.
 */
export default function BookingForm() {
  const [params] = useSearchParams()
  const preselected = params.get('service')
  const initialService = services.some(s => s.slug === preselected) ? preselected : ''
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [values, setValues] = useState({ name: '', phone: '', email: '', service: initialService, date: '', time: '', notes: '' })

  const serviceOptions = useMemo(() => services.map(s => ({ value: s.slug, label: s.name })), [])

  const setField = event => {
    const { name, value } = event.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const submit = event => {
    event.preventDefault()
    const required = ['name', 'phone', 'email', 'service', 'date', 'time']
    const missing = required.filter(field => !values[field])
    if (missing.length) {
      setError('Please complete your name, contact details, service, preferred date and time.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setSent(true)
  }

  if (sent) {
    return (
      <div className="booking__success">
        <p className="eyebrow">Request prepared</p>
        <h2>Thanks — your appointment request is ready.</h2>
        <p>
          This form does not store or send appointments — it simply prepares your request.
          Get in touch directly and mention {values.name ? `your name (${values.name})` : 'your details'} to confirm
          {values.service ? ` your ${services.find(s => s.slug === values.service)?.name}` : ' your preferred time'}.
        </p>
        <div className="booking__actions">
          <a className="button" href={business.phoneLink}>Call Bambo Nails <Arrow /></a>
          <a className="text-link" href={business.emailLink}>Email the studio <Arrow /></a>
        </div>
      </div>
    )
  }

  return (
    <form className="booking__form" onSubmit={submit} noValidate>
      <label>Name<input name="name" value={values.name} onChange={setField} autoComplete="name" /></label>
      <label>Phone<input name="phone" type="tel" value={values.phone} onChange={setField} autoComplete="tel" /></label>
      <label>Email<input name="email" type="email" value={values.email} onChange={setField} autoComplete="email" /></label>
      <label>
        Service
        <select name="service" value={values.service} onChange={setField}>
          <option value="" disabled>Select a service</option>
          {serviceOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label>Preferred date<input name="date" type="date" value={values.date} onChange={setField} /></label>
      <label>
        Preferred time
        <select name="time" value={values.time} onChange={setField}>
          <option value="" disabled>Select a time</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
      </label>
      <label className="booking__full">Additional notes<textarea name="notes" rows="3" value={values.notes} onChange={setField} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button booking__full" type="submit">Prepare my request <Arrow /></button>
      <small className="booking__full">Frontend demonstration only — no appointment information is stored.</small>
    </form>
  )
}

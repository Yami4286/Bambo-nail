import { services } from '../data/services'
import { Arrow } from './Icons'
import { motion } from 'framer-motion'
import { listItem, listStagger, Reveal } from './Motion'

export default function Services() { return <section className="services section" id="services"><div className="container"><Reveal className="section-head"><div><p className="eyebrow">02 — Service menu</p><h2>Made for your<br /><em>everyday luxury.</em></h2></div><p>Every service is adapted to your personal style, nail health and the details that matter to you.</p></Reveal><motion.div className="service-grid" variants={listStagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: .12 }}>{services.map(service => <motion.article variants={listItem} className="service-card" key={service.name}><span>{service.number}</span><h3>{service.name}</h3><p>{service.description}</p><div className="service-card__meta"><small>{service.duration}</small><b>{service.price}</b></div><a href="#booking" aria-label={`Book ${service.name}`}>Book this service <Arrow /></a></motion.article>)}</motion.div></div></section> }

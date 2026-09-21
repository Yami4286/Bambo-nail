import { Arrow } from './Icons'
import { Reveal } from './Motion'

export default function Intro() {
  return <section className="intro section container" id="about">
    <Reveal><p className="eyebrow">01 — The Bambo approach</p><h2>A little ritual for<br /><em>beautiful hands.</em></h2></Reveal>
    <Reveal className="intro__body" delay={.14}><div className="intro__image"><img loading="lazy" src="https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85" alt="Glossy manicure detail" /></div><p>At Bambo, we see every appointment as a pause in your day. A considered space for meticulous care, effortless polish and a style that feels quietly yours.</p><a href="#contact" className="text-link">Discover the studio <Arrow /></a></Reveal>
  </section>
}

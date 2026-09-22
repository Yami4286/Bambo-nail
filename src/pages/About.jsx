import { Link } from 'react-router-dom'
import { Arrow } from '../components/Icons'
import usePageMeta from '../hooks/usePageMeta'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'
import Philosophy from '../components/Philosophy'
import { Reveal } from '../components/Motion'
import { aboutImage, craftImage } from '../data/gallery'

const philosophyNotes = [
  ['01', 'Detail', 'Every shape, edge and finish receives attention. Nothing leaves the studio half-considered.'],
  ['02', 'Care', 'The experience begins before the polish — clean tools, quiet comfort and unhurried work.'],
  ['03', 'Personal', 'Your nails should reflect your style. We design around you, never a passing trend.'],
]

export default function About() {
  usePageMeta(
    'About Bambo Nails | Nail Care & Beauty',
    'The Bambo Nails philosophy: attention to detail, personal style and meticulous care in a calm, boutique studio.',
  )

  return (
    <PageTransition>
      <PageHero
        label="01 — About Bambo"
        title={<>More than<br />a <em>manicure.</em></>}
      >
        <p>
          Bambo Nails is a boutique studio built around a simple idea — that nail care should feel as considered
          as it looks. Every appointment is a pause in your day, reserved entirely for you.
        </p>
      </PageHero>

      <section className="about-story section container" aria-labelledby="about-story-title">
        <Reveal className="about-story__image">
          <img loading="lazy" src={aboutImage} alt="Nail technician preparing her tools in the Bambo Nails studio" />
        </Reveal>
        <Reveal className="about-story__body" delay={0.1}>
          <p className="eyebrow">Our story</p>
          <h2 id="about-story-title">A studio built on<br /><em>small details.</em></h2>
          <p>
            We believe beauty is a personal ritual, not a production line. Appointments are unhurried, tools are
            immaculate, and every finish is checked twice. The result is nail care that feels quietly luxurious —
            and lasts.
          </p>
          <p>
            From your first visit, you have a space to slow down. Choose a shade, settle in, and leave with nails
            that feel like a better version of your own.
          </p>
        </Reveal>
      </section>

      <section className="philosophy-section section" aria-labelledby="philosophy-title">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Studio philosophy</p>
            <h2 id="philosophy-title">How we<br /><em>work.</em></h2>
          </Reveal>
          <Philosophy notes={philosophyNotes} columns={3} />
        </div>
      </section>

      <section className="about-editorial section" aria-label="Studio imagery">
        <Reveal className="about-editorial__image">
          <img loading="lazy" src={craftImage} alt="A manicure in progress in the calm Bambo Nails studio" />
        </Reveal>
      </section>

      <section className="final-cta section" aria-labelledby="about-cta-title">
        <div className="container final-cta__inner">
          <Reveal>
            <p className="eyebrow">Ready for your next appointment?</p>
            <h2 id="about-cta-title">Reserve your<br /><em>moment.</em></h2>
            <Link className="button" to="/booking">Book now <Arrow /></Link>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  )
}

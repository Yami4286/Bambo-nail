import { Reveal } from './Motion'

/**
 * Editorial hero for inner pages: small label, large serif heading,
 * short supporting copy. Each page composes it with its own content.
 */
export default function PageHero({ label, title, children, className = '' }) {
  return (
    <section className={`page-hero ${className}`} aria-labelledby="page-hero-title">
      <div className="container page-hero__inner">
        <Reveal>
          <p className="eyebrow">{label}</p>
          <h1 id="page-hero-title">{title}</h1>
        </Reveal>
        {children && (
          <Reveal delay={0.12} className="page-hero__copy">
            {children}
          </Reveal>
        )}
      </div>
    </section>
  )
}

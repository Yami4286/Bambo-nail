import { Reveal } from './Motion'

/**
 * Shared heading block: numbered eyebrow label + serif title + aside copy.
 */
export default function SectionHeading({ label, title, aside, className = '' }) {
  return (
    <Reveal className={`section-head ${className}`}>
      <div>
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
      </div>
      {aside && <p>{aside}</p>}
    </Reveal>
  )
}

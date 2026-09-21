import { useState } from 'react'
import { compareImages } from '../data/gallery'
import { Reveal } from './Motion'

export default function BeforeAfter() {
  const [value, setValue] = useState(54)
  return (
    <section className="comparison section container">
      <Reveal className="comparison__copy">
        <p className="eyebrow">05 — The transformation</p>
        <h2>More than a<br /><em>fresh coat.</em></h2>
        <p>Care begins beneath the colour. Slide to see the difference thoughtful preparation makes.</p>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="compare" style={{ '--position': `${value}%` }}>
          <img src={compareImages.after} alt="After: hand with a freshly manicured blush-pink polish resting on a soft white surface" />
          <div className="compare__before">
            <img src={compareImages.before} alt="Before: natural, unpolished nails on a clean white table" />
          </div>
          <span className="compare__label compare__label--before">Before</span>
          <span className="compare__label compare__label--after">After</span>
          <input aria-label="Slide to compare before and after manicure" type="range" min="0" max="100" value={value} onChange={event => setValue(event.target.value)} />
        </div>
      </Reveal>
    </section>
  )
}

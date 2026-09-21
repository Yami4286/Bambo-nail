import { motion } from 'framer-motion'
import { detailImage } from '../data/gallery'
import { Reveal, useListVariants } from './Motion'

const notes = [
  ['01', 'Precise', 'Careful shaping and clean finishes, down to the smallest detail.'],
  ['02', 'Personal', 'Styles selected around your preferences, not a passing trend.'],
  ['03', 'Polished', 'A beautiful final finish made for your everyday.'],
]

export default function Details() {
  const { list, item } = useListVariants()
  return (
    <section className="details section">
      <Reveal className="details__image">
        <img loading="lazy" src={detailImage} alt="French manicured hand gently holding a small white flower" />
      </Reveal>
      <Reveal className="details__content" delay={0.1}>
        <p className="eyebrow">03 — Our signature</p>
        <h2>Details make<br />the <em>difference.</em></h2>
        <motion.div variants={list} initial="hidden" whileInView="show" viewport={{ once: false }}>
          {notes.map(([number, title, copy]) => (
            <motion.article variants={item} className="detail" key={title}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Reveal>
    </section>
  )
}

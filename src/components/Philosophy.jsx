import { motion } from 'framer-motion'
import { Reveal, useListVariants } from './Motion'

/**
 * Numbered editorial blocks (Detail / Care / Personal) used on the
 * About page philosophy section and the Home signature section.
 */
export default function Philosophy({ notes, columns = 1 }) {
  const { list, item } = useListVariants()
  return (
    <motion.div
      className={`philosophy philosophy--${columns}-col`}
      variants={list}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false }}
    >
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
  )
}

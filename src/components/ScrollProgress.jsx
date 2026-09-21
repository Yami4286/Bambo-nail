import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Hairline scroll-progress indicator pinned under the navigation.
 * Rendered as a transform-only bar (no layout work), hidden from
 * assistive tech as it is purely decorative.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}

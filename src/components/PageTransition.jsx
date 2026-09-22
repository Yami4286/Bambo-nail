import { motion, useReducedMotion } from 'framer-motion'

/**
 * Subtle route transition: a short fade with a slight upward settle.
 * Duration is deliberately short so navigation never feels slow.
 */
export default function PageTransition({ children }) {
  const reduce = useReducedMotion()
  return (
    <motion.main
      id="main"
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.main>
  )
}

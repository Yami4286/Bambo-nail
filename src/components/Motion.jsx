import { motion, useReducedMotion } from 'framer-motion'

const VIEWPORT = { once: false, amount: 0.2 }

function useRevealVariants() {
  const reduce = useReducedMotion()
  return {
    hidden: reduce ? {} : { opacity: 0, y: 28 },
    show: reduce ? {} : { opacity: 1, y: 0 },
  }
}

/**
 * Scroll-reveal wrapper. Reveals every time the element enters the viewport
 * (and resets when it fully leaves), so the page feels alive on every visit.
 */
export function Reveal({ children, delay = 0, className = '', as = 'div', ...rest }) {
  const variants = useRevealVariants()
  const Component = motion[as] || motion.div
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={variants}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Component>
  )
}

/** Staggered container/child pair matching Reveal's replayable behaviour. */
export function useListVariants() {
  const reduce = useReducedMotion()
  return {
    list: {
      hidden: {},
      show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
    },
    item: {
      hidden: reduce ? {} : { opacity: 0, y: 24 },
      show: reduce ? {} : { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] } },
    },
  }
}

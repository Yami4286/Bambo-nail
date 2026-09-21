import { motion, useReducedMotion } from 'framer-motion'

export function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const reduce = useReducedMotion()
  const Component = motion[as] || motion.div
  return <Component className={className} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={reduce ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: .7, delay, ease: [0.22, 0.61, 0.36, 1] }}>{children}</Component>
}

export const listStagger = { hidden: {}, show: { transition: { staggerChildren: .09, delayChildren: .08 } } }
export const listItem = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: .55, ease: [0.22, 0.61, 0.36, 1] } } }

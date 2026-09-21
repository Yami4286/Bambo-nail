import { Arrow } from './Icons'
import { motion, useReducedMotion } from 'framer-motion'

export default function Hero() {
  const reduce = useReducedMotion()
  const item = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } }
  return <section className="hero" id="home" aria-labelledby="hero-title">
    <motion.div className="hero__image" initial={reduce ? false : { scale: 1.1 }} animate={reduce ? {} : { scale: 1 }} transition={{ duration: 1.5, ease: [0.22, 0.61, 0.36, 1] }}><img src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1800&q=90" alt="A polished blush manicure held in soft light" fetchPriority="high" /></motion.div>
    <div className="hero__wash" />
    <motion.div className="hero__content container" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .14, delayChildren: .3 } } }}>
      <motion.p variants={item} transition={{ duration: .65 }} className="eyebrow hero__eyebrow">Modern nail care · Your time, beautifully spent</motion.p>
      <motion.h1 variants={item} transition={{ duration: .8, ease: [0.22, 0.61, 0.36, 1] }} id="hero-title">Beautiful nails,<br /><em>thoughtfully done.</em></motion.h1>
      <motion.p variants={item} transition={{ duration: .65 }} className="hero__copy">Modern manicures, detailed nail artistry, and a little time dedicated entirely to you.</motion.p>
      <motion.div variants={item} transition={{ duration: .65 }} className="hero__actions"><a className="button" href="#booking">Book an appointment <Arrow /></a><a className="text-link text-link--light" href="#services">Explore services <Arrow /></a></motion.div>
    </motion.div>
    <a className="scroll-cue" href="#about" aria-label="Scroll to about Bambo Nails"><span /> Scroll to discover</a>
  </section>
}

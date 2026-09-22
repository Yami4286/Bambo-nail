import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Close, Menu } from './Icons'
import { navLinks } from '../data/navigation'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const scroll = () => setSolid(window.scrollY > 32)
    scroll()
    window.addEventListener('scroll', scroll, { passive: true })
    return () => window.removeEventListener('scroll', scroll)
  }, [])

  // Any navigation (or escape) closes the mobile menu; reset scroll state on route change.
  useEffect(() => {
    setOpen(false)
    setSolid(window.scrollY > 32)
  }, [pathname])

  useEffect(() => {
    if (!open) return undefined
    const key = event => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [open])

  // Lock page scroll while the mobile menu covers the screen.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`nav ${solid ? 'nav--solid' : ''}`}>
      <Link className="wordmark" to="/" aria-label="Bambo Nails home">BAMBO <i>NAILS</i></Link>
      <nav id="site-menu" className={open ? 'nav__links nav__links--open' : 'nav__links'} aria-label="Main navigation">
        {navLinks.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) => (isActive ? 'active' : undefined)}
            onClick={close}
          >
            {label}
          </NavLink>
        ))}
        <Link className="nav__mobile-book" to="/booking" onClick={close}>Book an appointment</Link>
      </nav>
      <Link className="button button--small nav__book" to="/booking">Book now</Link>
      <button
        className="icon-button nav__toggle"
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen(!open)}
      >
        {open ? <Close /> : <Menu />}
      </button>
    </header>
  )
}

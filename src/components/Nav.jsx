import { useEffect, useState } from 'react'
import { Close, Menu } from './Icons'

const links = [['Home', 'home'], ['About', 'about'], ['Services', 'services'], ['Nail Gallery', 'gallery'], ['Reviews', 'reviews'], ['Contact', 'contact']]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const scroll = () => setSolid(window.scrollY > 32)
    scroll(); window.addEventListener('scroll', scroll, { passive: true })
    return () => window.removeEventListener('scroll', scroll)
  }, [])
  const close = () => setOpen(false)
  return <header className={`nav ${solid ? 'nav--solid' : ''}`}>
    <a className="wordmark" href="#home" aria-label="Bambo Nails home">BAMBO <i>NAILS</i></a>
    <nav className={open ? 'nav__links nav__links--open' : 'nav__links'} aria-label="Main navigation">
      {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={close}>{label}</a>)}
      <a className="nav__mobile-book" href="#booking" onClick={close}>Book now</a>
    </nav>
    <a className="button button--small nav__book" href="#booking">Book now</a>
    <button className="icon-button nav__toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <Close /> : <Menu />}</button>
  </header>
}

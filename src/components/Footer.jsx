import { Link } from 'react-router-dom'
import { business } from '../data/business'
import { navLinks } from '../data/navigation'

const visitLinks = [
  { label: 'Contact', to: '/contact' },
  { label: 'Book an Appointment', to: '/booking' },
]

/**
 * Global footer with its own content hierarchy (never reuses header
 * structure): brand statement, labelled link groups and a legal line.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link className="wordmark" to="/" aria-label="Bambo Nails home">BAMBO <i>NAILS</i></Link>
            <p className="footer__statement">Beautiful nails,<br />thoughtfully done.</p>
          </div>

          <nav className="footer__col" aria-label="Footer — explore">
            <p className="footer__label">Explore</p>
            {navLinks.filter(l => !['/', '/contact'].includes(l.to)).map(({ label, to }) => (
              <Link key={to} to={to}>{label}</Link>
            ))}
          </nav>

          <nav className="footer__col" aria-label="Footer — visit">
            <p className="footer__label">Visit</p>
            {visitLinks.map(({ label, to }) => <Link key={to} to={to}>{label}</Link>)}
          </nav>

          <div className="footer__col">
            <p className="footer__label">Contact</p>
            <a href={business.phoneLink}>{business.phone}</a>
            <a href={business.emailLink}>{business.email}</a>
            <p className="footer__address">{business.address}</p>
          </div>

          <div className="footer__col">
            <p className="footer__label">Follow</p>
            {Object.entries(business.social).map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noreferrer">{name}</a>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 Bambo Nails. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

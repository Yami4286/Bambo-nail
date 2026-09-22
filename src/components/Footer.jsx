import { Link } from 'react-router-dom'
import { business } from '../data/business'
import { footerNav } from '../data/navigation'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <Link className="wordmark" to="/" aria-label="Bambo Nails home">BAMBO <i>NAILS</i></Link>
            <p>Thoughtful care. Beautiful hands.<br />A little luxury, made personal.</p>
          </div>
          <nav className="footer__nav" aria-label="Footer navigation">
            {footerNav.map(({ label, to }) => <Link key={to} to={to}>{label}</Link>)}
          </nav>
          <div className="footer__contact">
            <a href={business.phoneLink}>{business.phone}</a>
            <a href={business.emailLink}>{business.email}</a>
            <p>{business.address}</p>
          </div>
          <div className="footer__social">
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

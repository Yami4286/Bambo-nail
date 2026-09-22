import { Link } from 'react-router-dom'
import { Arrow } from '../components/Icons'
import usePageMeta from '../hooks/usePageMeta'
import PageTransition from '../components/PageTransition'
import { Reveal } from '../components/Motion'

export default function NotFound() {
  usePageMeta(
    'Page not found | Bambo Nails',
    'The page you are looking for has wandered off. Head back to Bambo Nails.',
  )

  return (
    <PageTransition>
      <section className="not-found section" aria-labelledby="not-found-title">
        <Reveal className="container not-found__inner">
          <p className="eyebrow">404</p>
          <h1 id="not-found-title">This page wandered <em>off.</em></h1>
          <p>The page you are looking for does not exist — but your next appointment does.</p>
          <Link className="button" to="/">Back home <Arrow /></Link>
        </Reveal>
      </section>
    </PageTransition>
  )
}

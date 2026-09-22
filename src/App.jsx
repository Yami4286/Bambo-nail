import { Outlet, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import ScrollProgress from './components/ScrollProgress'
import Footer from './components/Footer'

/**
 * Shared layout: navigation, scroll-progress bar, routed page and footer.
 * The routed page itself renders through the Outlet so App stays tiny.
 */
export default function App() {
  const { pathname } = useLocation()

  // Reset any lightbox scroll-lock or menu lock left over from the previous page.
  if (typeof document !== 'undefined') {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }

  return (
    <>
      <ScrollProgress />
      <Nav />
      <div key={pathname}>
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import ScrollProgress from './components/ScrollProgress'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Details from './components/Details'
import BeforeAfter from './components/BeforeAfter'
import Testimonials from './components/Testimonials'
import Booking from './components/Booking'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 450)
    return () => clearTimeout(id)
  }, [])

  return (
    <>
      <div className={`loader ${loaded ? 'loader--done' : ''}`} aria-hidden="true">BAMBO <i>NAILS</i></div>
      <a className="skip-link" href="#booking">Skip to booking</a>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Services />
        <Gallery />
        <Details />
        <BeforeAfter />
        <Testimonials />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

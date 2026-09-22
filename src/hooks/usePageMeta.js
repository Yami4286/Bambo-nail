import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Per-page document title + meta description, plus scroll handling.
 *
 * Fresh navigations and full page loads always open at the top — only an
 * actual back/forward history traversal restores the previous position.
 * The old implementation keyed positions by history entry, which made
 * every full page load restore a stale shared position (pages appeared
 * to load scrolled down, with the heading hidden behind the navbar).
 */
export default function usePageMeta(title, description) {
  const { pathname, key } = useLocation()

  useEffect(() => {
    document.title = title
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])

  const isBackForward = key !== 'default'

  useEffect(() => {
    if (isBackForward) {
      const saved = Number(sessionStorage.getItem(`scroll:${key}`))
      if (saved) window.scrollTo(0, saved)
      const save = () => sessionStorage.setItem(`scroll:${key}`, String(window.scrollY))
      window.addEventListener('scroll', save, { passive: true })
      return () => window.removeEventListener('scroll', save)
    }
    window.scrollTo(0, 0)
    return undefined
  }, [isBackForward, key, pathname])

  useEffect(() => () => sessionStorage.removeItem(`scroll:${key}`), [key])
}

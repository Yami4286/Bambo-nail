import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Per-page document title + meta description, plus scroll restoration.
 * Restores the scroll position the visitor left at when returning via
 * back/forward, and jumps to the top for a fresh navigation.
 */
export default function usePageMeta(title, description) {
  const { pathname, key } = useLocation()

  useEffect(() => {
    document.title = title
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])

  useEffect(() => {
    const saved = sessionStorage.getItem(`scroll:${key}`)
    if (saved) window.scrollTo(0, Number(saved))
    else window.scrollTo(0, 0)
    const save = () => sessionStorage.setItem(`scroll:${key}`, String(window.scrollY))
    window.addEventListener('scroll', save, { passive: true })
    return () => window.removeEventListener('scroll', save)
  }, [key])

  useEffect(() => () => sessionStorage.removeItem(`scroll:${key}`), [key])
}

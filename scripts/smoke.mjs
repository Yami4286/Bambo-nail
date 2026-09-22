// CDP smoke test for the Bambo Nails multi-page production preview (http://localhost:4173).
// Usage: node scripts/smoke.mjs
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const BASE = 'http://localhost:4173'
const sleep = ms => new Promise(r => setTimeout(r, ms))

// --- reuse a running Chrome or launch headless one ---
let spawned = null
async function cdpUp() {
  try { await fetch('http://127.0.0.1:9222/json/version'); return true } catch { return false }
}
if (!(await cdpUp())) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'bn-chrome-'))
  spawned = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', '--window-size=1440,900', 'about:blank',
  ], { stdio: 'ignore' })
  for (let i = 0; i < 20 && !(await cdpUp()); i++) await sleep(500)
}
await sleep(500)

// --- connect over CDP ---
const list = await (await fetch('http://127.0.0.1:9222/json/list')).json()
const page = list.find(t => t.type === 'page')
if (!page) throw new Error('no page target')

const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })

let mid = 0
const pending = new Map()
const consoleErrors = []

ws.onmessage = event => {
  const msg = JSON.parse(event.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
    return
  }
  if (msg.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(msg.params.type)) {
    consoleErrors.push(msg.params.args.map(a => a.value ?? a.description ?? '').join(' '))
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    consoleErrors.push(String(msg.params.exceptionDetails?.exception?.value ?? msg.params.exceptionDetails?.text ?? 'page exception'))
  }
}

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++mid
    pending.set(id, msg => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)))
    ws.send(JSON.stringify({ id, method, params }))
  })
}

async function evalPage(expression) {
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  if (exceptionDetails) throw new Error('page eval: ' + JSON.stringify(exceptionDetails))
  return result.value
}

const results = []
function check(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

await send('Page.enable')
await send('Runtime.enable')

// --- navigate to a route and wait for render ---
async function go(path, wait = 2500) {
  await send('Page.navigate', { url: BASE + path })
  await sleep(wait)
}

// ---------- HOME ----------
await go('/')
check('home: title', (await evalPage('document.title')) === 'Bambo Nails | Modern Manicures & Nail Art')
check('home: hero rendered', await evalPage("!!document.querySelector('.hero')"))
check('home: hero CTA routes to /booking', (await evalPage("document.querySelector('.hero__actions a.button')?.getAttribute('href')")) === '/booking')
check('home: featured services rendered', await evalPage("document.querySelectorAll('.service-grid .service-card').length") === 4)
check('home: gallery preview has 6 items', await evalPage("document.querySelectorAll('.gallery-grid--preview .gallery-item').length") === 6)
check('home: no in-page hash nav links', await evalPage("[...document.querySelectorAll('header a')].every(a => !a.getAttribute('href').startsWith('#'))"))

// ---------- cross-page nav through the menu ----------
const navPaths = JSON.parse(await evalPage(`JSON.stringify([...document.querySelectorAll('.nav__links a')].map(a => a.getAttribute('href')))`))
check('nav: routes match spec', JSON.stringify(navPaths) === JSON.stringify(['/', '/about', '/services', '/gallery', '/reviews', '/contact', '/booking']), JSON.stringify(navPaths))

await go('/about')
check('about: renders story', await evalPage("!!document.querySelector('.about-story') && !!document.querySelector('.philosophy--3-col')"))
check('about: active nav state', await evalPage("[...document.querySelectorAll('.nav__links a')].find(a => a.getAttribute('href') === '/about')?.classList.contains('active')"))
check('about: title', (await evalPage('document.title')) === 'About Bambo Nails | Nail Care & Beauty')

await go('/services')
check('services: renders 6 catalogue cards in 3 groups', await evalPage("document.querySelectorAll('.services-catalogue .service-card').length") === 6)
check('services: category groups present', await evalPage("document.querySelectorAll('.services-catalogue__group').length") === 3)

await go('/services/gel-manicure')
check('service detail: renders', await evalPage("!!document.querySelector('.service-detail')"))
check('service detail: title', (await evalPage('document.title')) === 'Gel Manicure | Bambo Nails')
check('service detail: book CTA carries query param', (await evalPage("document.querySelector('.page-hero--service .page-hero__cta a')?.getAttribute('href')")) === '/booking?service=gel-manicure')
check('service detail: FAQ present', await evalPage("document.querySelectorAll('.service-faq__item').length >= 2"))

await go('/services/does-not-exist')
check('service detail: unknown slug shows 404', await evalPage("!!document.querySelector('.not-found')"))

await go('/gallery')
check('gallery: renders with filters', await evalPage("document.querySelectorAll('.filters button').length >= 5"))
const g = JSON.parse(await evalPage(`(async () => {
  const out = {}
  window.scrollTo(0, 400); await new Promise(r => setTimeout(r, 600))
  out.before = document.querySelectorAll('.gallery-item').length
  const frenchBtn = [...document.querySelectorAll('.filters button')].find(b => b.textContent === 'French')
  frenchBtn.click(); await new Promise(r => setTimeout(r, 800))
  out.filtered = document.querySelectorAll('.gallery-item').length
  out.filterPressed = frenchBtn.getAttribute('aria-pressed')
  ;[...document.querySelectorAll('.filters button')].find(b => b.textContent === 'All').click()
  await new Promise(r => setTimeout(r, 800))
  document.querySelector('.gallery-item__button').click(); await new Promise(r => setTimeout(r, 800))
  out.lightboxOpen = !!document.querySelector('.lightbox')
  out.lightboxFocused = document.activeElement?.classList?.contains('lightbox')
  out.counter = document.querySelector('.lightbox p')?.textContent.slice(0, 2)
  out.scrollLocked = document.documentElement.style.overflow === 'hidden'
  document.querySelector('.lightbox__next').click(); await new Promise(r => setTimeout(r, 500))
  out.nextWorks = !!document.querySelector('.lightbox img')
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await new Promise(r => setTimeout(r, 700))
  out.closesOnEscape = !document.querySelector('.lightbox')
  out.scrollUnlocked = document.documentElement.style.overflow === ''
  return JSON.stringify(out)
})()`))
check('gallery: filter narrows items', g.filtered > 0 && g.filtered < g.before, `${g.before} -> ${g.filtered}`)
check('gallery: filter exposes aria-pressed', g.filterPressed === 'true')
check('gallery: lightbox opens with counter', g.lightboxOpen && g.lightboxFocused && g.counter === '01')
check('gallery: lightbox locks page scroll', g.scrollLocked)
check('gallery: lightbox next/prev work', g.nextWorks)
check('gallery: lightbox closes on Escape', g.closesOnEscape)
check('gallery: scroll restored after close', g.scrollUnlocked)

await go('/reviews')
check('reviews: featured + 5 cards, no overlap at 390px', await (async () => {
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
  await sleep(600)
  const ok = await evalPage(`(() => {
    const name = document.querySelector('.reviews-featured .reviews__name')
    const role = document.querySelector('.reviews-featured .reviews__role')
    if (!name || !role) return false
    const r = el => { const b = el.getBoundingClientRect(); return { l: b.left, rt: b.right, t: b.top, b: b.bottom } }
    const a = r(name), c = r(role)
    return !(a.l < c.rt - 0.5 && c.l < a.rt - 0.5 && a.t < c.b - 0.5 && c.t < a.b - 0.5)
  })()`)
  await send('Emulation.clearDeviceMetricsOverride')
  return ok && await evalPage("document.querySelectorAll('.review-card').length") === 5
})())

await go('/booking')
check('booking: form renders with labelled fields', await evalPage("['name','phone','email','service','date','time','notes'].every(n => document.querySelector(`[name=${n}]`))"))
const b = JSON.parse(await evalPage(`(() => {
  const form = document.querySelector('.booking__form')
  const submitBtn = form.querySelector('button[type=submit]')
  submitBtn.click()
  return Promise.resolve().then(() => new Promise(r => setTimeout(() => r(JSON.stringify({
    errorShown: !!document.querySelector('.form-error'),
    errorRole: document.querySelector('.form-error')?.getAttribute('role'),
  })), 400)))
})()`))
check('booking: blocks empty submit with role=alert error', b.errorShown === true && b.errorRole === 'alert')
const b2 = JSON.parse(await evalPage(`(async () => {
  const set = (name, value) => {
    const el = document.querySelector('[name=' + name + ']')
    const proto = el.tagName === 'SELECT' ? HTMLSelectElement : HTMLInputElement
    Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }
  set('name', 'Test Guest'); set('phone', '0400 000 000'); set('email', 'guest@example.com')
  set('service', 'gel-manicure'); set('date', '2026-10-01'); set('time', 'morning')
  document.querySelector('.booking__form button[type=submit]').click()
  await new Promise(r => setTimeout(r, 400))
  return JSON.stringify({ successShown: !!document.querySelector('.booking__success'), callLink: document.querySelector('.booking__success a.button')?.getAttribute('href') })
})()`))
check('booking: succeeds when filled', b2.successShown === true)
check('booking: confirmation offers call action', (b2.callLink || '').startsWith('tel:'))

await go('/booking?service=nail-art')
check('booking: query param preselects service', await evalPage("document.querySelector('[name=service]')?.value") === 'nail-art')

await go('/contact')
check('contact: renders info + map link', await evalPage("!!document.querySelector('.contact-page__info') && document.querySelector('.map-card')?.href.includes('maps.google.com')"))

await go('/no-such-page')
check('404: branded page with back-home link', await evalPage("!!document.querySelector('.not-found') && document.querySelector('.not-found a.button')?.getAttribute('href') === '/'"))

// footer structure + no stale scroll on fresh load, on every page
for (const path of ['/', '/about', '/services', '/gallery', '/reviews', '/booking', '/contact']) {
  await go(path, 1800)
  const page = JSON.parse(await evalPage(`(() => {
    const labels = [...document.querySelectorAll('.footer__label')].map(el => el.textContent)
    const footerLinks = document.querySelectorAll('.footer a').length
    const usesHeaderNav = !!document.querySelector('.footer .nav__links, .footer .nav__toggle')
    const contactImgs = [...document.images].length
    return JSON.stringify({ labels, footerLinks, usesHeaderNav, contactImgs })
  })()`))
  check(`${path}: loads at top (no stale scroll under navbar)`, await evalPage('window.scrollY') === 0)
  check(`${path}: footer labelled groups (Explore/Visit/Contact/Follow)`, JSON.stringify(page.labels) === JSON.stringify(['Explore', 'Visit', 'Contact', 'Follow']), JSON.stringify(page.labels))
  check(`${path}: footer has own structure + enough links`, page.footerLinks >= 10 && !page.usesHeaderNav)
  if (path === '/contact') {
    check('contact: no duplicated <img> stacking', page.contactImgs === 0, `${page.contactImgs} imgs`)
    const mapCard = await evalPage("getComputedStyle(document.querySelector('.map-card')).backgroundImage.includes('1610992015732')")
    check('contact: map-card keeps studio background', mapCard)
  }
  if (path === '/booking') {
    check('booking: aside image present', await evalPage("!!document.querySelector('.booking-page__image')"))
    const control = await evalPage(`(() => {
      const el = document.querySelector('[name=service]')
      const s = getComputedStyle(el)
      return s.appearance === 'none' || s.webkitAppearance === 'none'
    })()`)
    check('booking: custom select styling applied', control)
  }
}

// scroll progress reacts to scrolling
await go('/')
const p0 = await evalPage("getComputedStyle(document.querySelector('.scroll-progress')).transform")
await evalPage('window.scrollTo(0, document.body.scrollHeight)')
await sleep(800)
const p2 = await evalPage("getComputedStyle(document.querySelector('.scroll-progress')).transform")
check('scroll progress bar animates', p0 !== p2, `${p0} -> ${p2}`)

// mobile navigation
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
await sleep(800)
const m = JSON.parse(await evalPage(`(() => {
  const out = {}
  out.hScroll = document.documentElement.scrollWidth > window.innerWidth + 1
  out.toggleVisible = getComputedStyle(document.querySelector('.nav__toggle')).display !== 'none'
  document.querySelector('.nav__toggle').click()
  return new Promise(res => setTimeout(() => {
    out.menuOpen = document.querySelector('.nav__links').classList.contains('nav__links--open')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyIdentifier: 'Escape', bubbles: true }))
    setTimeout(() => {
      out.menuClosesOnEscape = !document.querySelector('.nav__links').classList.contains('nav__links--open')
      res(JSON.stringify(out))
    }, 500)
  }, 600))
})()`))
check('mobile: no horizontal scroll', m.hScroll === false)
check('mobile: menu toggle visible', m.toggleVisible)
check('mobile: menu opens on toggle', m.menuOpen)
check('mobile: menu closes on Escape', m.menuClosesOnEscape)
await evalPage("document.querySelector('.nav__toggle').click(); document.querySelector('.nav__links a').click()")
await sleep(500)
check('mobile: menu closes after nav click', await evalPage("!document.querySelector('.nav__links').classList.contains('nav__links--open')"))

await send('Emulation.clearDeviceMetricsOverride')

// images all load across key pages (scroll first so lazy images actually load)
for (const path of ['/', '/about', '/gallery', '/services/gel-manicure']) {
  await go(path, 2200)
  await evalPage(`(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y)
      await new Promise(r => setTimeout(r, 130))
    }
    window.scrollTo(0, 0)
  })()`)
  await sleep(900)
  const imgs = JSON.parse(await evalPage(`Promise.race([
    Promise.all([...document.images].map(i =>
      i.complete ? Promise.resolve(i.naturalWidth > 0) : new Promise(res => {
        const t = setTimeout(() => res('timeout'), 12000)
        i.addEventListener('load', () => { clearTimeout(t); res(true) })
        i.addEventListener('error', () => { clearTimeout(t); res(false) })
      })
    )).then(vals => JSON.stringify({ total: vals.length, broken: vals.filter(v => v !== true).length })),
    new Promise(res => setTimeout(() => res(JSON.stringify({ total: document.images.length, broken: -1 })), 25000)),
  ])`))
  check(`images load on ${path}`, imgs.broken === 0, `${imgs.total} images`)
}

// reduced motion: emulate BEFORE load
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await go('/services', 3500)
const rm = JSON.parse(await evalPage(`(async () => {
  const out = {}
  out.media = matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo(0, 600); await new Promise(r => setTimeout(r, 350))
  out.opacityImmediately = getComputedStyle(document.querySelector('.services-catalogue .section-head')).opacity
  return JSON.stringify(out)
})()`))
check('reduced-motion: media query matches', rm.media === true)
check('reduced-motion: no reveal animation', Number(rm.opacityImmediately) === 1, `opacity=${rm.opacityImmediately}`)

await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })

check('no console errors during run', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))

const failed = results.filter(r => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
ws.close()
if (spawned) spawned.kill()
process.exit(failed.length ? 1 : 0)

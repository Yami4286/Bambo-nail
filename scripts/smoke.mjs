// CDP smoke test for the Bambo Nails production preview (http://localhost:4173).
// Usage: node scripts/smoke.mjs
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

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

// --- run checks ---
await send('Page.navigate', { url: 'http://localhost:4173/' })
await sleep(3500)

check('page title', (await evalPage('document.title')) === 'Bambo Nails | Modern Manicures & Nail Art')
check('app rendered into #root', await evalPage("!!document.querySelector('#root .hero')"))

// nav + in-page anchors
const nav = JSON.parse(await evalPage(`(() => {
  const ids = ['home','about','services','gallery','reviews','booking','contact']
  const missing = ids.filter(id => !document.getElementById(id))
  const links = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href'))
  const dead = [...new Set(links.filter(h => h.length > 1 && !document.querySelector(h)))]
  return JSON.stringify({ missing, dead })
})()`))
check('all section anchors exist', nav.missing.length === 0, nav.missing.join(','))
check('all in-page links resolve', nav.dead.length === 0, nav.dead.join(','))

// scroll progress reacts to scrolling
const p0 = await evalPage("getComputedStyle(document.querySelector('.scroll-progress')).transform")
await evalPage('window.scrollTo(0, document.body.scrollHeight / 2)')
await sleep(800)
const p1 = await evalPage("getComputedStyle(document.querySelector('.scroll-progress')).transform")
await evalPage('window.scrollTo(0, document.body.scrollHeight)')
await sleep(800)
const p2 = await evalPage("getComputedStyle(document.querySelector('.scroll-progress')).transform")
check('scroll progress bar animates', p0 !== p1 && p1 !== p2, `${p0} -> ${p1} -> ${p2}`)

// replayable reveals
const replay = JSON.parse(await evalPage(`(async () => {
  const probe = document.querySelector('#services .section-head')
  const op = () => getComputedStyle(probe).opacity
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 700))
  window.scrollTo(0, document.querySelector('#services').offsetTop); await new Promise(r => setTimeout(r, 1400))
  const shown = op()
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 800))
  const hidden = op()
  window.scrollTo(0, document.querySelector('#services').offsetTop); await new Promise(r => setTimeout(r, 1400))
  const shown2 = op()
  return JSON.stringify({ shown, hidden, shown2 })
})()`))
check('reveal plays in view', Number(replay.shown) > 0.9, `opacity=${replay.shown}`)
check('reveal resets out of view (replayable)', Number(replay.hidden) < 0.25, `opacity=${replay.hidden}`)
check('reveal replays on re-entry', Number(replay.shown2) > 0.9, `opacity=${replay.shown2}`)

// transformation slider: new image pair + interaction
const cmp = JSON.parse(await evalPage(`(async () => {
  window.scrollTo(0, document.querySelector('.comparison').offsetTop); await new Promise(r => setTimeout(r, 900))
  const imgs = [...document.querySelectorAll('.compare img')]
  const out = { after: imgs[0]?.src || '', before: imgs[1]?.src || '' }
  out.loaded = await Promise.all(imgs.map(i => i.complete ? Promise.resolve(i.naturalWidth > 0) : new Promise(res => { i.onload = () => res(true); i.onerror = () => res(false) })))
  const box = document.querySelector('.compare')
  const input = document.querySelector('.compare input')
  const setVal = v => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, v); input.dispatchEvent(new Event('input', { bubbles: true })) }
  setVal(20)
  await new Promise(r => setTimeout(r, 200))
  out.pos20 = box.style.getPropertyValue('--position')
  setVal(80)
  await new Promise(r => setTimeout(r, 200))
  out.pos80 = box.style.getPropertyValue('--position')
  out.labels = [...document.querySelectorAll('.compare__label')].map(l => l.textContent)
  return JSON.stringify(out)
})()`))
check('compare uses new before image (natural nails)', cmp.before.includes('1688583417770'), cmp.before.slice(-45))
check('compare uses new after image (blush manicure)', cmp.after.includes('1688583417757'), cmp.after.slice(-45))
check('compare images all load', cmp.loaded.every(Boolean))
check('compare slider responds to input', cmp.pos20 === '20%' && cmp.pos80 === '80%', `${cmp.pos20} -> ${cmp.pos80}`)
check('compare keeps BEFORE/AFTER labels', cmp.labels.join('|') === 'Before|After')

// gallery filter + lightbox
const g = JSON.parse(await evalPage(`(async () => {
  const out = {}
  window.scrollTo(0, document.querySelector('#gallery').offsetTop); await new Promise(r => setTimeout(r, 1000))
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
  out.scrollLocked = document.documentElement.style.overflow === 'hidden'
  document.querySelector('.lightbox__next').click(); await new Promise(r => setTimeout(r, 500))
  out.nextWorks = !!document.querySelector('.lightbox img')
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await new Promise(r => setTimeout(r, 700))
  out.closesOnEscape = !document.querySelector('.lightbox')
  out.scrollUnlocked = document.documentElement.style.overflow === ''
  return JSON.stringify(out)
})()`))
check('gallery filter narrows items', g.filtered > 0 && g.filtered < g.before, `${g.before} -> ${g.filtered}`)
check('filter exposes aria-pressed', g.filterPressed === 'true')
check('lightbox opens and takes focus', g.lightboxOpen && g.lightboxFocused)
check('lightbox locks page scroll', g.scrollLocked)
check('lightbox next/prev work', g.nextWorks)
check('lightbox closes on Escape', g.closesOnEscape)
check('scroll restored after close', g.scrollUnlocked)

// kind words: name/role/counter/buttons must never overlap at any width
const overlapFailures = []
for (const width of [320, 375, 390, 430, 768, 1440]) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 800 })
  await sleep(500)
  const res = JSON.parse(await evalPage(`(async () => {
    window.scrollTo(0, document.querySelector('#reviews').offsetTop); await new Promise(r => setTimeout(r, 800))
    const name = document.querySelector('.reviews__name')
    const role = document.querySelector('.reviews__role')
    const counter = document.querySelector('.review-controls span')
    const btns = [...document.querySelectorAll('.review-controls button')]
    if (!name || !role || !counter || btns.length < 2) return JSON.stringify({ missing: true })
    const r = el => { const b = el.getBoundingClientRect(); return { l: b.left, rt: b.right, t: b.top, b: b.bottom } }
    const boxes = { counter: r(counter), name: r(name), next: r(btns[1]), prev: r(btns[0]), role: r(role) }
    const hit = (a, b) => a.l < b.rt - 0.5 && b.l < a.rt - 0.5 && a.t < b.b - 0.5 && b.t < a.b - 0.5
    const overlaps = []
    const keys = Object.keys(boxes)
    for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) if (hit(boxes[keys[i]], boxes[keys[j]])) overlaps.push(keys[i] + '+' + keys[j])
    const visible = name.getBoundingClientRect().height > 0 && counter.getBoundingClientRect().height > 0
    return JSON.stringify({ overlaps, visible })
  })()`))
  if (res.missing || !res.visible || res.overlaps.length) overlapFailures.push(`${width}: ${res.missing ? 'missing elements' : res.overlaps.join(',') || 'invisible'}`)
  console.log(`  width ${width}: ${res.missing ? 'MISSING' : res.overlaps.length ? 'OVERLAP ' + res.overlaps.join(',') : 'ok'}`)
}
await send('Emulation.clearDeviceMetricsOverride')
check('reviews: name/role/counter/buttons never overlap at any width', overlapFailures.length === 0, overlapFailures.join(' | '))

// booking form
const b = JSON.parse(await evalPage(`(async () => {
  window.scrollTo(0, document.querySelector('#booking').offsetTop); await new Promise(r => setTimeout(r, 1000))
  const form = document.querySelector('.booking__form')
  const submitBtn = form.querySelector('button[type=submit]')
  submitBtn.click(); await new Promise(r => setTimeout(r, 400))
  const out = { errorShown: !!document.querySelector('.form-error'), errorRole: document.querySelector('.form-error')?.getAttribute('role') }
  const name = form.querySelector('[name=name]')
  name.value = 'Test Guest'; name.dispatchEvent(new Event('input', { bubbles: true }))
  const email = form.querySelector('[name=email]')
  email.value = 'guest@example.com'; email.dispatchEvent(new Event('input', { bubbles: true }))
  const select = form.querySelector('select[name=service]')
  select.value = select.options[1].value; select.dispatchEvent(new Event('change', { bubbles: true }))
  submitBtn.click(); await new Promise(r => setTimeout(r, 400))
  out.successShown = !!document.querySelector('.booking__success')
  return JSON.stringify(out)
})()`))
check('booking blocks empty submit with error', b.errorShown === true)
check('booking error uses role=alert', b.errorRole === 'alert')
check('booking succeeds when filled', b.successShown === true)

// images all load
const imgs = JSON.parse(await evalPage(`Promise.all([...document.images].map(i =>
  i.complete ? Promise.resolve(i.naturalWidth > 0) : new Promise(res => { i.addEventListener('load', () => res(true)); i.addEventListener('error', () => res(false)) })
)).then(vals => JSON.stringify({ total: vals.length, broken: vals.filter(v => !v).length }))`))
check('all images load', imgs.broken === 0, `${imgs.total} images`)

// reduced motion: emulate BEFORE load so useReducedMotion initializes correctly
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await send('Page.reload')
await sleep(3500)
const rm = JSON.parse(await evalPage(`(async () => {
  const out = {}
  out.media = matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo(0, document.querySelector('#services').offsetTop); await new Promise(r => setTimeout(r, 350))
  out.opacityImmediately = getComputedStyle(document.querySelector('#services .section-head')).opacity
  out.cueDuration = parseFloat(getComputedStyle(document.querySelector('.scroll-cue span')).animationDuration)
  return JSON.stringify(out)
})()`))
check('reduced-motion: media query matches', rm.media === true)
check('reduced-motion: no reveal animation', Number(rm.opacityImmediately) === 1, `opacity=${rm.opacityImmediately}`)
check('reduced-motion: CSS animations disabled', rm.cueDuration < 0.001, `duration=${rm.cueDuration}`)
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })

// mobile viewport
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
await sleep(800)
const m = JSON.parse(await evalPage(`(() => {
  const out = {}
  out.hScroll = document.documentElement.scrollWidth > window.innerWidth + 1
  out.toggleVisible = getComputedStyle(document.querySelector('.nav__toggle')).display !== 'none'
  out.bookHidden = getComputedStyle(document.querySelector('.nav__book')).display === 'none'
  document.querySelector('.nav__toggle').click()
  return new Promise(res => setTimeout(() => {
    out.menuOpen = document.querySelector('.nav__links').classList.contains('nav__links--open')
    res(JSON.stringify(out))
  }, 600))
})()`))
check('mobile: no horizontal scroll', m.hScroll === false)
check('mobile: menu toggle visible', m.toggleVisible)
check('mobile: desktop book button hidden', m.bookHidden === true)
check('mobile: menu opens on toggle', m.menuOpen)
await evalPage("document.querySelector('.nav__links a').click()")
await sleep(500)
check('mobile: menu closes after nav click', await evalPage("!document.querySelector('.nav__links').classList.contains('nav__links--open')"))
await send('Emulation.clearDeviceMetricsOverride')

check('no console errors during run', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))

const failed = results.filter(r => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
ws.close()
if (spawned) spawned.kill()
process.exit(failed.length ? 1 : 0)

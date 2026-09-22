import { gallery } from './gallery'

const relatedFor = slug => gallery.filter(item => item.serviceTag === slug)

const service = config => ({ ...config, related: relatedFor(config.slug) })

export const services = [
  service({
    slug: 'classic-manicure',
    number: '01',
    name: 'Classic Manicure',
    tagline: 'Clean shape, considered cuticle care and a polished finish.',
    duration: '45 min',
    price: 'From $XX',
    finish: 'Regular polish',
    recommendedFor: 'A tidy refresh and healthy natural nails',
    category: 'Manicures',
    description: 'A clean, timeless manicure built on careful shaping, gentle cuticle care and a polished finish chosen to suit you.',
    included: [
      'Consultation on shape and finish',
      'Gentle shaping and cuticle care',
      'Hand cleanse and light massage',
      'Polish in the colour of your choice',
    ],
    experience: [
      'A short chat about your nails and the finish you love',
      'Relaxing, unhurried shaping and cuticle work',
      'A calming hand massage before polish',
      'Careful, even polish application and finishing touches',
    ],
    faq: [
      ['How long does it take?', 'Around 45 minutes from consultation to final finish.'],
      ['How should I prepare?', 'Come as you are. Old polish is removed as part of the appointment.'],
    ],
  }),
  service({
    slug: 'gel-manicure',
    number: '02',
    name: 'Gel Manicure',
    tagline: 'Long-lasting colour with a smooth, high-gloss finish.',
    duration: '60 min',
    price: 'From $XX',
    finish: 'High-gloss gel',
    recommendedFor: 'A durable, chip-resistant finish for everyday wear',
    category: 'Manicures',
    description: 'A clean, long-lasting gel finish designed for polished everyday wear — colour that keeps its shine for weeks.',
    included: [
      'Shape, cuticle care and nail prep',
      'Base, colour and top gel layers',
      'LED curing between every layer',
      'Cuticle oil to finish',
    ],
    experience: [
      'We help you choose a shade that suits your skin tone',
      'Meticulous prep so the gel adheres beautifully',
      'Thin, even layers cured to a glassy shine',
      'Aftercare tips to keep your manicure flawless',
    ],
    faq: [
      ['How long does it take?', 'Around 60 minutes, including prep and curing time.'],
      ['How long does it last?', 'Typically two to three weeks with good aftercare.'],
      ['How should I prepare?', 'No special preparation needed — we handle everything in the studio.'],
    ],
  }),
  service({
    slug: 'nail-art',
    number: '03',
    name: 'Nail Art',
    tagline: 'Custom, detailed designs thoughtfully made for your style.',
    duration: 'Add-on',
    price: 'Price on request',
    finish: 'Hand-painted detail',
    recommendedFor: 'Personalised designs, from minimal to detailed',
    category: 'Nail Art',
    description: 'Custom nail art designed with you — from a single fine detail to a full hand-painted set, always made for your style.',
    included: [
      'Design consultation and references',
      'Colour matching for your base manicure',
      'Hand-painted or detailed art application',
      'Sealed and finished for lasting wear',
    ],
    experience: [
      'Bring inspiration or start from a blank page',
      'We sketch and adapt the design to your nails',
      'Artwork applied with fine brushes and steady patience',
      'A protective finish so every detail lasts',
    ],
    faq: [
      ['How long does it take?', 'It depends on the design — simple detail adds around 15 minutes, full art more.'],
      ['How should I prepare?', 'Save a few references you love. We refine them together in the studio.'],
    ],
  }),
  service({
    slug: 'french-manicure',
    number: '04',
    name: 'French Manicure',
    tagline: 'A timeless, impeccably clean take on the classic French.',
    duration: '60 min',
    price: 'From $XX',
    finish: 'Classic or modern French',
    recommendedFor: 'An elegant, polished look for any occasion',
    category: 'Manicures',
    description: 'The timeless French, done impeccably — crisp smile lines, a clean nude base and a finish that never dates.',
    included: [
      'Shaping, cuticle care and nail prep',
      'Nude or sheer base colour',
      'Hand-painted crisp smile lines',
      'Glossy or matte top coat',
    ],
    experience: [
      'Choose a classic white tip or a soft modern shade',
      'Tips are painted freehand for a natural curve',
      'Layered finish for depth and shine',
      'A manicure that suits everything you wear',
    ],
    faq: [
      ['How long does it take?', 'Around 60 minutes for the full French application.'],
      ['How should I prepare?', 'Nothing needed — just bring your preferred tip style if you have one in mind.'],
    ],
  }),
  service({
    slug: 'biab',
    number: '05',
    name: 'BIAB / Builder Gel',
    tagline: 'Natural-looking structure and strength for everyday polish.',
    duration: '75 min',
    price: 'From $XX',
    finish: 'Builder gel overlay',
    recommendedFor: 'Weak or brittle nails that need strength',
    category: 'Nail Enhancement',
    description: 'Builder gel that adds natural-looking strength and structure — ideal for growing and protecting your natural nails.',
    included: [
      'Nail health check and prep',
      'Builder gel application sculpted to your nail',
      'Curing and refinement for a natural curve',
      'Colour or a clean natural finish on top',
    ],
    experience: [
      'We assess your nails and agree the right structure',
      'Gel is built in thin layers for strength without bulk',
      'Refined until the finish looks like your nail, only better',
      'Regular infills keep your nails thriving',
    ],
    faq: [
      ['How long does it take?', 'Around 75 minutes for a full builder gel application.'],
      ['Will it damage my nails?', 'Applied and removed correctly, builder gel protects the natural nail as it grows.'],
      ['How should I prepare?', 'Just come along — we build from wherever your nails are today.'],
    ],
  }),
  service({
    slug: 'extensions',
    number: '06',
    name: 'Nail Extensions',
    tagline: 'Elegant extensions tailored to your preferred length and shape.',
    duration: '90 min',
    price: 'From $XX',
    finish: 'Sculpted extensions',
    recommendedFor: 'Added length with a graceful, natural look',
    category: 'Nail Enhancement',
    description: 'Elegant extensions tailored to your preferred length and shape — balanced, light and beautifully natural.',
    included: [
      'Length and shape consultation',
      'Extension application sculpted to you',
      'Blending, refining and shaping',
      'Colour, gel or art to finish',
    ],
    experience: [
      'We agree a length that suits your hands and lifestyle',
      'Extensions are sculpted and blended seamlessly',
      'Finished with the colour or art of your choice',
      'Aftercare guidance for lasting wear',
    ],
    faq: [
      ['How long does it take?', 'Around 90 minutes for a full set of extensions.'],
      ['How should I prepare?', 'Know your preferred length and shape — almond, square or anything between.'],
    ],
  }),
]

export const serviceCategories = ['Manicures', 'Nail Enhancement', 'Nail Art']

export const findService = slug => services.find(service => service.slug === slug)

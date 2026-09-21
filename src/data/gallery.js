const image = (id, width = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=85`

export const heroImage = image('1659391542239-9648f307c0b1', 1800)
export const studioImage = image('1610992015732-2449b76344bc', 900)
export const detailImage = image('1762373349045-c2decd4ec3f3', 1200)
export const compareImages = {
  before: image('1688583417770-ff6cc18071dc', 1200),
  after: image('1688583417757-9060cba25399', 1200),
}

export const gallery = [
  { id: 1, category: 'Minimal', title: 'Barely there', alt: 'Glossy neutral manicure in soft studio light', src: image('1659391542239-9648f307c0b1') },
  { id: 2, category: 'French', title: 'Soft French', alt: 'French manicure with glitter accents on elegant hands', src: image('1772322586754-34c9e6f5be6f') },
  { id: 3, category: 'Nude', title: 'Quiet luxury', alt: 'Nude manicured hand with a delicate gold ring', src: image('1648844421753-351afd50486a') },
  { id: 4, category: 'Glam', title: 'Rose lacquer', alt: 'Deep rose polished nails resting on a neutral surface', src: image('1727199433272-70fdb94c8430') },
  { id: 5, category: 'Nail Art', title: 'Fine heart', alt: 'Blush nails with fine white heart nail art', src: image('1754799670410-b282791342c3') },
  { id: 6, category: 'Seasonal', title: 'Bloom finish', alt: 'French manicured hand holding a small white flower', src: image('1762373349045-c2decd4ec3f3') },
]

export const galleryCategories = ['All', ...new Set(gallery.map(({ category }) => category))]

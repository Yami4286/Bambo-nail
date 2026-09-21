const image = (id, query) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85${query ? `&${query}` : ''}`

export const gallery = [
  { id: 1, category: 'Minimal', title: 'Pearl finish', alt: 'Minimal glossy pale manicure', src: image('1604654894610-df63bc536371') },
  { id: 2, category: 'French', title: 'Soft French', alt: 'Soft French manicure close up', src: image('1610992015732-2449b76344bc') },
  { id: 3, category: 'Nude', title: 'Barely there', alt: 'Nude polished manicure', src: image('1607779097040-26e80aa78e66') },
  { id: 4, category: 'Glam', title: 'Rose chrome', alt: 'Glossy rose coloured manicure', src: image('1596704017254-9b121068fb31') },
  { id: 5, category: 'Nail Art', title: 'Fine line', alt: 'Detailed nail art manicure', src: image('1632345031435-8727f6897d53') },
  { id: 6, category: 'Seasonal', title: 'Autumn lacquer', alt: 'Warm seasonal manicure', src: image('1612817288484-6f916006741a') },
]

export const galleryCategories = ['All', ...new Set(gallery.map(({ category }) => category))]

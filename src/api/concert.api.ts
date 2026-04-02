import type { Concert } from '@/types/concert'
import client from './client'

const DEFAULT_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
]

function generateDefaultImage(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  const idx = Math.abs(hash) % DEFAULT_GRADIENTS.length
  const gradient = DEFAULT_GRADIENTS[idx]!
  const colors = gradient.match(/#[0-9a-f]{6}/gi) || ['#667eea', '#764ba2']

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors[0]}"/>
        <stop offset="100%" style="stop-color:${colors[1]}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#g)"/>
    <text x="400" y="230" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="48" font-family="sans-serif" font-weight="bold">OPEN TRAUM</text>
    <text x="400" y="280" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-size="20" font-family="sans-serif">TICKETING SYSTEM</text>
  </svg>`

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}

function withDefaultImage(concert: Concert): Concert {
  if (concert.image) return concert
  return { ...concert, image: generateDefaultImage(concert.title || String(concert.id)) }
}

export const concertApi = {
  async getAll(): Promise<Concert[]> {
    const { data } = await client.get<Concert[]>('/v1/concerts')
    return data.map((c) => withDefaultImage({ ...c, id: String(c.id), image: c.image || '' }))
  },

  async getById(id: string): Promise<Concert | undefined> {
    const { data } = await client.get<Concert>(`/v1/concerts/${id}`)
    if (!data) return undefined
    return withDefaultImage({ ...data, id: String(data.id), image: data.image || '' })
  },
}

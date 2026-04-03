import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BarberShop Amman',
    short_name: 'BarberShop',
    description: 'Premium Grooming Experience',
    start_url: '/',
    display: 'standalone',
    theme_color: '#d4af37',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '192x192 512x512',
        type: 'image/x-icon',
        purpose: 'maskable',
      },
    ],
  }
}

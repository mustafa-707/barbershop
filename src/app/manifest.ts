import type { MetadataRoute } from 'next'
import { db } from '~/server/db'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await db.query.settings.findFirst();
  
  return {
    name: settings?.siteNameEn ?? 'BarberShop',
    short_name: settings?.siteNameEn ?? 'BarberShop',
    description: settings?.descriptionEn ?? 'Premium Grooming Experience',
    start_url: '/',
    display: 'standalone',
    theme_color: settings?.primaryColor ?? '#d4af37',
    icons: [
      {
        src: settings?.faviconUrl ?? '/favicon.ico',
        sizes: '192x192 512x512',
        type: 'image/x-icon',
        purpose: 'maskable',
      },
    ],
  }
}

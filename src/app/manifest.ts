import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'LAN — Launched, Noted, Never Forgotten',
    short_name: 'LAN',
    description: 'Sistema de gestão para barbearia e salão',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f4f6f5',
    theme_color: '#172c29',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}

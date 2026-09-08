import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import localFont from 'next/font/local'
import { QueryProvider } from '@/providers/QueryProvider'
import './globals.css'

// Use the Geist files bundled with our pinned Next version; builds need no font download.
const geistSans = localFont({ src: '../../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2', variable: '--font-geist-sans', display: 'swap', weight: '100 900' })
const geistMono = localFont({ src: '../../node_modules/next/dist/next-devtools/server/font/geist-mono-latin.woff2', variable: '--font-geist-mono', display: 'swap', weight: '100 900' })

export const metadata: Metadata = {
  title:       'LAN — Launched, Noted, Never Forgotten',
  description: 'Sistema de gestão para barbearia e salão',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale   = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            {children}
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Cinzel, Cinzel_Decorative, EB_Garamond } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '600', '900'],
})

const cinzelDeco = Cinzel_Decorative({
  subsets: ['latin'],
  variable: '--font-cinzel-deco',
  weight: ['400', '700'],
})

const garamond = EB_Garamond({
  subsets: ['latin', 'greek'],
  variable: '--font-garamond',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Βυζάντιον — Justinian\'s Empire',
  description: 'An interactive 3D wireframe map of the Byzantine Empire under Justinian I (527–565 AD)',
  icons: {
    icon: '/logo/logo.ico',
    shortcut: '/logo/logo.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cinzelDeco.variable} ${garamond.variable}`}>
      <body className="bg-[#050608] text-amber-100 antialiased">{children}</body>
    </html>
  )
}

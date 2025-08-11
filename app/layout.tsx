import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavigationWrapper from './components/NavigationWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Janseva Kendra (Private) - Serving Humanity',
  description: 'Your one-stop solution for all government and digital services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/webp" href="/icons/481573786_593041823723784_4398692427343624609_n-removebg-preview.webp" />
      </head>
      <body className={inter.className}>
        <NavigationWrapper />
        <main className="min-h-screen pt-16 bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
} 
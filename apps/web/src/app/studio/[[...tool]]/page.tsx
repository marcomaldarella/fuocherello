import dynamic from 'next/dynamic'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Sanity Studio',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

const StudioClient = dynamic(() => import('./StudioClient'), { ssr: false })

export default function StudioPage() {
  return <StudioClient />
}

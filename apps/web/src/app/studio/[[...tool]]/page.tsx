import dynamic from 'next/dynamic'

export { metadata, viewport } from 'next-sanity/studio'

const StudioClient = dynamic(() => import('./StudioClient'), { ssr: false })

export default function StudioPage() {
  return <StudioClient />
}

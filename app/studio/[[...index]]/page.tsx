import { headers } from 'next/headers'
import { StudioLoader } from '@/components/studio-loader'
import { metadata as studioMetadata, viewport as studioViewport } from 'next-sanity/studio'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Portfolio Studio',
}

export const viewport: Viewport = {
  ...studioViewport,
}

const STUDIO_HOST = 'studio.larissasoares.dev'

export default async function StudioPage() {
  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  const basePath = host.startsWith(STUDIO_HOST) ? '/' : '/studio'
  return <StudioLoader basePath={basePath} />
}

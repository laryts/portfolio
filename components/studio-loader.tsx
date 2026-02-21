'use client'

import dynamic from 'next/dynamic'

const StudioEmbed = dynamic(
  () => import('@/components/studio-embed').then((mod) => mod.StudioEmbed),
  { ssr: false }
)

interface StudioLoaderProps {
  /** Pass '/' when host is studio.larissasoares.dev */
  basePath?: string
}

export function StudioLoader({ basePath = '/studio' }: StudioLoaderProps) {
  return (
    <div
      className="min-h-screen max-h-dvh w-full overflow-auto"
      style={{
        height: '100vh',
        maxHeight: '100dvh',
        overscrollBehavior: 'none',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <StudioEmbed basePath={basePath} />
    </div>
  )
}

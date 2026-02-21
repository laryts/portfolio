'use client'

import { NextStudio } from 'next-sanity/studio'
import { getStudioConfig } from '@/sanity/config'

interface StudioEmbedProps {
  /** Use '/' when served from studio.larissasoares.dev so URL stays clean */
  basePath?: string
}

export function StudioEmbed({ basePath = '/studio' }: StudioEmbedProps) {
  const config = getStudioConfig(basePath)
  return <NextStudio config={config} />
}

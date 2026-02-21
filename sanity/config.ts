import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

/** Use basePath: '/' when served from studio.larissasoares.dev, else '/studio' */
export function getStudioConfig(basePath: string = '/studio') {
  return defineConfig({
    name: 'portfolio',
    title: 'Portfolio Studio',
    projectId,
    dataset,
    basePath,
    schema: {
      types: schemaTypes,
    },
    plugins: [structureTool(), visionTool()],
  })
}

export const sanityConfig = getStudioConfig('/studio')

'use client'

import { PortableText as PortableTextLib, type PortableTextComponents } from 'next-sanity'
import { urlFor } from '@/sanity/client'
import type { PortableTextBlock } from '@/lib/sanity/types'
import type { SanityImageAsset } from '@/lib/sanity/types'

interface PortableTextProps {
  value: PortableTextBlock[] | null
  className?: string
}

const imageComponent = ({ value }: { value: SanityImageAsset & { _key?: string } }) => {
  if (!value?.asset) return null
  const src = urlFor(value).width(800).height(500).fit('max').url()
  return (
    <figure className="my-6">
      <img
        src={src}
        alt=""
        className="rounded-lg w-full h-auto"
      />
    </figure>
  )
}

const components: PortableTextComponents = {
  types: {
    image: imageComponent,
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-deep-purple-500 pl-4 my-4 italic text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 my-4 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 my-4 space-y-1">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-2">{children}</li>,
    number: ({ children }) => <li className="ml-2">{children}</li>,
  },
}

export function PortableText({ value, className = '' }: PortableTextProps) {
  if (!value || value.length === 0) return null
  return (
    <div className={`prose dark:prose-invert prose-lg max-w-none ${className}`}>
      <PortableTextLib value={value} components={components} />
    </div>
  )
}

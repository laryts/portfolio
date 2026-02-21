import { getDictionary } from '@/dictionaries'
import type { Locale } from '@/types/i18n'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft } from 'lucide-react'
import { SocialShareButtons } from '@/components/social-share-buttons'
import { ErrorBoundary } from '@/components/error-boundary'
import { PortableText } from '@/components/portable-text'
import { getBlogPostBySlug } from '@/lib/sanity/blog'
import { urlFor } from '@/sanity/client'
import { format } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const post = await getBlogPostBySlug(slug, lang)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://larissasoares.dev'

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const postUrl = `${siteUrl}/${lang}/blog/${slug}`
  const publishedTime = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined

  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    authors: [{ name: 'Larissa Soares' }],
    openGraph: {
      type: 'article',
      locale: lang === 'en' ? 'en_US' : 'pt_BR',
      alternateLocale: lang === 'en' ? 'pt_BR' : 'en_US',
      url: postUrl,
      title: post.title,
      description: post.summary,
      publishedTime,
      tags: post.tags,
      authors: ['Larissa Soares'],
      siteName: 'Larissa Soares Portfolio',
      ...(post.mainImage && {
        images: [urlFor(post.mainImage).width(1200).height(630).url()],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      creator: '@larissasoares',
    },
    alternates: {
      canonical: postUrl,
      languages: {
        en: `${siteUrl}/en/blog/${slug}`,
        pt: `${siteUrl}/pt/blog/${slug}`,
      },
    },
  }
}

function formatPostDate(isoDate: string | null, lang: Locale): string {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  return format(date, 'd MMMM yyyy', { locale: lang === 'pt' ? ptBR : enUS })
}

export default async function BlogPost({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params
  const dictionary = await getDictionary(lang)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://larissasoares.dev'

  const post = await getBlogPostBySlug(slug, lang)
  if (!post) notFound()

  const postUrl = `${siteUrl}/${lang}/blog/${slug}`
  const publishedIso = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined
  const imageUrl =
    post.mainImage != null ? urlFor(post.mainImage).width(1200).height(630).url() : `${siteUrl}/images/larissa.jpg`

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: imageUrl,
    datePublished: publishedIso,
    dateModified: publishedIso,
    author: {
      '@type': 'Person',
      name: 'Larissa Soares',
      url: `${siteUrl}/${lang}`,
    },
    publisher: {
      '@type': 'Person',
      name: 'Larissa Soares',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: (post.tags ?? []).join(', '),
    inLanguage: lang === 'en' ? 'en-US' : 'pt-BR',
  }

  const formattedDate = formatPostDate(post.publishedAt, lang)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <div className="min-h-screen bg-white dark:bg-dark-purple-950 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        <div className="pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
          <Link
            href={`/${lang}#blog`}
            className="inline-flex items-center text-deep-purple-900 dark:text-deep-purple-400 hover:text-deep-purple-800 dark:hover:text-deep-purple-300 transition-colors mb-8"
          >
            <ArrowLeft size={16} className="mr-1" />{' '}
            {lang === 'en' ? 'Back to blog' : 'Voltar para o blog'}
          </Link>

          {formattedDate && (
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
              <Calendar size={16} className="mr-2" />
              <span>{formattedDate}</span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {(post.tags ?? []).map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-deep-purple-100 dark:bg-deep-purple-900 text-deep-purple-800 dark:text-deep-purple-200 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <ErrorBoundary
            fallback={
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 my-8">
                <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">
                  {lang === 'en' ? 'Error loading content' : 'Erro ao carregar conteúdo'}
                </h3>
                <p className="text-red-700 dark:text-red-300">
                  {lang === 'en'
                    ? "We're sorry, but there was an error loading this article. Please try again later."
                    : 'Desculpe, mas ocorreu um erro ao carregar este artigo. Por favor, tente novamente mais tarde.'}
                </p>
              </div>
            }
          >
            <PortableText value={post.body} />
          </ErrorBoundary>

          <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-8">
            <SocialShareButtons
              url={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/${lang}/blog/${slug}`}
              title={post.title}
              language={lang as 'en' | 'pt'}
            />
          </div>
        </div>
      </div>
    </>
  )
}

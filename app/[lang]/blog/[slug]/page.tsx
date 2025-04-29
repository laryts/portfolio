import { getDictionary } from "@/dictionaries"
import type { Locale } from "@/types/i18n"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, ArrowLeft } from "lucide-react"
import { SocialShareButtons } from "@/components/social-share-buttons"
import { ErrorBoundary } from "@/components/error-boundary"

// Simple content components that don't rely on dynamic imports
const BlogContent = ({ lang, slug }: { lang: Locale; slug: string }) => {
  // For English content
  if (lang === "en") {
    if (slug === "reactPerformance") {
      return (
        <div className="prose dark:prose-invert prose-lg max-w-none">
          <p className="lead">
            Performance optimization is crucial for delivering a smooth user experience in React applications. In this
            article, I'll explore advanced techniques for identifying and resolving performance bottlenecks.
          </p>

          <h2>Understanding React's Rendering Process</h2>
          <p>
            Before diving into optimization techniques, it's essential to understand how React's rendering process
            works. React uses a virtual DOM to efficiently update the actual DOM. When a component's state or props
            change, React creates a new virtual DOM tree, compares it with the previous one (a process called
            "diffing"), and then updates only the parts of the actual DOM that have changed.
          </p>

          {/* More content would go here */}
          <p>
            This is a simplified version of the article. The full content would include detailed explanations of
            performance optimization techniques, code examples, and best practices.
          </p>
        </div>
      )
    }

    if (slug === "designSystems") {
      return (
        <div className="prose dark:prose-invert prose-lg max-w-none">
          <p className="lead">
            Design systems are essential for maintaining consistency across large applications. In this article, I'll
            share how to leverage StencilJS to create reusable web components that work across any framework.
          </p>

          <h2>What is a Design System?</h2>
          <p>
            A design system is a collection of reusable components, guided by clear standards, that can be assembled to
            build any number of applications. It's more than just a UI kit or component library—it's a comprehensive
            system that includes design principles, component libraries, documentation, and more.
          </p>

          {/* More content would go here */}
          <p>
            This is a simplified version of the article. The full content would include detailed explanations of design
            systems, StencilJS, and implementation strategies.
          </p>
        </div>
      )
    }

    if (slug === "mobileDevTips") {
      return (
        <div className="prose dark:prose-invert prose-lg max-w-none">
          <p className="lead">
            After years of working with React Native, I've compiled a list of best practices that can help you build
            more maintainable and performant mobile applications.
          </p>

          <h2>The Evolution of React Native</h2>
          <p>
            React Native has come a long way since its initial release in 2015. With the introduction of the new
            architecture (Fabric and TurboModules), improved TypeScript support, and a growing ecosystem of libraries,
            React Native has matured into a robust platform for building cross-platform mobile applications.
          </p>

          {/* More content would go here */}
          <p>
            This is a simplified version of the article. The full content would include detailed explanations of React
            Native best practices, code examples, and performance optimization techniques.
          </p>
        </div>
      )
    }
  }

  // For Portuguese content
  if (lang === "pt") {
    if (slug === "reactPerformance") {
      return (
        <div className="prose dark:prose-invert prose-lg max-w-none">
          <p className="lead">
            A otimização de performance é crucial para oferecer uma experiência de usuário fluida em aplicações React.
            Neste artigo, explorarei técnicas avançadas para identificar e resolver gargalos de performance.
          </p>

          <h2>Entendendo o Processo de Renderização do React</h2>
          <p>
            Antes de mergulhar nas técnicas de otimização, é essencial entender como funciona o processo de renderização
            do React. O React utiliza um DOM virtual para atualizar eficientemente o DOM real. Quando o estado ou as
            props de um componente mudam, o React cria uma nova árvore de DOM virtual, compara-a com a anterior (um
            processo chamado "diffing") e, em seguida, atualiza apenas as partes do DOM real que foram alteradas.
          </p>

          {/* More content would go here */}
          <p>
            Esta é uma versão simplificada do artigo. O conteúdo completo incluiria explicações detalhadas de técnicas
            de otimização de performance, exemplos de código e melhores práticas.
          </p>
        </div>
      )
    }

    // Add other Portuguese content as needed
  }

  // Default content for posts without specific content
  return (
    <div className="prose dark:prose-invert prose-lg max-w-none">
      <p className="text-lg leading-relaxed mb-6">
        This content is coming soon. Please check back later for the full article.
      </p>
    </div>
  )
}

export default async function BlogPost({
  params: { lang, slug },
}: {
  params: { lang: Locale; slug: string }
}) {
  const dictionary = getDictionary(lang)

  // Get the blog post data based on the slug
  const postKey = Object.keys(dictionary.blog.posts).find((key) => key === slug)

  if (!postKey) {
    notFound()
  }

  const post = dictionary.blog.posts[postKey as keyof typeof dictionary.blog.posts]

  return (
    <div className="min-h-screen bg-white dark:bg-dark-purple-950 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
        <Link
          href={`/${lang}#blog`}
          className="inline-flex items-center text-deep-purple-900 dark:text-deep-purple-400 hover:text-deep-purple-800 dark:hover:text-deep-purple-300 transition-colors mb-8"
        >
          <ArrowLeft size={16} className="mr-1" /> {lang === "en" ? "Back to blog" : "Voltar para o blog"}
        </Link>

        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
          <Calendar size={16} className="mr-2" />
          <span>{post.date}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag: string) => (
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
                {lang === "en" ? "Error loading content" : "Erro ao carregar conteúdo"}
              </h3>
              <p className="text-red-700 dark:text-red-300">
                {lang === "en"
                  ? "We're sorry, but there was an error loading this article. Please try again later."
                  : "Desculpe, mas ocorreu um erro ao carregar este artigo. Por favor, tente novamente mais tarde."}
              </p>
            </div>
          }
        >
          <BlogContent lang={lang} slug={slug} />
        </ErrorBoundary>

        {/* Add social sharing buttons */}
        <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-8">
          <SocialShareButtons
            url={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/${lang}/blog/${slug}`}
            title={post.title}
            language={lang as "en" | "pt"}
          />
        </div>
      </div>
    </div>
  )
}

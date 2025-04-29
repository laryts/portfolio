import { Link } from "lucide-react";
import { AnimateOnScroll } from "../animate-on-scroll";
import { BlogPostCard } from "../blog-post-card";

type BlogSectionProps = {
    dictionary: any
    lang: string
}

export function BlogSection({ dictionary, lang }: BlogSectionProps) {
    return (
        <section id="blog" className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
          <AnimateOnScroll animation="fade" duration={0.8}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">{dictionary.blog.title}</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
              {dictionary.blog.subtitle}
            </p>
          </AnimateOnScroll>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimateOnScroll animation="slide-up" duration={0.6} delay={0.1}>
              <BlogPostCard
                title={dictionary.blog.posts.reactPerformance.title}
                date={dictionary.blog.posts.reactPerformance.date}
                summary={dictionary.blog.posts.reactPerformance.summary}
                tags={dictionary.blog.posts.reactPerformance.tags}
                slug="reactPerformance"
                readMoreText={dictionary.blog.readMore}
              />
            </AnimateOnScroll>
  
            <AnimateOnScroll animation="slide-up" duration={0.6} delay={0.2}>
              <BlogPostCard
                title={dictionary.blog.posts.designSystems.title}
                date={dictionary.blog.posts.designSystems.date}
                summary={dictionary.blog.posts.designSystems.summary}
                tags={dictionary.blog.posts.designSystems.tags}
                slug="designSystems"
                readMoreText={dictionary.blog.readMore}
              />
            </AnimateOnScroll>
  
            <AnimateOnScroll animation="slide-up" duration={0.6} delay={0.3}>
              <BlogPostCard
                title={dictionary.blog.posts.mobileDevTips.title}
                date={dictionary.blog.posts.mobileDevTips.date}
                summary={dictionary.blog.posts.mobileDevTips.summary}
                tags={dictionary.blog.posts.mobileDevTips.tags}
                slug="mobileDevTips"
                readMoreText={dictionary.blog.readMore}
              />
            </AnimateOnScroll>
          </div>
  
          <AnimateOnScroll animation="fade" duration={0.6} delay={0.4}>
            <div className="mt-12 text-center">
              <Link
                href={`/${lang}/blog`}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-deep-purple-900 text-white font-medium hover:bg-deep-purple-800 transition-colors duration-300"
              >
                {dictionary.blog.viewAll}
              </Link>
            </div>
          </AnimateOnScroll>
        </section>
    )
}
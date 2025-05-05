import { AnimateOnScroll } from "../animate-on-scroll";
import Image from "next/image";
type AboutSectionProps = {
  dictionary: any
}

export function AboutSection({ dictionary }: AboutSectionProps) {
  if (!dictionary) {
    return null
  }

  return (
    <section id="about" className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
      <AnimateOnScroll animation="fade" duration={0.8}>
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{dictionary.about.title}</h2>
      </AnimateOnScroll>
      <div className="flex flex-col md:flex-row items-center gap-12">
        <AnimateOnScroll animation="slide-right" duration={0.8} className="w-full md:w-1/3">
          <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-deep-purple-900">
            <Image src="/images/larissa.jpg" alt="Larissa Soares" fill className="object-cover" />
          </div>
        </AnimateOnScroll>
        <div className="w-full md:w-2/3">
          <AnimateOnScroll animation="slide-left" duration={0.8}>
            <p className="text-lg leading-relaxed">{dictionary.about.description}</p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade" duration={0.8} delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="px-6 py-2 rounded-full border-2 border-deep-purple-900 text-deep-purple-900 dark:text-deep-purple-400 hover:bg-deep-purple-900 hover:text-white transition-colors duration-300"
              >
                {dictionary.about.contactButton}
              </a>
              <a
                href="#projects"
                className="px-6 py-2 rounded-full border-2 border-deep-purple-900 text-deep-purple-900 dark:text-deep-purple-400 hover:bg-deep-purple-900 hover:text-white transition-colors duration-300"
              >
                {dictionary.about.projectsButton}
              </a>
              <a
                href="/resume-larissa-soares.pdf"
                download
                className="px-6 py-2 rounded-full bg-deep-purple-900 text-white hover:bg-deep-purple-800 transition-colors duration-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {dictionary.about.downloadResume}
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
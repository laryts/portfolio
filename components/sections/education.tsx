import { AnimateOnScroll } from "../animate-on-scroll";

type EducationSectionProps = {
    dictionary: any
}

export function EducationSection({ dictionary }: EducationSectionProps) {
    return (
        <section className="py-20 px-4 md:px-8 bg-gray-100 dark:bg-dark-purple-900 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            <AnimateOnScroll animation="fade" duration={0.8}>
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{dictionary.education.title}</h2>
            </AnimateOnScroll>
            <div className="max-w-3xl mx-auto">
              <AnimateOnScroll animation="slide-up" duration={0.6}>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold">{dictionary.education.degree}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{dictionary.education.institution}</p>
                  <p className="text-gray-500 dark:text-gray-500 mt-1">{dictionary.education.period}</p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>
    )
}
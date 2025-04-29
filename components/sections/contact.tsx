import { AnimateOnScroll } from "../animate-on-scroll";
import { ContactLink } from "../contact-link";
type ContactSectionProps = {
    dictionary: any
}

export function ContactSection({ dictionary }: ContactSectionProps) {
    return (

      <section id="contact" className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
      <AnimateOnScroll animation="fade" duration={0.8}>
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{dictionary.contact.title}</h2>
      </AnimateOnScroll>
      <div className="max-w-md mx-auto text-center">
        <AnimateOnScroll animation="slide-up" duration={0.6}>
          <p className="text-lg mb-4">{dictionary.contact.description}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{dictionary.contact.location}</p>
        </AnimateOnScroll>
        <AnimateOnScroll animation="slide-up" duration={0.6} delay={0.1}>
          <div className="flex justify-center gap-6 mb-8">
            <ContactLink
              platform="email"
              href="mailto:laritavaressoares@gmail.com"
              label="Email"
            />
            <ContactLink platform="github" href="https://github.com/laryts" label="GitHub" />
            <ContactLink platform="linkedin" href="https://linkedin.com/in/larissasoares" label="LinkedIn" />
          </div>
          <div className="mt-6">
            <a
              href="/resume-larissa-soares.pdf"
              download
              className="inline-flex items-center px-6 py-3 rounded-lg bg-deep-purple-900 text-white font-medium hover:bg-deep-purple-800 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
        <AnimateOnScroll animation="fade" duration={0.8} delay={0.2}>
          <form className="mt-8 space-y-4">
            <div>
              <input
                type="text"
                placeholder={dictionary.contact.form.name}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-deep-purple-500"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder={dictionary.contact.form.email}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-deep-purple-500"
              />
            </div>
            <div>
              <textarea
                placeholder={dictionary.contact.form.message}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-deep-purple-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-deep-purple-900 text-white font-medium hover:bg-deep-purple-800 transition-colors duration-300"
            >
              {dictionary.contact.form.submit}
            </button>
          </form>
        </AnimateOnScroll>
      </div>
    </section>
    )
}
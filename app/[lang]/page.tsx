import Image from "next/image"
import Link from "next/link"
import { ProjectCard } from "@/components/project-card"
import { ExperienceItem } from "@/components/experience-item"
import { ContactLink } from "@/components/contact-link"
import { LightBulb } from "@/components/light-bulb"
import { AnimateOnScroll } from "@/components/animate-on-scroll"
import { BlogPostCard } from "@/components/blog-post-card"
import { GitHubContributionsChart } from "@/components/github-contributions-chart" // Add this import
import { getDictionary } from "@/dictionaries"
import type { Locale } from "@/types/i18n"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Larissa Soares | Senior Front-End Engineer",
  description:
    "Portfolio of Larissa Soares, a front-end engineer with 7 years of experience in React, Next.js, and React Native.",
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return (
    <div className="relative min-h-screen bg-white dark:bg-dark-purple-950 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Hero Section */}
      <AnimateOnScroll animation="fade" duration={1.2}>
          <div className="absolute left-1/2 -translate-x-1/2 z-10">
            <LightBulb dictionary={dictionary} />
          </div>
        </AnimateOnScroll>
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        

        {/* Efeito de spotlight */}
        <div className="spotlight"></div>

        <div className="name-container mt-32">
          <AnimateOnScroll animation="fade" duration={0.8} className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight name-glow">{dictionary.hero.title}</h1>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade" duration={0.8} delay={0.2} className="relative z-10">
            <h2 className="text-xl md:text-2xl mt-4 text-gray-600 dark:text-gray-400">{dictionary.hero.subtitle}</h2>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll animation="fade" duration={0.8} delay={0.4} className="relative z-10">
          <div className="mt-8">
            <a
              href="#about"
              className="px-6 py-3 rounded-full bg-deep-purple-900 text-white hover:bg-deep-purple-800 transition-colors duration-300"
            >
              {dictionary.hero.cta}
            </a>
          </div>
        </AnimateOnScroll>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <AnimateOnScroll animation="fade" duration={0.8}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{dictionary.about.title}</h2>
        </AnimateOnScroll>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <AnimateOnScroll animation="slide-right" duration={0.8} className="w-full md:w-1/3">
            <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-deep-purple-900">
              <Image src="/placeholder.svg?height=256&width=256" alt="Larissa Soares" fill className="object-cover" />
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
                  className="px-6 py-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
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

      {/* Projects Section */}
      <section
        id="projects"
        className="py-20 px-4 md:px-8 bg-gray-100 dark:bg-dark-purple-900 transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll animation="fade" duration={0.8}>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{dictionary.projects.title}</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimateOnScroll animation="zoom" duration={0.6} delay={0.1}>
              <ProjectCard
                title="IPICMobile"
                description={dictionary.projects.projectDescriptions.IPICMobile}
                imageUrl="/placeholder.svg?height=200&width=300"
                projectUrl="#"
                viewProjectText={dictionary.projects.viewProject}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="zoom" duration={0.6} delay={0.2}>
              <ProjectCard
                title="MGNG Website"
                description={dictionary.projects.projectDescriptions.MGNGWebsite}
                imageUrl="/placeholder.svg?height=200&width=300"
                projectUrl="#"
                viewProjectText={dictionary.projects.viewProject}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="zoom" duration={0.6} delay={0.3}>
              <ProjectCard
                title="Freelance Photographer Website"
                description={dictionary.projects.projectDescriptions.FreelancePhotographer}
                imageUrl="/placeholder.svg?height=200&width=300"
                projectUrl="#"
                viewProjectText={dictionary.projects.viewProject}
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <AnimateOnScroll animation="fade" duration={0.8}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{dictionary.skills.title}</h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
          <AnimateOnScroll animation="slide-right" duration={0.6} delay={0.1}>
            <h3 className="text-xl font-bold mb-4">{dictionary.skills.categories.frontend}</h3>
            <div className="flex flex-wrap gap-3">
              {[
                "React",
                "React Native",
                "Next.js",
                "Tailwind CSS",
                "Expo",
                "Angular",
                "VueJS",
                "StencilJS",
                "JavaScript (ES6+)",
                "TypeScript",
                "Styled Components",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-sm bg-deep-purple-100 dark:bg-deep-purple-900 text-deep-purple-800 dark:text-deep-purple-200 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-left" duration={0.6} delay={0.2}>
            <h3 className="text-xl font-bold mb-4">{dictionary.skills.categories.backend}</h3>
            <div className="flex flex-wrap gap-3">
              {["Node.js", "Express", "REST APIs", "GraphQL"].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-sm bg-deep-purple-100 dark:bg-deep-purple-900 text-deep-purple-800 dark:text-deep-purple-200 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-right" duration={0.6} delay={0.3}>
            <h3 className="text-xl font-bold mb-4">{dictionary.skills.categories.stateManagement}</h3>
            <div className="flex flex-wrap gap-3">
              {["Context API", "Akita", "Vuex", "Redux", "Zustand"].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-sm bg-deep-purple-100 dark:bg-deep-purple-900 text-deep-purple-800 dark:text-deep-purple-200 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-left" duration={0.6} delay={0.4}>
            <h3 className="text-xl font-bold mb-4">{dictionary.skills.categories.devOps}</h3>
            <div className="flex flex-wrap gap-3">
              {[
                "Vercel",
                "Docker",
                "AWS (S3, Lambda, DynamoDB)",
                "DataDog",
                "Amplitude",
                "GitHub Actions",
                "CI/CD pipelines",
                "Jira",
                "Figma",
                "PostHog",
                "Sentry",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-sm bg-deep-purple-100 dark:bg-deep-purple-900 text-deep-purple-800 dark:text-deep-purple-200 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-right" duration={0.6} delay={0.5}>
            <h3 className="text-xl font-bold mb-4">{dictionary.skills.categories.database}</h3>
            <div className="flex flex-wrap gap-3">
              {["Postgres", "MySQL", "SQL Server", "MongoDB", "Drizzle ORM"].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-sm bg-deep-purple-100 dark:bg-deep-purple-900 text-deep-purple-800 dark:text-deep-purple-200 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-left" duration={0.6} delay={0.6}>
            <h3 className="text-xl font-bold mb-4">{dictionary.skills.categories.others}</h3>
            <div className="flex flex-wrap gap-3">
              {[
                "UI/UX Design",
                "Design Systems",
                "SEO",
                "Agile methodologies",
                "Test-driven development (TDD)",
                "Jest",
                "Storybook",
                "Photoshop",
                "Illustrator",
                "CorelDraw",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-sm bg-deep-purple-100 dark:bg-deep-purple-900 text-deep-purple-800 dark:text-deep-purple-200 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* GitHub Contributions Section - Add this section */}
      {/* <section className="py-20 px-4 md:px-8 bg-gray-100 dark:bg-dark-purple-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll animation="fade" duration={0.8}>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{dictionary.github.title}</h2>
          </AnimateOnScroll>

          <GitHubContributionsChart
            username="laryts" // Replace with the actual GitHub username
            title={dictionary.github.title}
            subtitle={dictionary.github.subtitle}
            loadingText={dictionary.github.loading}
            errorText={dictionary.github.error}
            totalText={dictionary.github.total}
          />
        </div>
      </section> */}

      {/* Experience Section */}
      <section
        id="xp"
        className="py-20 px-4 md:px-8 bg-gray-100 dark:bg-dark-purple-900 transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll animation="fade" duration={0.8}>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{dictionary.experience.title}</h2>
          </AnimateOnScroll>
          <div className="space-y-12">
            <AnimateOnScroll animation="slide-up" duration={0.6} delay={0.1}>
              <ExperienceItem
                role={dictionary.experience.roles.softwareEngineerManager.role}
                company={dictionary.experience.roles.softwareEngineerManager.company}
                period={dictionary.experience.roles.softwareEngineerManager.period}
                description={dictionary.experience.roles.softwareEngineerManager.description}
                technologies={["React", "Next.js", "TypeScript", "Node.js"]}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="slide-up" duration={0.6} delay={0.2}>
              <ExperienceItem
                role={dictionary.experience.roles.seniorFrontEndMercadoLivre.role}
                company={dictionary.experience.roles.seniorFrontEndMercadoLivre.company}
                period={dictionary.experience.roles.seniorFrontEndMercadoLivre.period}
                description={dictionary.experience.roles.seniorFrontEndMercadoLivre.description}
                technologies={["React", "Zustand", "Node", "DataDog", "GIT", "Jira", "Figma"]}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="slide-up" duration={0.6} delay={0.3}>
              <ExperienceItem
                role={dictionary.experience.roles.seniorMobileEngineer.role}
                company={dictionary.experience.roles.seniorMobileEngineer.company}
                period={dictionary.experience.roles.seniorMobileEngineer.period}
                description={dictionary.experience.roles.seniorMobileEngineer.description}
                technologies={[
                  "React Native",
                  "React",
                  "Node",
                  "AWS",
                  "DataDog",
                  "Amplitude",
                  "GIT",
                  "Styled Components",
                  "Jira",
                  "Figma",
                ]}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="slide-up" duration={0.6} delay={0.4}>
              <ExperienceItem
                role={dictionary.experience.roles.seniorFrontEndEverest.role}
                company={dictionary.experience.roles.seniorFrontEndEverest.company}
                period={dictionary.experience.roles.seniorFrontEndEverest.period}
                description={dictionary.experience.roles.seniorFrontEndEverest.description}
                technologies={["React", "UI", "Design System", "Content Dev", "Storybook"]}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="slide-up" duration={0.6} delay={0.5}>
              <ExperienceItem
                role={dictionary.experience.roles.seniorFrontEndPicPay.role}
                company={dictionary.experience.roles.seniorFrontEndPicPay.company}
                period={dictionary.experience.roles.seniorFrontEndPicPay.period}
                description={dictionary.experience.roles.seniorFrontEndPicPay.description}
                technologies={[
                  "Angular",
                  "Docusaurus",
                  "Node",
                  "AWS",
                  "StencilJS",
                  "Tailwind",
                  "Google Analytics",
                  "Swagger",
                  "GIT",
                  "Figma",
                  "Jira",
                ]}
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Blog Section */}
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

      {/* Education Section */}
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

      {/* Contact Section */}
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

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        <AnimateOnScroll animation="fade" duration={0.6}>
          <p>
            © {new Date().getFullYear()} Larissa Soares. {dictionary.footer.copyright}
          </p>
        </AnimateOnScroll>
      </footer>
    </div>
  )
}

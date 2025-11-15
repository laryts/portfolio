import { getDictionary } from "@/dictionaries"
import type { Locale } from "@/types/i18n"
import { normalizeUrl } from "@/lib/utils"
import { locales } from "@/proxy"
import { notFound } from "next/navigation"
import { 
  PersonalSection, 
  HeroSection, 
  AboutSection, 
  ProjectsSection, 
  SkillsSection, 
  ExperiencesSection,
  BlogSection,
  EducationSection,
  ContactSection
} from "@/components/sections"

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  
  // Validate locale is valid
  if (!locales.includes(lang as Locale)) {
    notFound()
  }
  
  const dictionary = await getDictionary(lang)
  
  // Validate dictionary is loaded
  if (!dictionary || !dictionary.about) {
    throw new Error(`Dictionary not loaded properly for locale: ${lang}`)
  }
  
  const siteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL)

  // Structured data for Person/Profile
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Larissa Soares",
    jobTitle: lang === "en" ? "Senior Software Engineer" : "Engenheira de Software Sênior",
    description: dictionary.about.description,
    url: `${siteUrl}/${lang}`,
    image: `${siteUrl}/images/larissa.jpg`,
    sameAs: [
      // Add your social media profiles here
      // "https://github.com/larissasoares",
      // "https://linkedin.com/in/larissasoares",
      // "https://twitter.com/larissasoares",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "React Native",
      "TypeScript",
      "JavaScript",
      "Frontend Development",
      "Web Development",
      "Software Engineering",
    ],
    alumniOf: {
      "@type": "Organization",
      name: dictionary?.education?.institution || "University",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative min-h-screen bg-white dark:bg-dark-purple-950 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        <HeroSection dictionary={dictionary} />

        <AboutSection dictionary={dictionary} />

        <PersonalSection dictionary={dictionary} />

        {/* <ProjectsSection dictionary={dictionary} /> */}

        <SkillsSection dictionary={dictionary} />

        <ExperiencesSection dictionary={dictionary} />

        {/* <BlogSection dictionary={dictionary} lang={lang} /> */}

        <EducationSection dictionary={dictionary} />

        <ContactSection dictionary={dictionary} />
      </div>
    </>
  )
}

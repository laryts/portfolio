import { getDictionary } from "@/dictionaries"
import type { Locale } from "@/types/i18n"
import type { Metadata } from "next"
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
  )
}

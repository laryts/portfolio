import { AnimateOnScroll } from "../animate-on-scroll";

type SkillsSectionProps = {
  dictionary: any
}

export function SkillsSection({ dictionary }: SkillsSectionProps) {
  return (
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
  )
}
import { dictionary } from "@/dictionaries/en";
import { AnimateOnScroll } from "../animate-on-scroll";

type SkillsSectionProps = {
  dictionary: any
}

const skills = {
    frontend: {
        title: dictionary.skills.categories.frontend,
        items: [
            "React",
            "React Native",
            "Next.js",
            "Angular",
            "VueJS",
            "Tailwind CSS",
            "Expo",
            "StencilJS",
            "JavaScript (ES6+)",
            "TypeScript",
            "Jest",
            "Styled Components",
        ],
    },
    backend: {
        title: dictionary.skills.categories.backend,
        items: [
            "Node.js",
            "Express",
            "REST APIs",
            "GraphQL",
        ],
    },
    stateManagement: {
        title: dictionary.skills.categories.stateManagement,
        items: [
            "Context API",
            "Akita",
            "Vuex",
            "Redux",
        ],
    },
    devOps: {
        title: dictionary.skills.categories.devOps,
        items: [
            "Vercel",
            "Docker",
            "AWS (S3, Lambda, DynamoDB)",
            "DataDog",
            "Amplitude",
            "GitHub Actions",
            "CI/CD pipelines",
        ],
    },
    database: {
        title: dictionary.skills.categories.database,
        items: [
            "Postgres",
            "Neon",
            "Supabase",
            "MySQL",
            "MongoDB",
        "Drizzle ORM",
        ],
    },
    others: {
        title: dictionary.skills.categories.others,
        items: [
            "UI/UX Design",
            "Design Systems",
            "SEO",
            "Agile methodologies",
            "Test-driven development (TDD)",
            "Storybook",
            "Photoshop",
            "Illustrator",
            "CorelDraw",
            "Figma",
            "Jira",
            "PostHog",
            "Sentry",
        ],
    },
}

export function SkillsSection({ dictionary }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <AnimateOnScroll animation="fade" duration={0.8}>
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{dictionary.skills.title}</h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
            {Object.entries(skills).map(([key, skill], index) => (
                <AnimateOnScroll key={key} animation={index % 2 === 0 ? "slide-right" : "slide-left"} duration={0.6} delay={0.1 * index}>
                    <h3 className="text-xl font-bold mb-4">{skill.title}</h3>
                    <div className="flex flex-wrap gap-3">
                        {skill.items.map((item) => (
                            <span
                                key={item}
                                className="px-3 py-1 text-sm bg-deep-purple-100 dark:bg-deep-purple-900 text-deep-purple-800 dark:text-deep-purple-200 rounded-full"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </AnimateOnScroll>
            ))}
        </div>
  </section>
  )
}
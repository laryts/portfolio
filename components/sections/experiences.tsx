import { AnimateOnScroll } from "../animate-on-scroll";
import { ExperienceItem } from "../experience-item";

type ExperiencesSectionProps = {
    dictionary: any
}

export function ExperiencesSection({ dictionary }: ExperiencesSectionProps) {
    return (
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
    )
}

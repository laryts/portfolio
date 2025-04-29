import { AnimateOnScroll } from "../animate-on-scroll";
import { ProjectCard } from "../project-card";

type ProjectsSectionProps = {
  dictionary: any
}

export function ProjectsSection({ dictionary }: ProjectsSectionProps) {
  return (
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
  )
}
import { AnimateOnScroll } from "../animate-on-scroll";
import { ProjectCard } from "../project-card";

type ProjectsSectionProps = {
  dictionary: any
}

export function ProjectsSection({ dictionary }: ProjectsSectionProps) {
  const rawItems = dictionary.projects?.items ?? []
  const items = [...rawItems].sort((a: { year?: string }, b: { year?: string }) => {
    const yearA = a.year ?? "0"
    const yearB = b.year ?? "0"
    return Number(yearB) - Number(yearA)
  })

  return (
    <section
      id="projects"
      className="py-20 px-4 md:px-8  transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll animation="fade" duration={0.8}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{dictionary.projects.title}</h2>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((project: { name: string; description: string; url: string; imageUrl?: string; year?: string; links?: { label: string; url: string }[] }, index: number) => (
            <AnimateOnScroll key={project.name} className="h-full" animation="zoom" duration={0.6} delay={(index + 1) / 10}>
              <ProjectCard
                title={project.name}
                description={project.description}
                imageUrl={project.imageUrl ?? "/placeholder.svg?height=200&width=300"}
                projectUrl={project.url}
                viewProjectText={dictionary.projects.viewProject}
                year={project.year}
                links={project.links}
              />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
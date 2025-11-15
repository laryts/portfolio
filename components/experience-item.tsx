interface ExperienceItemProps {
  role: string
  url: string
  company: string
  period: string
  description: string
  technologies: string[]
}

export function ExperienceItem({ role, company, url, period, description, technologies }: ExperienceItemProps) {
  return (
    <div className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-deep-purple-900">
      <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-deep-purple-900 -translate-x-[3px]"></div>
      <div className="mb-1">
        <h3 className="text-xl font-bold">{role}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 dark:text-gray-400 mb-2">
          {/* <span className="font-medium">{company}</span> */}
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-deep-purple-600 dark:text-deep-purple-400 hover:underline">
            {company}
          </a>
          <span className="hidden sm:inline mx-2">•</span>
          <span>{period}</span>
        </div>
      </div>
      <p className="mb-3 text-gray-700 dark:text-gray-300">{description}</p>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 text-xs bg-deep-purple-100 dark:bg-deep-purple-900 text-deep-purple-800 dark:text-deep-purple-200 rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

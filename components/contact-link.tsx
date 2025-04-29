import { Mail, Github, Linkedin } from "lucide-react"

interface ContactLinkProps {
  platform: "email" | "github" | "linkedin"
  href: string
  label: string
}

export function ContactLink({ platform, href, label }: ContactLinkProps) {
  const getIcon = () => {
    switch (platform) {
      case "email":
        return <Mail size={24} />
      case "github":
        return <Github size={24} />
      case "linkedin":
        return <Linkedin size={24} />
      default:
        return null
    }
  }

  return (
    <a
      href={href}
      target={platform !== "email" ? "_blank" : undefined}
      rel={platform !== "email" ? "noopener noreferrer" : undefined}
      className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
    >
      <span className="mb-1">{getIcon()}</span>
      <span className="text-sm">{label}</span>
    </a>
  )
}

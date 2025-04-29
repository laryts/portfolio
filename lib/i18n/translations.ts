export type Locale = "en" | "pt"

export const defaultLocale: Locale = "en"

export interface Translation {
  // Navigation
  nav: {
    about: string
    projects: string
    skills: string
    experience: string
    contact: string
  }
  // Hero section
  hero: {
    title: string
    subtitle: string
    cta: string
    lightMode: string
    darkMode: string
  }
  // About section
  about: {
    title: string
    description: string
    contactButton: string
    projectsButton: string
  }
  // Projects section
  projects: {
    title: string
    viewProject: string
    projectDescriptions: {
      [key: string]: string
    }
  }
  // Skills section
  skills: {
    title: string
  }
  // Experience section
  experience: {
    title: string
    roles: {
      [key: string]: {
        role: string
        company: string
        period: string
        description: string
      }
    }
  }
  // Contact section
  contact: {
    title: string
    description: string
    form: {
      name: string
      email: string
      message: string
      submit: string
    }
  }
  // Footer
  footer: {
    copyright: string
  }
}

export const translations: Record<Locale, Translation> = {
  en: {
    nav: {
      about: "About",
      projects: "Projects",
      skills: "Skills",
      experience: "Experience",
      contact: "Contact",
    },
    hero: {
      title: "Larissa Soares",
      subtitle: "Senior Front-End Engineer",
      cta: "View my work",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
    },
    about: {
      title: "About Me",
      description:
        "Hello! I'm Larissa Soares, a front-end engineer with 7 years of experience creating scalable solutions with React, Next.js, React Native, and a strong focus on design systems and user experience. I've worked as a technical lead and engineering manager, always building bridges between design, product, and technology.",
      contactButton: "Contact me",
      projectsButton: "View projects",
    },
    projects: {
      title: "Projects",
      viewProject: "View project",
      projectDescriptions: {
        IPICMobile:
          "Mobile application for patient and medical appointment management, developed with React Native and RESTful API integration.",
        MGNGWebsite:
          "Institutional website with headless CMS, built with Next.js, Tailwind CSS, and Prismic for content management.",
        FreelancePhotographer:
          "Portfolio for a professional photographer with optimized image gallery and integrated scheduling system.",
      },
    },
    skills: {
      title: "Skills",
    },
    experience: {
      title: "Experience",
      roles: {
        techLead: {
          role: "Tech Lead Front-End",
          company: "TechCorp",
          period: "2021 - Present",
          description:
            "Technical leadership of a team of 8 developers, implementation of design system, front-end microservices architecture, and mentoring of junior developers.",
        },
        seniorDev: {
          role: "Senior Front-End Developer",
          company: "InnovateX",
          period: "2018 - 2021",
          description:
            "Development of web and mobile applications with a focus on performance and accessibility. Implementation of automated tests and CI/CD.",
        },
        frontendDev: {
          role: "Front-End Developer",
          company: "WebSolutions",
          period: "2016 - 2018",
          description:
            "Development of responsive interfaces optimized for SEO. Integration with RESTful APIs and implementation of complex animations.",
        },
      },
    },
    contact: {
      title: "Contact",
      description: "Interested in working together? Get in touch through one of the channels below:",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        submit: "Send message",
      },
    },
    footer: {
      copyright: "All rights reserved.",
    },
  },
  pt: {
    nav: {
      about: "Sobre",
      projects: "Projetos",
      skills: "Habilidades",
      experience: "Experiência",
      contact: "Contato",
    },
    hero: {
      title: "Larissa Soares",
      subtitle: "Engenheira Front-End Sênior",
      cta: "Conheça meu trabalho",
      lightMode: "Modo Claro",
      darkMode: "Modo Escuro",
    },
    about: {
      title: "Sobre Mim",
      description:
        "Olá! Sou Larissa Soares, engenheira front-end com 7 anos de experiência criando soluções escaláveis com React, Next.js, React Native e muito foco em design system e experiência do usuário. Já atuei como líder técnica e gerente de engenharia, sempre construindo pontes entre design, produto e tecnologia.",
      contactButton: "Entre em contato",
      projectsButton: "Ver projetos",
    },
    projects: {
      title: "Projetos",
      viewProject: "Ver projeto",
      projectDescriptions: {
        IPICMobile:
          "Aplicativo mobile para gestão de pacientes e consultas médicas, desenvolvido com React Native e integração com APIs RESTful.",
        MGNGWebsite:
          "Website institucional com CMS headless, construído com Next.js, Tailwind CSS e Prismic para gerenciamento de conteúdo.",
        FreelancePhotographer:
          "Portfolio para fotógrafo profissional com galeria de imagens otimizada e sistema de agendamento integrado.",
      },
    },
    skills: {
      title: "Habilidades",
    },
    experience: {
      title: "Experiência",
      roles: {
        techLead: {
          role: "Tech Lead Front-End",
          company: "TechCorp",
          period: "2021 - Presente",
          description:
            "Liderança técnica de equipe de 8 desenvolvedores, implementação de design system, arquitetura de microsserviços front-end e mentoria de desenvolvedores júnior.",
        },
        seniorDev: {
          role: "Senior Front-End Developer",
          company: "InnovateX",
          period: "2018 - 2021",
          description:
            "Desenvolvimento de aplicações web e mobile com foco em performance e acessibilidade. Implementação de testes automatizados e CI/CD.",
        },
        frontendDev: {
          role: "Front-End Developer",
          company: "WebSolutions",
          period: "2016 - 2018",
          description:
            "Desenvolvimento de interfaces responsivas e otimizadas para SEO. Integração com APIs RESTful e implementação de animações complexas.",
        },
      },
    },
    contact: {
      title: "Contato",
      description: "Interessado em trabalharmos juntos? Entre em contato através de um dos canais abaixo:",
      form: {
        name: "Nome",
        email: "Email",
        message: "Mensagem",
        submit: "Enviar mensagem",
      },
    },
    footer: {
      copyright: "Todos os direitos reservados.",
    },
  },
}

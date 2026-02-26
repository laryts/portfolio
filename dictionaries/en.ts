export const dictionary = {
  // Navigation
  nav: {
    about: "About",
    projects: "Projects",
    skills: "Skills",
    experience: "Experience",
    blog: "Blog",
    contact: "Contact",
  },
  // Hero section
  hero: {
    title: "Larissa Soares",
    subtitle: "Senior Front-End Engineer",
    cta: "View my work",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
  },
  // About section
  about: {
    title: "About Me",
    description:
      "Hi, I'm Larissa — a Senior Front-End Engineer with over 9 years of experience developing scalable web applications, with strong specialization in JavaScript and TypeScript. Worked on large-scale projects, including educational platforms, streaming, offline-first PWAs and complex administrative systems. Solid experience in frontend architecture, performance, accessibility, CI/CD and integration with authentication, analytics and microservices. Background at leading Latin American tech companies like Mercado Livre (100M+ users), Méliuz (15M+ users), and PicPay (70M+ users), working in agile environments and high technical complexity.",
    contactButton: "Contact me",
    projectsButton: "View projects",
    downloadResume: "Download Resume",
  },
  // Projects section
  projects: {
    title: "Projects",
    viewProject: "View project",
    items: [
      {
        name: "ICAN Model Management",
        description: "Institutional website for the ICAN Model Management modeling agency.",
        url: "https://www.icanmodelmanagement.com/en/home",
        imageUrl: "/images/icanmodel.png",
        year: "2018",
      },
      {
        name: "Sebrae Streaming",
        description: "Educational streaming platform for Sebrae-SP with internal content admin tool and custom CMS I built, plus educational journeys.",
        url: "https://app-streaming.sebraesp.com.br/",
        imageUrl: "/images/streaming-sebrae.png",
        year: "2025",
      },
      {
        name: "niido",
        description: "App for couples seeking more connection, with emotional check-ins, shared lists and connection map. Designed for neurodivergent couples.",
        url: "https://niido.app/",
        imageUrl: "/images/niido.png",
        year: "2025",
        links: [
          { label: "App Store", url: "https://apps.apple.com/br/app/niido/id6742075036" },
          { label: "Google Play", url: "https://play.google.com/store/apps/details?id=app.niido&pcampaignid=web_share" },
        ],
      },
    ],
  },
  // Skills section
  skills: {
    title: "Skills",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      stateManagement: "State Management",
      devOps: "DevOps & Tools",
      database: "Database",
      leadership: "Leadership",
      others: "Others",
    },
  },
  // Experience section
  experience: {
    title: "Experience",
    viewAll: "View all",
    viewLess: "View less",
    roles: [
      {
        role: "Co-founder & CTO",
        company: "niido",
        url: "https://niido.app/",
        period: "NOV 2024 - Present",
        description:
          "Co-founded and served as CTO of niido, a mobile application focused on user experience, front-end architecture and scalability. Defined technical architecture and stack using React Native (Expo), Next.js and TypeScript. Implemented complex state flows, authentication and timezone-sensitive notifications supporting multiple time zones. Built observability and analytics pipelines for performance and stability monitoring. Led hands-on frontend development, maintaining quality standards, tests and best practices.",
        technologies: ["React Native", "Expo", "Next.js", "TypeScript", "TailwindCSS", "Supabase", "Neon", "Postgres", "Drizzle ORM", "Clerk", "Vercel", "PostHog", "Sentry"],
      },
      {
        role: "Senior Front End Engineer",
        company: "Cast Group",
        period: "AUG 2025 – JAN 2025",
        description:
          "Led development of two large-scale educational platforms for Sebrae-SP, using Nuxt 3, Vue 3 and TypeScript. Built a streaming platform with administrative area (Studio), including: Complete CRUD of content (videos and metadata), User and permission management by profile, Keycloak integration (SSO), Analytics and monitoring dashboards, Offline-first PWA development (Sebrae Móvel) enabling access without internet connection, Interactive games and educational journeys, CI/CD pipeline implementation, code standardization and frontend best practices. Worked closely with designers, product and backend teams, ensuring UX consistency, performance and scalability.",
        technologies: ["Nuxt 3", "Vue 3", "TypeScript", "Pinia", "TailwindCSS", "SCSS", "PWA", "Service Workers", "IndexedDB", "Axios", "Docker", "Azure Pipelines"],
      },
      {
        role: "Software Engineer Manager",
        company: "Unifique",
        url: "https://unifique.com.br/",
        period: "AUG 2024 - FEB 2025",
        description:
          "Managed software development teams, ensuring timely delivery of scalable and innovative solutions. Acted as a bridge between Product (PMs and designers) and Technology teams, facilitating clear communication and alignment on project goals. Led the design and implementation of technical strategies to enhance application performance and improve code maintainability. Implemented career development programs for engineers who lacked growth opportunities, resulting in high team satisfaction with management. Reduced support tickets by 80% through improved processes and team empowerment. Mentored engineers and fostered a collaborative development culture across cross-functional teams.",
        technologies: [],
      },
      {
        role: "Senior Front End Engineer",
        company: "Mercado Livre",
        url: "https://mercadolivre.com/",
        period: "NOV 2023 - AUG 2024",
        description:
          "Led development of logistics optimization platform at Mercado Livre (Latin America's largest e-commerce) using React and Node.js, reducing operational delivery costs and enhancing efficiency. Maintained and improved internal tools for logistics management, supporting cross-functional team objectives. Collaborated with designers and backend developers to ensure seamless integration and high-quality deliverables.",
        technologies: ["React", "Node.js", "Zustand", "DataDog", "GIT", "Jira", "Figma"],
      },
      {
        role: "Senior Mobile Engineer and Supervisor",
        company: "Méliuz",
        url: "https://www.meliuz.com.br/",
        period: "NOV 2021 - AUG 2023",
        description:
          "Managed a team of developers at Méliuz (leading Brazilian fintech), mentoring and guiding them to deliver high-quality solutions. Led mobile development projects using React Native and React, optimizing app performance and integrating advanced analytics tools to track user engagement. Delivered scalable fintech solutions, including a help center module and internal tools, improving customer satisfaction and operational workflows.",
        technologies: ["React Native", "React", "Zustand", "DataDog", "GIT", "Jira", "Figma"],
      },
      {
        role: "Senior Front End Engineer",
        company: "Everest",
        period: "JAN 2023 - JUN 2023",
        description:
          "Developed reusable UI components and contributed to the company's design system. Ensured quality and consistency across applications by leveraging tools like Storybook and collaborating with UI/UX designers.",
        technologies: ["React", "UI", "Design System", "Content Dev", "Storybook"],
      },
      {
        role: "Senior Front End Engineer and Technical Lead",
        company: "PicPay",
        url: "https://picpay.com.br/",
        period: "AUG 2020 - OCT 2021",
        description:
          "Led frontend teams at PicPay (Brazil's leading fintech) and established best practices, ensuring high-quality deliverables across multiple projects. Designed and maintained a scalable design system using StencilJS, significantly improving development speed and UI consistency. Facilitated team training sessions and authored technical documentation to upskill team members.",
        technologies: ["React", "UI", "Design System", "Content Dev", "Storybook"],
      },
      {
        role: "Front End Engineer",
        company: "BRQ",
        url: "https://brq.com.br/",
        period: "AUG 2019 - AUG 2020",
        description:
          "Developed frontend features for large-scale banking systems at BRQ (IT consulting firm providing services to Itaú, Brazil's largest private bank) using Angular. Collaborated closely with design and backend teams to ensure seamless integration and optimal performance.",
        technologies: ["Angular", "GIT", "Jira", "Sketch"],
      },
      {
        role: "Full Stack Engineer",
        company: "Manager Fashion",
        url: "https://managerfashion.com.br/",
        period: "MAR 2017 - JUL 2019",
        description:
          "Delivered full stack web solutions using VueJS and Laravel, enhancing client satisfaction through optimized SEO and responsive designs. Designed and implemented web applications, along with graphic designs for digital and print media.",
        technologies: ["VueJS", "Laravel", "GIT", "PHP", "Photoshop", "Illustrator"],
      },
    ],
  },
  // Blog section (content comes from Sanity; only UI strings here)
  blog: {
    title: "Technical Blog",
    subtitle: "Learning in public — reflections on tech, code, career, and everything in between.",
    readMore: "Read more",
    viewAll: "View all articles",
  },
  // Contact section
  contact: {
    title: "Contact",
    description: "Interested in working together? Get in touch through one of the channels below:",
    location: "São Paulo / SP - Brazil",
    form: {
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Send message",
    },
  },
  // Footer
  footer: {
    copyright: "All rights reserved.",
  },
  // Education
  education: {
    title: "Education",
    degree: "Software Analysis and Development",
    institution: "FATEC P. Prudente",
    period: "JAN 2013 - JUN 2017",
  },
  // GitHub section
  github: {
    title: "GitHub Contributions",
    subtitle: "My coding activity over the past year",
    loading: "Loading contributions...",
    error: "Failed to load GitHub contributions",
    total: "Total contributions",
  },
  // Add this new section
  personal: {
    title: "Personal Side",
    subtitle: "Beyond the code: a bit about who I am when I'm not programming",
    catLover: {
      title: "Cat Lover",
      description:
        "Proud parent of two adorable cats who often supervise my coding sessions from the comfort of my keyboard. Joey (tuxedo) and Jack (tabby).",
    },
    hobbies: {
      title: "Hobbies & Interests",
      items: [
        {
          name: "Cats",
          description:
            "I was lucky enough to adopt two adorable cats who often supervise my coding sessions from the comfort of my keyboard: Joey (tuxedo) and Jack (tabby).",
        },
        {
          name: "Traveling",
          description:
            "Traveling is my therapy. I’ve visited over 10 countries so far — and my bucket list keeps growing (no shame 😄).",
        },
        {
          name: "Reading",
          description:
            "I'm a big fan of suspense novels, especially those with unexpected plot twists that catch me off guard. I also love historical fiction/non-fiction — World War II is one of my favorite topics. Always open to recommendations!",
        },
        {
          name: "Disney",
          description:
            "I'm absolutely in love with the entire Disney universe — from classics to new releases! I love visiting the parks, watching (and rewatching) the movies, collecting Mickey-themed goodies, and getting emotional over every magical detail. ✨🐭",
        },
        {
          name: "Food",
          description:
            "I'm a true foodie! When I travel, one of my favorite things is to find new places to eat and explore local flavors.",
        },
        // {
        //   name: "Photography",
        //   description:
        //     "Amateur photographer in my free time, passionate about capturing urban landscapes and natural scenery.",
        // },
        {
          name: "Games",
          description:
            "Board games, puzzles, and video games have been long-time friends. Add wine and good company, and it’s the perfect combo!",
        },
      ],
    },    
    talkTopics: {
      title: "Let's Talk About",
      description: "Beyond tech, I love discussing:",
      topics: ["Disney", "Travel adventures", "Wine", "Board games", "Cats", "Series (Friends <3)"],
    },
  },
}

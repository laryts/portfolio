export const dictionary = {
  // Navigation
  nav: {
    about: "Sobre",
    projects: "Projetos",
    skills: "Habilidades",
    experience: "Experiência",
    blog: "Blog",
    contact: "Contato",
  },
  // Hero section
  hero: {
    title: "Larissa Soares",
    subtitle: "Sênior Frontend Engineer",
    cta: "Conheça meu trabalho",
    lightMode: "Modo Claro",
    darkMode: "Modo Escuro",
  },
  // About section
  about: {
    title: "Sobre Mim",
    description:
      "Oi, eu sou a Larissa — Engenheira Front-End Sênior com mais de 8 anos de experiência no desenvolvimento de aplicações web escaláveis, com forte especialização em Javascript e TypeScript. Atuação em projetos de grande porte, incluindo plataformas educacionais, streaming, PWAs offline-first e sistemas administrativos complexos. Experiência sólida em arquitetura frontend, performance, acessibilidade, CI/CD e integração com autenticação, analytics e microsserviços. Histórico em empresas líderes de tecnologia da América Latina como Mercado Livre (100M+ usuários), Méliuz (15M+ usuários), e PicPay (70M+ usuários), atuando em ambientes ágeis e de alta complexidade técnica.",
    contactButton: "Entre em contato",
    projectsButton: "Ver projetos",
    downloadResume: "Baixar Currículo",
  },
  // Projects section
  projects: {
    title: "Projetos",
    viewProject: "Ver projeto",
    projectDescriptions: {
      IPICMobile: "Aplicativo móvel desenvolvido em Ionic com backend em PHP (Projeto de TCC).",
      MGNGWebsite:
        "Interface de website para escritório de advocacia projetada no Figma e desenvolvida usando Laravel (PHP), MySQL e VueJS.",
      FreelancePhotographer: "Website para fotógrafo desenvolvido usando NextJS, Vercel, Strapi e Stripe.",
    },
  },
  // Skills section
  skills: {
    title: "Habilidades",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      stateManagement: "Gerenciamento de Estado",
      devOps: "DevOps & Ferramentas",
      database: "Banco de Dados",
      leadership: "Liderança",
      others: "Outros",
    },
  },
  // Experience section
  experience: {
    title: "Experiência",
    viewAll: "Ver mais",
    viewLess: "Ver menos",
    roles: [
      {
        role: "Engenheira Front-End Sênior",
        company: "Cast Group",
        period: "AGO 2025 – JAN 2025",
        description:
          "Liderou o desenvolvimento de duas plataformas educacionais de grande escala para o Sebrae-SP, utilizando Nuxt 3, Vue 3 e TypeScript. Construiu uma plataforma de streaming com área administrativa (Studio), incluindo: CRUD completo de conteúdos (vídeos e metadados), Gestão de usuários e permissões por perfil, Integração com Keycloak (SSO), Dashboards de analytics e monitoramento, Desenvolvimento de PWA offline-first (Sebrae Móvel) permitindo acesso sem conexão à internet, Jogos interativos e jornadas educacionais, Implementação de pipeline CI/CD, padronização de código e boas práticas de frontend. Atuou próxima a designers, produto e backend, garantindo consistência de UX, performance e escalabilidade.",
        technologies: ["Nuxt 3", "Vue 3", "TypeScript", "Pinia", "TailwindCSS", "SCSS", "PWA", "Service Workers", "IndexedDB", "Axios", "Docker", "Azure Pipelines"],
      },
      {
        role: "CTO & Co-fundadora",
        company: "niido",
        url: "https://niido.app/",
        period: "NOV 2024 - Atual",
        description:
          "Co-fundou e atuou como CTO do niido, aplicativo mobile focado em experiência do usuário, arquitetura front-end e escalabilidade. Definiu arquitetura técnica e stack utilizando React Native (Expo), Next.js e TypeScript. Implementou fluxos complexos de estado, autenticação e notificações sensíveis a fuso horário suportando múltiplos fusos. Construiu pipelines de observabilidade e analytics para monitoramento de performance e estabilidade. Liderou desenvolvimento frontend hands-on, mantendo padrões de qualidade, testes e boas práticas.",
        technologies: ["React Native", "Expo", "Next.js", "TypeScript", "TailwindCSS", "Supabase", "Neon", "Postgres", "Drizzle ORM", "Clerk", "Vercel", "PostHog", "Sentry"],
      },
      {
        role: "Gerente de Engenharia de Software",
        company: "Unifique",
        url: "https://unifique.com.br/",
        period: "AGO 2024 - FEV 2025",
        description:
          "Gerenciou equipes de desenvolvimento de software, garantindo entrega pontual de soluções escaláveis e inovadoras. Atuou como ponte entre as equipes de Produto (PMs e designers) e Tecnologia, facilitando comunicação clara e alinhamento nos objetivos do projeto. Liderou o design e implementação de estratégias técnicas para melhorar performance da aplicação e aumentar manutenibilidade do código. Implementou programas de desenvolvimento de carreira para engenheiros que careciam de oportunidades de crescimento, resultando em alta satisfação da equipe com a gestão. Reduziu tickets de suporte em 80% através de processos melhorados e empoderamento da equipe. Mentoriou engenheiros e promoveu cultura de desenvolvimento colaborativo entre equipes multifuncionais.",
        technologies: [],
      },
      {
        role: "Engenheira Front-End Sênior",
        company: "Mercado Livre",
        url: "https://mercadolivre.com/",
        period: "NOV 2023 - AGO 2024",
        description:
          "Liderou o desenvolvimento de plataforma de otimização logística no Mercado Livre (maior e-commerce da América Latina) usando React e Node.js, reduzindo custos operacionais de entrega e aumentando a eficiência. Manteve e melhorou ferramentas internas para gerenciamento logístico, apoiando objetivos de equipes multifuncionais. Colaborou com designers e desenvolvedores backend para garantir integração perfeita e entregas de alta qualidade.",
        technologies: ["React", "Node.js", "Zustand", "DataDog", "GIT", "Jira", "Figma"],
      },
      {
        role: "Engenheira Mobile Sênior e Supervisora",
        company: "Méliuz",
        url: "https://www.meliuz.com.br/",
        period: "NOV 2021 - AGO 2023",
        description:
          "Gerenciou equipe de desenvolvedores no Méliuz (fintech líder brasileira), orientando e guiando-os para entregar soluções de alta qualidade. Liderou projetos de desenvolvimento mobile usando React Native e React, otimizando desempenho do aplicativo e integrando ferramentas avançadas de análise para acompanhar engajamento do usuário. Entregou soluções fintech escaláveis, incluindo módulo de central de ajuda e ferramentas internas, melhorando satisfação do cliente e fluxos de trabalho operacionais.",
        technologies: ["React Native", "React", "Zustand", "DataDog", "GIT", "Jira", "Figma"],
      },
      {
        role: "Engenheira Front-End Sênior",
        company: "Everest",
        period: "JAN 2023 - JUN 2023",
        description:
          "Desenvolveu componentes de UI reutilizáveis e contribuiu para o design system da empresa. Garantiu qualidade e consistência em todas as aplicações utilizando ferramentas como Storybook e colaborando com designers de UI/UX.",
        technologies: ["React", "UI", "Design System", "Content Dev", "Storybook"],
      },
      {
        role: "Engenheira Front-End Sênior e Líder Técnica",
        company: "PicPay",
        url: "https://picpay.com.br/",
        period: "AGO 2020 - OUT 2021",
        description:
          "Liderou equipes de frontend no PicPay (fintech líder brasileira) e estabeleceu melhores práticas, garantindo entregas de alta qualidade em vários projetos. Projetou e manteve design system escalável usando StencilJS, melhorando significativamente velocidade de desenvolvimento e consistência da UI. Facilitou sessões de treinamento da equipe e elaborou documentação técnica para aprimorar habilidades dos membros da equipe.",
        technologies: ["React", "UI", "Design System", "Content Dev", "Storybook"],
      },
      {
        role: "Engenheira Front-End",
        company: "BRQ",
        url: "https://brq.com.br/",
        period: "AGO 2019 - AGO 2020",
        description:
          "Desenvolveu recursos frontend para sistemas bancários de grande escala na BRQ (consultoria de TI que presta serviços para o Itaú, maior banco privado do Brasil) usando Angular. Colaborou estreitamente com equipes de design e backend para garantir integração perfeita e desempenho ideal.",
        technologies: ["Angular", "GIT", "Jira", "Sketch"],
      },
      {
        role: "Engenheira Full Stack",
        company: "Manager Fashion",
        url: "https://managerfashion.com.br/",
        period: "MAR 2017 - JUL 2019",
        description:
          "Entregou soluções web full stack usando VueJS e Laravel, aumentando a satisfação do cliente através de SEO otimizado e designs responsivos. Projetou e implementou aplicações web, junto com designs gráficos para mídia digital e impressa.",
        technologies: ["VueJS", "Laravel", "GIT", "PHP", "Photoshop", "Illustrator"],
      },
    ],
  },
  // Blog section
  blog: {
    title: "Blog Técnico",
    subtitle: "Compartilhando insights e experiências da minha jornada no desenvolvimento de software",
    readMore: "Ler mais",
    viewAll: "Ver todos os artigos",
    posts: {
      reactPerformance: {
        title: "Otimizando Performance em React: Uma Análise Profunda",
        date: "15 de Março de 2024",
        summary:
          "A otimização de performance é crucial para oferecer uma experiência de usuário fluida em aplicações React. Neste artigo, exploro técnicas avançadas para identificar e resolver gargalos de performance.",
        tags: ["React", "Performance", "Otimização"],
      },
      designSystems: {
        title: "Construindo Design Systems Escaláveis com StencilJS",
        date: "2 de Fevereiro de 2024",
        summary:
          "Design systems são essenciais para manter consistência em aplicações de grande porte. Aprenda como utilizar StencilJS para criar componentes web reutilizáveis que funcionam em qualquer framework.",
        tags: ["Design Systems", "StencilJS", "Web Components"],
      },
      mobileDevTips: {
        title: "Melhores Práticas em React Native em 2024",
        date: "10 de Janeiro de 2024",
        summary:
          "Após anos trabalhando com React Native, compilei uma lista de melhores práticas que podem ajudar você a construir aplicações móveis mais sustentáveis e performáticas.",
        tags: ["React Native", "Desenvolvimento Mobile", "Melhores Práticas"],
      },
      generalista: {
        title: "Sou um Pato (e está tudo bem!) 🦆",
        date: "15 de Janeiro de 2025",
        summary:
          "Depois de 10 anos de experiência profissional, posso afirmar: sou um pato. Ou melhor, uma pata. Descubra como ser generalista se tornou meu diferencial na carreira de tecnologia.",
        tags: ["Carreira", "Desenvolvimento", "Generalista", "Full Cycle"],
      },
    },
  },
  // Contact section
  contact: {
    title: "Contato",
    description: "Interessado em trabalharmos juntos? Entre em contato através de um dos canais abaixo:",
    location: "São Paulo / SP - Brasil",
    form: {
      name: "Nome",
      email: "Email",
      message: "Mensagem",
      submit: "Enviar mensagem",
    },
  },
  // GitHub section
  github: {
    title: "Contribuições no GitHub",
    subtitle: "Minha atividade de código durante o último ano",
    loading: "Carregando contribuições...",
    error: "Falha ao carregar contribuições do GitHub",
    total: "Total de contribuições",
  },
  // Footer
  footer: {
    copyright: "Todos os direitos reservados.",
  },
  // Education
  education: {
    title: "Educação",
    degree: "Análise e Desenvolvimento de Sistemas",
    institution: "FATEC P. Prudente",
    period: "JAN 2013 - JUN 2017",
  },
  // Add this new section
  personal: {
    title: "Lado Pessoal",
    subtitle: "Além do código: um pouco sobre quem eu sou quando não estou programando",
    catLover: {
      title: "Amante de Gatos",
      description:
        "Tive a sorte de adotar dois adoráveis gatinhos que frequentemente supervisionam minhas sessões de programação do conforto do meu teclado. Joey (frajola) e Jack (rajado).",
    },
    hobbies: {
      title: "Hobbies & Interesses",
      items: [
        {
          name: "Gatos",
          description:
            "Tive a sorte de adotar dois adoráveis gatinhos que frequentemente supervisionam minhas sessões de programação do conforto do meu teclado: Joey (frajola) e Jack (rajado).",
        },
        {
          name: "Viagens",
          description:
            "Viajar é minha terapia. Já conheci mais de 10 países — e a lista de desejos só cresce (rs).",
        },
        {
          name: "Leitura",
          description:
            "Sou fã de livros de suspense, especialmente quando têm um plot twist que me pega desprevenida. Também adoro ficção/não ficção histórica — Segunda Guerra é um dos meus temas preferidos. Aceito recomendações!",
        },
        {
          name: "Disney",
          description:
            "Sou apaixonada por todo o universo Disney — dos clássicos aos lançamentos! Amo ir aos parques, assistir (e reassistir) os filmes, colecionar coisinhas do Mickey e me emocionar com cada detalhe mágico. ✨🐭",
        },
        {
          name: "Comida",
          description:
            "Apaixonada por gastronomia! Em cada viagem, uma das minhas missões favoritas é descobrir novos lugares para comer.",
        },
        // {
        //   name: "Fotografia",
        //   description:
        //     "Fotógrafa amadora nas horas vagas, apaixonada por capturar paisagens urbanas e cenas da natureza.",
        // },
        {
          name: "Jogos",
          description:
            "Jogos de tabuleiro, quebra-cabeças e video games são meus companheiros de longa data. Melhor ainda quando acompanhados de vinho e bons amigos!",
        },
      ],
    },
    talkTopics: {
      title: "Vamos Conversar Sobre",
      description: "Além de tecnologia, adoro discutir sobre:",
      topics: ["Disney", "Viagens", "Vinhos", "Jogos", "Gatos", "Séries (Friends <3)"],
    },
  },
}

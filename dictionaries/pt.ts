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
    subtitle: "Engenheira de Software Sênior",
    cta: "Conheça meu trabalho",
    lightMode: "Modo Claro",
    darkMode: "Modo Escuro",
  },
  // About section
  about: {
    title: "Sobre Mim",
    description:
      "Oi, eu sou a Larissa — Engenheira de Software Sênior com 8 anos de experiência transformando ideias em aplicações web escaláveis e centradas no usuário. Especialista em React, me destaco em ambientes colaborativos e adoro construir produtos que geram impacto real. Seja liderando um time ou escrevendo um código limpo e cuidadoso, sou movida por propósito e resultado.",
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
        role: "Gerente de Engenharia de Software",
        company: "Unifique",
        url: "https://unifique.com.br/",
        period: "AGO 2024 - FEV 2025",
        description:
          "Supervisão de equipes de desenvolvimento de software, garantindo a entrega pontual de soluções escaláveis e inovadoras. Atuando como ponte entre as equipes de Produto (PMs e designers) e Tecnologia, facilitando a comunicação clara e o alinhamento nos objetivos do projeto. Liderando o design e implementação de estratégias técnicas para melhorar o desempenho e a manutenção da aplicação. Mentoria de engenheiros e promoção de uma cultura de desenvolvimento colaborativo entre equipes multifuncionais.",
        technologies: [],
      },
      {
        role: "Engenheira Front-End Sênior",
        company: "Mercado Livre",
        url: "https://mercadolivre.com/",
        period: "NOV 2023 - AGO 2024",
        description:
          "Liderou o desenvolvimento de uma plataforma de otimização logística usando React e Node.js, reduzindo custos operacionais de entrega e aumentando a eficiência. Manteve e melhorou ferramentas internas para gerenciamento logístico, apoiando objetivos de equipes multifuncionais. Colaborou com designers e desenvolvedores backend para garantir integração perfeita e entregas de alta qualidade.",
        technologies: ["React", "Node.js", "Zustand", "DataDog", "GIT", "Jira", "Figma"],
      },
      {
        role: "Engenheira Mobile Sênior e Supervisora",
        company: "Méliuz",
        url: "https://www.meliuz.com.br/",
        period: "NOV 2021 - AGO 2023",
        description:
          "Gerenciou uma equipe de desenvolvedores, orientando e guiando-os para entregar soluções de alta qualidade. Liderou projetos de desenvolvimento mobile usando React Native e React, otimizando o desempenho do aplicativo e integrando ferramentas avançadas de análise para acompanhar o engajamento do usuário. Entregou soluções fintech escaláveis, incluindo um módulo de central de ajuda e ferramentas internas, melhorando a satisfação do cliente e os fluxos de trabalho operacionais.",
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
          "Liderou equipes de frontend e estabeleceu melhores práticas, garantindo entregas de alta qualidade em vários projetos. Projetou e manteve um design system escalável usando StencilJS, melhorando significativamente a velocidade de desenvolvimento e a consistência da UI. Facilitou sessões de treinamento da equipe e elaborou documentação técnica para aprimorar as habilidades dos membros da equipe.",
        technologies: ["React", "UI", "Design System", "Content Dev", "Storybook"],
      },
      {
        role: "Engenheira Front-End",
        company: "BRQ",
        url: "https://brq.com.br/",
        period: "AGO 2019 - AGO 2020",
        description:
          "Desenvolveu recursos frontend para sistemas bancários de grande escala usando Angular. Colaborou estreitamente com equipes de design e backend para garantir integração perfeita e desempenho ideal.",
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
    },hobbies: {
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

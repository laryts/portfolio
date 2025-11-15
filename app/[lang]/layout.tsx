import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { locales } from "@/proxy"
import type { Locale } from "@/types/i18n"
import { getDictionary } from "@/dictionaries"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const dictionary = await getDictionary(resolvedParams.lang)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://larissasoares.dev"
  
  const isEnglish = resolvedParams.lang === "en"
  const title = isEnglish 
    ? "Larissa Soares | Senior Software Engineer"
    : "Larissa Soares | Engenheira de Software Sênior"
  const description = isEnglish
    ? "Portfolio of Larissa Soares, a Senior Software Engineer with 8 years of experience in React, Next.js, and React Native. Specializing in building scalable, user-focused web applications."
    : "Portfólio de Larissa Soares, Engenheira de Software Sênior com 8 anos de experiência em React, Next.js e React Native. Especialista em construir aplicações web escaláveis e centradas no usuário."

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${isEnglish ? "Larissa Soares" : "Larissa Soares"}`,
    },
    description,
    keywords: isEnglish
      ? ["Larissa Soares", "Software Engineer", "React", "Next.js", "React Native", "Frontend Developer", "Web Development", "Portfolio"]
      : ["Larissa Soares", "Engenheira de Software", "React", "Next.js", "React Native", "Desenvolvedora Frontend", "Desenvolvimento Web", "Portfólio"],
    authors: [{ name: "Larissa Soares" }],
    creator: "Larissa Soares",
    publisher: "Larissa Soares",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: resolvedParams.lang === "en" ? "en_US" : "pt_BR",
      alternateLocale: resolvedParams.lang === "en" ? "pt_BR" : "en_US",
      url: `${siteUrl}/${resolvedParams.lang}`,
      siteName: "Larissa Soares Portfolio",
      title,
      description,
      images: [
        {
          url: `${siteUrl}/images/larissa.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/images/larissa.jpg`],
      creator: "@larissasoares",
    },
    alternates: {
      canonical: `${siteUrl}/${resolvedParams.lang}`,
      languages: {
        en: `${siteUrl}/en`,
        pt: `${siteUrl}/pt`,
        "x-default": `${siteUrl}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  }
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}) {
  const resolvedParams = await params
  const dictionary = await getDictionary(resolvedParams.lang)

  return (
    <html lang={resolvedParams.lang} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          storageKey="theme"
        >
          <Header lang={resolvedParams.lang} dictionary={dictionary} />
          {children}
          <Footer dictionary={dictionary} />
        </ThemeProvider>
      </body>
    </html>
  )
}

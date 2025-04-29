import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { locales } from "@/middleware"
import type { Locale } from "@/types/i18n"
import { getDictionary } from "@/dictionaries"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Larissa Soares | Senior Front-End Engineer",
  description:
    "Portfolio of Larissa Soares, a front-end engineer with 7 years of experience in React, Next.js, and React Native.",
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          <Header lang={resolvedParams.lang} dictionary={dictionary} />
          {children}
          <Footer dictionary={dictionary} />
        </ThemeProvider>
      </body>
    </html>
  )
}

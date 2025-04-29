import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { locales } from "@/middleware"
import type { Locale } from "@/types/i18n"
import { getDictionary } from "@/dictionaries"

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
  params: { lang: Locale }
}) {
  const dictionary = getDictionary(params.lang)

  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          <Header lang={params.lang} dictionary={dictionary} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

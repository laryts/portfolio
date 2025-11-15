import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { normalizeUrl } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL)

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Larissa Soares | Senior Software Engineer",
    template: "%s | Larissa Soares",
  },
  description:
    "Portfolio of Larissa Soares, a Senior Software Engineer with 8 years of experience in React, Next.js, and React Native. Specializing in building scalable, user-focused web applications.",
  keywords: ["Larissa Soares", "Software Engineer", "React", "Next.js", "React Native", "Frontend Developer", "Web Development", "Portfolio"],
  authors: [{ name: "Larissa Soares" }],
  creator: "Larissa Soares",
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
